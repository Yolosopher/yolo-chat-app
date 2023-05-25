import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import ChatModel from '../models/chat.model';
import UserModel from '../models/user.model';

export const accessChat = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const { userId } = req.body;

		if (!userId) {
			res.status(400);
			throw new Error('UserId param not sent with request');
		}

		var isChat: any = await ChatModel.find({
			isGroupChat: false,
			$and: [
				// @ts-ignore
				{ users: { $elemMatch: { $eq: req.user._id } } },
				{ users: { $elemMatch: { $eq: userId } } },
			],
		})
			.populate('users', '-password')
			.populate('latestMessage');

		isChat = await UserModel.populate(isChat, {
			path: 'latestMessage.sender',
			select: 'name pic email',
		});

		if (isChat.length > 0) {
			res.status(200).json(isChat[0]);
		} else {
			var chatData = {
				chatName: 'sender',
				isGroupChat: false,
				// @ts-ignore
				users: [req.user._id, userId],
			};

			try {
				const createdChat = await ChatModel.create(chatData);

				const FullChat = await ChatModel.findById(
					createdChat._id
				).populate('users', '-password');

				res.status(201).json(FullChat);
			} catch (error) {
				res.status(400);
				throw new Error(error.message);
			}
		}
	}
);

export const fetchChats = expressAsyncHandler(
	async (req: Request, res: Response) => {
		var chat: any = await ChatModel.find({
			users: {
				// @ts-ignore
				$elemMatch: { $eq: req.user._id },
			},
		})
			.populate('users', '-password')
			.populate('groupAdmin', '-password')
			.populate('latestMessage')
			.sort({ updatedAt: -1 });

		chat = await UserModel.populate(chat, {
			path: 'latestMessage.sender',
			select: 'name pic email',
		});
		res.status(200).json(chat);
	}
);

export const createGroupChat = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const name = req.body.name;
		const users = req.body.users;

		if (!users || !name) {
			res.status(400);
			throw new Error('Missing required parameters');
		}
		if (!Array.isArray(users)) {
			res.status(400);
			throw new Error('users must be an array');
		}
		if (users.length < 1) {
			res.status(400);
			throw new Error(
				'You can not create a group chat with less than 2 users'
			);
		}

		// @ts-ignore
		users.push(req.user._id);

		try {
			const groupChat = await ChatModel.create({
				chatName: name,
				isGroupChat: true,
				users: users,
				// @ts-ignore
				groupAdmin: req.user._id,
			});

			const fullGroupChat = await ChatModel.findById(groupChat._id)
				.populate('users', '-password')
				.populate('groupAdmin', '-password');

			res.status(201).json(fullGroupChat);
		} catch (error) {
			res.status(400);
			throw new Error(error.message);
		}
	}
);

export const renameGroup = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const { chatId, name } = req.body;

		const updatedChat = await ChatModel.findByIdAndUpdate(
			chatId,
			{
				chatName: name,
			},
			{
				new: true,
			}
		)
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		if (!updatedChat) {
			res.status(400);
			throw new Error('Chat not found');
		} else {
			res.status(200).json(updatedChat);
		}
	}
);

export const addToGroup = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const { chatId, userId } = req.body;

		const updatedChat = await ChatModel.findByIdAndUpdate(
			chatId,
			{
				$push: { users: userId },
			},
			{
				new: true,
			}
		)
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		if (!updatedChat) {
			res.status(400);
			throw new Error('Chat not found');
		} else {
			res.status(200).json(updatedChat);
		}
	}
);

export const removeFromGroup = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const { chatId, userId } = req.body;

		const removedFromChat = await ChatModel.findByIdAndUpdate(
			chatId,
			{
				$pull: { users: userId },
			},
			{
				new: true,
			}
		)
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		if (!removedFromChat) {
			res.status(400);
			throw new Error('Chat not found');
		} else {
			res.status(200).json(removedFromChat);
		}
	}
);

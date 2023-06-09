import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import MessageModel from '../models/message.model';
import UserModel from '../models/user.model';
import ChatModel from '../models/chat.model';
import NotificationModel from '../models/notification.model';

export const sendMessage = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const { content, chatId } = req.body;

		if (!content || !chatId) {
			res.status(400);
			throw new Error('Invalid message data');
		}

		var newMessage = {
			// @ts-ignore
			sender: req.user._id,
			content,
			chat: chatId,
		};

		try {
			var message: any = await MessageModel.create(newMessage);

			message = await message.populate('sender', 'name pic');
			message = await message.populate('chat');
			message = await UserModel.populate(message, {
				path: 'chat.users',
				select: 'name pic email',
			});

			const updatedChat = await ChatModel.findByIdAndUpdate(
				chatId,
				{
					latestMessage: message,
				},
				{ new: true }
			);

			for (let i = 0; i < updatedChat.users.length; i++) {
				const userId = String(updatedChat.users[i]);
				// @ts-ignore
				const selfId = String(req.user._id);
				console.log('comparing 2:');
				console.log(userId);
				console.log(selfId);
				// @ts-ignore
				console.log(selfId !== userId);
				// @ts-ignore
				if (selfId !== userId) {
					// add notification
					await NotificationModel.findOneAndUpdate(
						{ user: userId },
						{
							$push: { messages: message._id },
						}
					);
				}
			}

			res.status(200).json(message);
		} catch (error) {
			res.status(400);
			throw new Error(error.message);
		}
	}
);

export const allMessages = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const chatId = req.params.chatId;
		if (!chatId || typeof chatId !== 'string')
			throw new Error('Invalid chatId');

		try {
			const messages = await MessageModel.find({
				chat: req.params.chatId,
			})
				.populate('sender', 'name pic email')
				.populate('chat');

			res.status(200).json(messages);
		} catch (error) {
			res.status(400);
			throw new Error(error.message);
		}
	}
);

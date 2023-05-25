import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import NotifModel from '../models/notification.model';
import UserModel from '../models/user.model';

export const readNotification = expressAsyncHandler(
	async (req: Request, res: Response) => {
		// @ts-ignore
		const userId = req.user?._id;

		const messageId = req.params.messageId;

		if (!messageId) {
			res.status(400);
			throw new Error('Message ID is required');
		}

		const updatedNotification = await NotifModel.findOneAndUpdate(
			{
				user: userId,
			},
			{
				$pull: { messages: messageId },
			}
		);
		if (!updatedNotification) {
			res.status(404);
			throw new Error('Notification not found');
		}

		// check if message was inside and got removed
		if (updatedNotification.messages.find(m => String(m) === messageId)) {
			res.status(200).json({
				message: 'Message was removed',
				success: true,
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Message was not inside your notifications',
			});
		}
	}
);

export const addNewNotification = expressAsyncHandler(
	async (req: Request, res: Response) => {
		// @ts-ignore
		const userId = req.user?._id;

		const messageId = req.params.messageId;

		if (!messageId) {
			res.status(400);
			throw new Error('Message ID is required');
		}

		const updatedNotification = await NotifModel.findOneAndUpdate(
			{
				user: userId,
			},
			{
				$push: { messages: messageId },
			},
			{
				new: true,
			}
		)
			.populate('user', '-password')
			.populate('messages');
		if (!updatedNotification) {
			res.status(404);
			throw new Error('Notification not found');
		}

		res.status(200).json(updatedNotification);
	}
);

export const accessFetchNotifications = expressAsyncHandler(
	async (req: Request, res: Response) => {
		// @ts-ignore
		const userId = req.user?._id;

		const foundNotification = await NotifModel.findOne({ user: userId })
			.populate('messages')
			.populate('user', '-password');

		if (!foundNotification) {
			// create new notification
			var newNotification: any = await NotifModel.create({
				user: userId,
				messages: [],
			});

			// newNotification = await newNotification.populate('messages');

			newNotification = await UserModel.populate(newNotification, {
				path: 'user',
				select: 'name pic email',
			});

			res.status(201).json(newNotification);
		} else {
			res.status(200).json(foundNotification);
		}
	}
);

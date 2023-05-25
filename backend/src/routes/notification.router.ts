import { Router } from 'express';
import {
	accessFetchNotifications,
	readNotification,
	addNewNotification,
} from '../controllers/notification.controller';
import protect from '../middlewares/auth.middleware';

const notificationRoutes = Router();

notificationRoutes
	.route('/:messageId')
	.delete(protect, readNotification)
	.post(protect, addNewNotification);

notificationRoutes.route('/').get(protect, accessFetchNotifications);

export default notificationRoutes;

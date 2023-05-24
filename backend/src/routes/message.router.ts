import { Router } from 'express';
import protect from '../middlewares/auth.middleware';
import { allMessages, sendMessage } from '../controllers/message.controller';

const messageRoutes = Router();

messageRoutes.route('/').post(protect, sendMessage);
messageRoutes.route('/:chatId').get(protect, allMessages);

export default messageRoutes;

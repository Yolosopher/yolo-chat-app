import { Router } from 'express';
import protect from '../middlewares/auth.middleware';
import {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
} from '../controllers/chat.controller';

const chatRoutes = Router();

chatRoutes.route('/').post(protect, accessChat).get(protect, fetchChats);

chatRoutes.route('/group/remove').put(protect, removeFromGroup); // remove user from group
chatRoutes.route('/group/add').put(protect, addToGroup); // add to group

chatRoutes
	.route('/group')
	.post(protect, createGroupChat) //create
	.put(protect, renameGroup); // rename

export default chatRoutes;

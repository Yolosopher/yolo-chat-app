import { Request, Response, Router } from 'express';
import {
	loginUser,
	registerUser,
	allUsers,
	checkToken,
} from '../controllers/user.controller';
import protect from '../middlewares/auth.middleware';

const userRoutes = Router();

userRoutes
	.route('/')
	.get(protect, allUsers)
	.post(loginUser)
	.patch(protect, checkToken);
userRoutes.route('/register').post(registerUser);

export default userRoutes;

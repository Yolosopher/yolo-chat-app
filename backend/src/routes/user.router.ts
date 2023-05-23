import { Request, Response, Router } from 'express';
import {
	loginUser,
	registerUser,
	allUsers,
} from '../controllers/user.controller';
import protect from '../middlewares/auth.middleware';

const userRoutes = Router();

userRoutes.route('/').get(protect, allUsers).post(loginUser);
userRoutes.route('/register').post(registerUser);

export default userRoutes;

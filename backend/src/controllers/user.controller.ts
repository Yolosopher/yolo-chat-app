import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import UserModel from '../models/user.model';
import { generateToken } from '../utils/jwt';

export const registerUser = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const { name, email, password, pic } = req.body;

		if (!name || !email || !password) {
			res.status(400);
			throw new Error('Please enter all fields');
		}

		const userExists = await UserModel.findOne({ email });

		if (userExists) {
			res.status(409);
			throw new Error('User already exists');
		}

		const user = await UserModel.create({
			name,
			email,
			password,
			pic,
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				pic: user.pic,
				isAdmin: user.isAdmin,
				token: generateToken(String(user._id)),
			});
		} else {
			res.status(400);
			throw new Error('Failed to CREATE the user');
		}
	}
);

export const loginUser = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const user = await UserModel.findOne({ email });

		// @ts-ignore
		if (user && (await user.matchPassword(password))) {
			res.status(200).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				pic: user.pic,
				isAdmin: user.isAdmin,
				token: generateToken(String(user._id)),
			});
		} else {
			res.status(401);
			throw new Error('Invalid email or password');
		}
	}
);

export const allUsers = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const keyword = req.query.search
			? {
					$or: [
						{ name: { $regex: req.query.search, $options: 'i' } },
						{ email: { $regex: req.query.search, $options: 'i' } },
					],
			  }
			: {};

		const users = await UserModel.find(keyword).find({
			// @ts-ignore
			_id: { $ne: req.user?._id },
		});

		res.status(200).json(users);
	}
);

export const checkToken = expressAsyncHandler(
	async (req: Request, res: Response) => {
		// @ts-ignore
		res.status(200).json({ token: req.user?.token });
	}
);

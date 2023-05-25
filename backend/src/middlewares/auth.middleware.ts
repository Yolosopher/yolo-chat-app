import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { verifyToken } from '../utils/jwt';
import UserModel from '../models/user.model';

const protect = expressAsyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			try {
				token = req.headers.authorization.split(' ')[1];

				// decodes token id
				const decoded = verifyToken(token);

				// @ts-ignore
				req.user = await UserModel.findById(decoded.id).select(
					'-password'
				);

				// @ts-ignore
				req.token = token;

				next();
			} catch (error) {
				res.status(401);
				throw new Error('Not authorized, token failed');
			}
		}

		if (!token) {
			res.status(401);
			throw new Error('Not authorized, no token');
		}
	}
);

export default protect;

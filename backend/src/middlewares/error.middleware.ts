import { NextFunction, Request, Response } from 'express';
import { NODE_ENV } from '../config';

const errorHandlerMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: NODE_ENV === 'production' ? null : err.stack,
	});
};

export default errorHandlerMiddleware;

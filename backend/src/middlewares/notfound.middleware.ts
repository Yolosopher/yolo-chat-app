import { NextFunction, Request, Response } from 'express';

const notFoundMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const error = new Error(`Not found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

export default notFoundMiddleware;

import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET_ONE } from '../config';

export const generateToken = (id: string) => {
	return sign({ id }, JWT_SECRET_ONE, {
		expiresIn: '30d',
	});
};

export const verifyToken = (token: string) => {
	return verify(token, JWT_SECRET_ONE);
};

import { config } from 'dotenv';
config();

export const { PORT, MONGO_URL, REDIS_URL, JWT_SECRET_ONE, JWT_SECRET_TWO, NODE_ENV } =
	process.env;

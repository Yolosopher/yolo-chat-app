import express, { json, static as expStatic } from 'express';

import userRoutes from './routes/user.router';
import notFoundMiddleware from './middlewares/notfound.middleware';
import errorHandlerMiddleware from './middlewares/error.middleware';
import chatRoutes from './routes/chat.router';
import messageRoutes from './routes/message.router';
import { NODE_ENV } from './config';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(json());

// FOR DEPLOYMENT

if (NODE_ENV === 'production') {
	const __dirname = path.resolve();
	app.use(expStatic(path.join(__dirname, '/frontend/build')));
} else {
	app.get('/', (req, res) => {
		res.send('API is running...');
	});
}

// FOR DEPLOYMENT

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;

import express, { json } from 'express';

import userRoutes from './routes/user.router';
import notFoundMiddleware from './middlewares/notfound.middleware';
import errorHandlerMiddleware from './middlewares/error.middleware';
import chatRoutes from './routes/chat.router';
import messageRoutes from './routes/message.router';

const app = express();

app.use(json());

app.get('/', (req, res) => {
	res.send('API is running...');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;

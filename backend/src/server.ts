import mongoose from 'mongoose';
import http from 'http';
import app from './app';
import { PORT, MONGO_URL } from './config';
import 'colors';

const runner = async () => {
	try {
		// connect to mongodb
		const conn = await mongoose.connect(MONGO_URL, {
			// @ts-ignore
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('DB Connected', conn.connection.host);

		// connect to redis client
		// await redisClient.connect();
		// console.log('Redis Connected');

		// initialize http server
		const httpServer = http.createServer(app);

		// socket io
		// const io = socketio(httpServer);
		// console.log(io);

		// start http server
		httpServer.listen(PORT, () =>
			console.log(
				`Server is running on http://localhost:${PORT}`.yellow.bold
			)
		);
	} catch (err) {
		console.log(err.message);
	}
};

runner();

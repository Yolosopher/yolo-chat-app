import mongoose from 'mongoose';
import http from 'http';
import app from './app';
import { PORT, MONGO_URL, NODE_ENV } from './config';
import 'colors';
import socketio from './socketio';

const runner = async () => {
	try {
		// connect to mongodb
		const conn = await mongoose.connect(
			MONGO_URL + (NODE_ENV === 'production' ? '-prod' : ''),
			{
				// @ts-ignore
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log('DB Connected');
		console.log({
			host: conn.connection.host,
			name: conn.connection.name,
			port: conn.connection.port,
		});

		// initialize http server
		const httpServer = http.createServer(app);

		// socket io
		socketio(httpServer);

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

import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

const socketio = (httpServer: HttpServer) => {
	const io = new Server(httpServer, {
		pingTimeout: 60000,
		cors: {
			origin: 'http://localhost:3000',
		},
	});

	io.on('connection', socket => {
		socket.on('setup', userData => {
			socket.join(userData._id);
			socket.emit('connected');
		});

		socket.on('join chat', room => {
			socket.join(room);
		});

		socket.on('new message', newMessageRecieved => {
			const chat = newMessageRecieved.chat;
			if (!chat.users) return;

			chat.users.forEach(user => {
				if (user._id == newMessageRecieved.sender._id) return;

				socket
					.in(user._id)
					.emit('message recieved', newMessageRecieved);
			});
		});

		socket.off('setup', userData => {
			socket.leave(userData._id);
		});
		socket.on('typing', ({ chatId, typer }) => {
			io.in(chatId).emit('typing', { chatId, typer });
		});
		socket.on('stop typing', ({ chatId, typer }) => {
			io.in(chatId).emit('stop typing', { chatId, typer });
		});
	});
};

export default socketio;

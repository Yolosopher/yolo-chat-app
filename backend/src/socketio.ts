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
		console.log('New Connection');

		socket.on('setup', userData => {
			socket.join(userData._id);
			console.log('User Joined', userData._id);
			socket.emit('connected');
		});

		socket.on('join chat', room => {
			socket.join(room);
			console.log('User Joined Chat:', room);
		});

		socket.on('new message', newMessageRecieved => {
			const chat = newMessageRecieved.chat;
			if (!chat.users) return console.log('Chat.users not defined');

			chat.users.forEach(user => {
				if (user._id == newMessageRecieved.sender._id) return;

				socket
					.in(user._id)
					.emit('message recieved', newMessageRecieved);
			});
		});

		socket.off('setup', userData => {
			console.log('User Disconnected');
			socket.leave(userData._id);
		});
		socket.on('typing', room => {
			socket.to(room).emit('typing');
		});
		socket.on('stop typing', room => {
			socket.to(room).emit('stop typing');
		});

		socket.on('disconnect', () => {
			console.log('User Disconnected');
		});
	});
};

export default socketio;

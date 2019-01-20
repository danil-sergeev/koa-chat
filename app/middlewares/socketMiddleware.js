import jwt from 'jsonwebtoken';

import { jwtsecret } from '../config/jwt';
import { sendMessage } from '../controllers';

const socketAuth = (socket, next) => {
	const { token } = socket.handshake.query;

	if (!token) {
		return next(new Error('Failed to authenticate token'));
	}

	return jwt.verify(token, jwtsecret, (err, decoded) => {
		if (err) {
			return next(new Error('Failed to authenticate socker'));
		}
		socket.decoded = decoded;
		return next();
	});
};

export const socketIO = (io) => {
	io.use(socketAuth);

	io.on('connection', (socket) => {
		socket.on('mount-chat', (chatId) => {
			socket.join(chatId);
		});

		socket.on('unmount-chat', (chatId) => {
			socket.leave(chatId);
		});

		socket.on('send-message', (newMessage, fn) => {
			const { chatId, content } = newMessage;
			return sendMessage(socket.decoded.userId, chatId, { content })
				.then(({ success, message }) => {
					io.to(chatId).emit('new-message', {
						success,
						message
					});
					fn({
						success,
						message
					});
				})
				.catch((error) => {
					console.log(error);
				});
		});
	});

	return (ctx, next) => {
		ctx.io = io;
		next();
	};
};

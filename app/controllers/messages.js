import { Message } from '../models';

export const sendMessage = (userId, chatId, data) => {
	const message = new Message(
		Object.assign({}, data, {
			chatId,
			sender: userId,
			statusMessageUserId: userId
		})
	);

	return message
		.save()
		.then((savedMessage) => {
			Message.findById(savedMessage._id)
				.populate({ path: 'sender', select: 'username firstName lastName' })
				.exec();
		})
		.then((savedMessage) => {
			Promise.resolve({
				success: true,
				message: savedMessage
			});
		})
		.catch((reason) => {
			console.error(reason);
		});
};

export const getMessagesByChatId = (chatId) => {
	return Message.find({ chatId: chatId })
		.populate({ path: 'sender', select: 'username firstName lastName' })
		.sort({ createdAt: 1 })
		.exec()
		.then((messages) => {
			Promise.resolve({
				success: true,
				messages: messages
			});
		})
		.catch((reason) => {
			console.error(reason);
		});
};

import Router from 'koa-router';
import {
	getAllChats,
	newChat,
	getMyChats,
	getChat,
	getMessagesByChatId,
	sendMessage,
	joinChat,
	leaveChat,
	deleteChat
} from '../controllers';

const router = new Router({ prefix: '/chats' });

router.get('/', async (ctx) => {
	try {
		ctx.body = await getAllChats();
	} catch (err) {
		ctx.body = err;
	}
});

router.post('/', async (ctx) => {
	try {
		const createdChat = await newChat(ctx.decoded.userId, ...ctx.request.body);
		ctx.io.emit('new-chat', {
			createdChat
		});
		ctx.body = createdChat;
	} catch (err) {
		ctx.body = err;
	}
});

router.get('/my', async (ctx) => {
	try {
		ctx.body = await getMyChats(ctx.decoded.userId);
	} catch (err) {
		ctx.body = err;
	}
});

router.get('/:id', async (ctx) => {
	try {
		const { id } = ctx.params;
		ctx.body = {
			chats: await getChat(id),
			messages: await getMessagesByChatId(id)
		};
	} catch (err) {
		ctx.body = err;
	}
});

router.post('/:id', async (ctx) => {
	try {
		const { id } = ctx.params;
		const newMessage = await sendMessage(ctx.decoded.userId, id, ...ctx.request.body);
		ctx.io.to(id).emit('new-message', {
			newChat
		});
		ctx.body = newMessage;
	} catch (err) {
		ctx.body = err;
	}
});

router.get('/:id/join', async (ctx) => {
	try {
		const { id } = ctx.params;
		const joinedChat = await joinChat(ctx.decoded.userId, id);
		ctx.io.to(id).emit('new-message', {
			joinedChat
		});
		ctx.body = joinedChat;
	} catch (err) {
		ctx.body = err;
	}
});

router.get('/:id/leave', async (ctx) => {
	try {
		const { id } = ctx.params;
		const leavedChat = await leaveChat(ctx.decoded.userId, id);
		ctx.io.to(id).emit('new-message', {
			leavedChat
		});
		ctx.body = leavedChat;
	} catch (err) {
		ctx.body = err;
	}
});

router.delete('/:id', async (ctx) => {
	try {
		const { id } = ctx.params;
		const deletedChat = await deleteChat(ctx.decoded.userId, id);
		ctx.io.emit('deleted-chat', {
			...deletedChat,
			chat: {
				_id: id
			}
		});
		ctx.body = {
			...deletedChat,
			chat: {
				_id: id
			}
		};
	} catch (err) {
		ctx.body = err;
	}
});

export default router;

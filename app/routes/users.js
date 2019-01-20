import Router from 'koa-router';
import { getAllUsers, getUserDataById, editUser } from '../controllers';

const router = new Router({ prefix: '/users' });

router.get('/', async (ctx) => {
	try {
		const users = await getAllUsers();
		ctx.body = users;
	} catch (err) {
		ctx.body = err;
	}
});

router.get('/me', async (ctx) => {
	try {
		const me = await getUserDataById(ctx.decoded.userId);
		ctx.body = me;
	} catch (err) {
		ctx.body = err;
	}
});

router.get('/:id', async (ctx) => {
	try {
		const user = await getUserDataById(ctx.params.id);
		ctx.body = user;
	} catch (err) {
		ctx.body = err;
	}
});

router.post('/me', async (ctx) => {
	try {
		const editedMe = await editUser(ctx.decoded.userId, ...ctx.request.body);
		ctx.body = editedMe;
	} catch (err) {
		ctx.body = err;
	}
});

export default router;

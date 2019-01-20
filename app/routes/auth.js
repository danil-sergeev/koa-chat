import Router from 'koa-router';

import { login, signUp, logout } from '../controllers';

const router = new Router();

router.post('/register', async (ctx) => {
	const { username, password } = ctx.request.body;
	try {
		ctx.body = await signUp(username, password);
	} catch (err) {
		ctx.body = err;
	}
});
router.post('/login', async (ctx) => {
	const { username, password } = ctx.request.body;
	try {
		ctx.body = await login(username, password);
	} catch (err) {
		ctx.body = err;
	}
});
router.get('/logout', async (ctx) => {
	try {
		ctx.body = await logout();
	} catch (err) {
		ctx.body = err;
	}
});

export default router;

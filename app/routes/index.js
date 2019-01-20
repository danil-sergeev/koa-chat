import Router from 'koa-router';

import { jwtsecret } from '../config/jwt';
import jwtMiddleware from 'koa-jwt';
import authRouter from './auth';
import usersRouter from './users';
import chatsRouter from './chats';

export const indexRouter = new Router({ prefix: '/api/v1' });

indexRouter.use('/', authRouter);
indexRouter.use(
	jwtMiddleware({
		secret: jwtsecret
	})
);
indexRouter.use('/users', usersRouter);
indexRouter.use('/chats', chatsRouter);

export default indexRouter;

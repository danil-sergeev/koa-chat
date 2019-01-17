import {login, signUp, logout} from '../controllers'


export const Users = (router) => {
    router.post('/register', async ctx => {
        const {username, password} = ctx.request.body;
        try {
            ctx.body = await signUp(username, password);
        } catch(err) {
            console.log(err.__proto__);
            ctx.body = err;
        }
    });
    router.post('/login', async ctx => {
        const {username, password} = ctx.request.body;
        try {
            ctx.body = await login(username, password)
        } catch(err) {
            ctx.body = err;
        }
    });
    router.get('/logout', async ctx => {
        try {
            ctx.body = await logout();
        } catch(err) {
            ctx.body = err;
        }
    });
};
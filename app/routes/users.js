import passport from 'koa-passport';
import jwt from 'jsonwebtoken';
import bodyParser from 'koa-bodyparser';
import {compareSync} from 'bcryptjs';

import {User} from "../models/User";
import {jwtsecret} from '../config/passport';

export const Users = (router) => {
    router.post('/login', bodyParser(), async ctx => {
        const {username, password} = ctx.request.body;

        const user = await User.findOne({"username": username});        

        if (!user || !compareSync(password, user.password)) {
            const error = new Error();
            error.status = 403;
            throw error;
        }

        ctx.body = {
            token: jwt.sign({ id: user.id, username: user.username}, jwtsecret),
            user: user
        };  
        
    });
};
import passport from 'koa-passport';
import jwt from 'jsonwebtoken';

import {User} from "../models/User";
import {jwtsecret} from '../config/passport';

export const Users = (router) => {
    router.post('/signup', async(ctx, next) => {
        try {
            console.log(ctx.request.body);
            const user = await User.create(...ctx.request.body);
            ctx.body = {"user": user};
        } catch (err) {
            console.log(err);
            ctx.status = 400;
            ctx.body = err;
        };
    });

    router.post('/login', async(ctx, next) => {
       await passport.authenticate('local', function(err, user) {
           if (!user) {
               ctx.body = 'failed';
           } else {
               const payload = {
                    id: user._id,
                    username: user.username
               };
               const token = jwt.sign(payload, jwtsecret);
               ctx.body = {user: user, token: 'JWT ' + token};
           }
       })(ctx, next);
    });
};
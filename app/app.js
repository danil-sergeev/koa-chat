import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';
import jwtMiddleware from 'koa-jwt';
import http from 'http';
import mongoose from 'mongoose';

import {url, databaseOptions} from './config/database'
import {jwtsecret} from './config/jwt';
import {Users} from './routes';



mongoose.Promise = Promise;
mongoose.connect(url, databaseOptions)
mongoose.connection.once('open', function() {
    console.log('Connected to database with url', url)
})


const app = new Koa();

app.use(logger());
app.use(bodyParser());
app.use(passport.initialize());

const server = http.createServer(app.callback());
server.listen(7000);

//routes
const apiRouter = new Router({prefix: '/api/v1'});
Users(apiRouter);
apiRouter.use(
    jwtMiddleware({
        secret: jwtsecret,
    })
);
app.use(apiRouter.routes());
import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';
import http from 'http';
import mongoose from 'mongoose';

import {url, databaseOptions} from './config/database'
import {JWTPassport} from './config/passport'
import {Users} from './routes';


JWTPassport(passport);

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
app.use(apiRouter.routes());
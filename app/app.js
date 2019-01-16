import koa from 'koa';
import Router from 'koa-router';
import http from 'http';


const app = new koa();
const server = http.createServer(app.callback());
server.listen(7000);


//routes

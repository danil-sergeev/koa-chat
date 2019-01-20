import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import cors from 'cors';
import SocketIOServer from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';

import router from './routes';
import { url, databaseOptions } from './config/database';s
import { socketIO } from './middlewares/sockeMiddleware';

// Open MongoDB connection
mongoose.Promise = Promise;
mongoose.connect(url, databaseOptions);
const db = mongoose.connection;

db.on('error', (err) => {
	console.error('Database connection error:', err);
});

db.once('open', () => {
	console.log('Database connected.');
});

// Create servers
const app = new Koa();
const server = http.createServer(app.callback());
const io = SocketIOServer(server);

// Middlewares
app.use(logger());
app.use(bodyParser());
app.use(cors());
app.use(socketIO(io));

app.use(router.routes());

server.listen(8000);

// Routes

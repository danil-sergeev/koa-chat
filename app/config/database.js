import 'mongoose';

export const url = 'mongodb://localhost:27017/dogechat';

export const databaseOptions = {
    useNewUrlParser: true,
    autoIndex: false,
    reconnectTries: 100,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};
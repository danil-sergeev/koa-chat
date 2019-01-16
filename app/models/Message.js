import {Schema, model} from 'mongoose';

const ignoreEmpty = (val) => (val !== '' ? val : undefined);


const messageSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            set: ignoreEmpty 
        },
        chatId: {
            type: Schema.Types.ObjectId,
            ref: 'Chat'
        },
        content: String,
        statusMessage: Boolean
    },
    {timestamps: true}
);


export default Message = model('Message', messageSchema);

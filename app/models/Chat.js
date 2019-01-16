import {Schema, model} from 'mongoose';


const chatSchema = new Schema(
    {
      creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      title: { type: String, required: true },
      description: { type: String },
      members: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    { timestamps: true }
  );
  
  export default Chat = model('Chat', chatSchema);
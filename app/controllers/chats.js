import {Chat} from '../models';

import {sendMessage} from './messages'
import { Promise } from 'mongoose';

export const getAllChats = () => {
    return Chat.find()
        .populate({path: 'creator', select: 'username firstName lastName'})
        .populate({path: 'members', select: 'username firstName lastName'})
        .lean()
        .exec()
        .then(chats => {
            Promise.resolve(
                {
                    success: true,
                    chats: chats
                }
            )
        })
        .catch(reason => {
            Promise.reject(
                {
                    success: false,
                    message: reason
                }
            )
        });
};


export const getMyChats = (userId) => {
    return Chat.find({
        $or: [{creator: userId}, {members: userId}] 
    })
        .populate({path: 'creator', select: 'username firstName lastName'})
        .populate({path: 'members', select: 'username firstName lastName'})
        .lean()
        .exec()
        .then(chats => {
            Promise.resolve(
                {
                    success: true,
                    chats: chats
                }
            )
        })
        .catch(reason => {
            Promise.reject(
                {
                    success: false,
                    message: reason
                }
            )
        });
};


export const joinChat = (userId, chatId) => {
    return Chat.findById(chatId)
        .populate({path: 'creator', select: 'username firstName lastName'})
        .populate({path: 'members', select: 'username firstName lastName'})
        .lean()
        .exec()
        .then(chat => {
            if (!chat) {
                return Promise.reject(
                    {
                        success: false,
                        message: "Chat not found!"
                    }
                )
            };

            const isCreator = chat.creator._id.toString() === userId;
            const isMember = chat.members.some(
                (member) => member._id.toString === userId
            );

            if (isCreator || isMember) {
                return Promise.reject(
                    {
                        success: false,
                        message: 'User already in this chat!'
                    }
                );
            };

            return Chat.findOneAndUpdate(
                {_id: chatId},
                {$push: {members: userId}},
                {new: true}
            )
                .populate({path: 'creator', select: 'username firstName lastName'})
                .populate({path: 'members', select: 'username firstName lastName'})
                .lean()
                .exec();
        })
        .then((chat) => {
            const statusMessage = sendMessage(userId, chatId, {
                content: ' joined',
                statusMessage: true
            });

            return Promise.all([chat, statusMessage])
        })
        .then(([chat, statusMessage]) => {
            Promise.resolve(
                {
                    success: statusMessage.success,
                    message: statusMessage.message,
                    chat: chat

                }
            )
        })
        .catch(reason => {
            Promise.reject(
                {
                    success: false,
                    message: reason
                }
            )
        });
};


export const leaveChat = (userId, chatId) => {
    return Chat.findById(chatId)
        .populate({path: 'creator', select: 'username firstName lastName'})
        .populate({path: 'members', select: 'username firstName lastName'})
        .lean()
        .exec()
        .then(chat => {
            if (!chat) {
                return Promise.reject(
                    {
                        success: false,
                        message: "Chat not found!"
                    }
                )
            };

            const isCreator = chat.creator._id.toString() === userId;
            const isMember = chat.members.some(
                (member) => member._id.toString() === userId
            );
            
            if (isCreator) {
                return Promise.reject(
                    {
                        success: false,
                        message: "You can't leave your own chat."
                    }
                );
            };


            if (!isMember) {
                return Promise.reject(
                    {
                        success: false,
                        message: "User isn't even a member of this chat."
                    }
                );
            };

            return Chat.findOneAndUpdate(
                {_id: chatId},
                {$pull: {members: userId}},
                {new: true}
            )
                .populate({path: 'creator', select: 'username firstName lastName'})
                .populate({path: 'members', select: 'username firstName lastName'})
                .lean()
                .exec();
        })
        .then((chat) => {
            const statusMessage = sendMessage( userId, chatId , {
                content: ' left',
                statusMessage: true
            })

            return Promise.all([chat, statusMessage])
        })
        .then(([chat, statusMessage]) => {
            return Promise.resolve(
                {
                    success: statusMessage.success,
                    message: statusMessage.message,
                    chat: chat
                }
            )
        })
        .catch(reason => {
            return Promise.reject(
                {
                    success: false,
                    message: reason
                }
            )
        });
};

export const getChat = (chatId) => {
    return Chat.findById(chatId)
        .populate({path: 'creator', select: 'username firstName lastName'})
        .populate({path: 'members', select: 'username firstName lastName'})
        .lean()
        .exec()
        .then(chat => {
            if (!chat) {
                return Promise.reject(
                    {
                        success: false,
                        message: 'Chat not found'
                    }
                );
            };

            return Promise.resolve(
                {
                    success: true,
                    chat: chat
                }
            );
        });
};

export const newChat = (userId, data={}) => {
    const chat = new Chat({
        creator: userId,
        ...data
    });


    return chat
        .save()
        .then(savedChat => {
            Chat.findById(savedChat._id)
                .populate({path: 'creator', select: 'username firstName lastName'})
                .populate({path: 'members', select: 'username firstName lastName'})
                .lean()
                .exec()
                
        })
        .then(savedChat => {
            return Promise.resolve(
                {
                    success: true,
                    message: 'Chat has been created!',
                    chat: chat
                }
            )
        })
        .catch(reason => {
            return Promise.reject(
                {
                    success: false,
                    message: reason
                }
            );
        });
};


export const deleteChat = (userId, chatId) => {
    return Chat.findOne({
        creator: userId,
        _id: chatId,
      })
        .exec()
        .then((chat) => {
          if (!chat) {
            return Promise.reject({
              success: false,
              message: 'Chat not found. Perhaps it`s already deleted.',
            });
          }
    
          return Chat.findByIdAndRemove(chatId).exec();
        })
        .then(() => {
            return Promise.resolve(
                {
                    success: true,
                    message: 'Chat successfully deleted!'   
                }
            );
        });
};





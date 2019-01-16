import {User, Chat, Message} from '../models';



export const getAllUsers = () => {
    return User.find()
        .select('username firstName lastName')
        .exec()
        .then(users => {
            return Promise.resolve(
                {
                    success: true,
                    users: users
                }
            );
        });
};

const getUserDataById = (userId) => {
    return User.findById(userId)
        .select('username firstName lastName')
        .lean()
        .exec()
};

const getUserChatsById = (userId) => {
    return Chat.find({ creator: userId })
        .limit(5)
        .populate({ path: 'creator', select: 'username firstName lastName' })
        .sort({ createdAt: -1 })
        .lean()
        .exec()
        .then((chats) => chats || []);
};

const getUserMessagesCountById = (userId) => {
    return Message.find({sender: userId, statusMessage: false})
        .then((messages) => messages.count || 0)
};


export const getUserInfo = (userId) => {
    const userPromises = [
        getUserDataById(userId),
        getUserChatsById(userId),
        getUserMessagesCountById(userId)
    ];

    return Promise.all([userPromises])
        .then(([user, chats, messagesCount]) => {
            if (!user) {
                return Promise.rejects(
                    {
                        success: false,
                        message: `User hasn't been found`
                    }
                );
            };

            return Promise.resolve(
                {
                    success: true,
                    user: Object.assign({}, user, { chats, messagesCount }),
                }
            );
        });
};


export const editUser = (userId, data) => {
    if (!data) return Promise.reject({success: false, message: `Data haven't been provided`});

    return User.findOne({userId: {$ne: userId}, username: data.username})
        .then((user) => {
            if (user) {
                return Promise.reject({
                  success: false,
                  message: 'This username is already taken. Please try another',
                });
              };
              return user;
        })
        .then(() => {
            User.findByIdAndUpdate(
                userId,
                {
                    username: data.username,
                    firstName: data.firstName,
                    lastName: data.lastName
                },
                {new: true}
            ).select('username firstName lastName')
        })
        .then((user) => {
            if (!user) {
                return Promise.reject(
                    {
                        success: false,
                        message: 'User not found',
                        notExists: true
                    }
                );
            };

            return Promise.resolve(
                {
                    success: true,
                    message: 'User has been updated!',
                    user: user
                }
            );
        });        
}
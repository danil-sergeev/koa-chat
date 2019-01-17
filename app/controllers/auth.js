import jwt from 'jsonwebtoken';

import {User} from '../models';
import {jwtsecret} from '../config/jwt';
import {getUserInfo, getUserDataById} from './users';


export const signUp = (username, password) => {
    if (!username || !password) {
        return Promise.reject(
            {
                success: false,
                message: "Please provide username and password"
            }
        );
    };

    return User.findOne({"username": username})
        .exec()
        .then((user) => {
            console.log(user);
            if (user) {
                console.log('АШИПКА');
                return Promise.reject(
                    {
                        success: false,
                        message: "Username is already taken."
                    }
                );
            };
            console.log('НЕАШИПКА')
            const newUser= new User({
                username: username, 
                password: password
            });    
            return newUser.save();
        })
        .then((savedUser) => getUserDataById(savedUser._id))
        .then((userFromMongo) => {
            console.log(userFromMongo);
            const token = jwt.sign({ id: userFromMongo.id, username: userFromMongo.username}, jwtsecret, {expiresIn: 60*60*24*10});
            console.log(userFromMongo);
            return Promise.resolve(
                {
                    success: true,
                    message: 'User has been created',
                    token,
                    userFromMongo
                }
            )
        })
};



export const login = (username, password) => {
    if (!username || !password) {
        return Promise.reject(
            {
                success: false,
                message: "Please provide username and password"
            }
        );
    };

    return User.findOne({"username": username})
        .exec()
        .then((user) => {
            if (!user) {
                return Promise.reject(
                    {
                        success: false,
                        message: "No user found",
                        notExists: true
                    }
                );
            };
            console.log('чек пасворд')
            return Promise.all(
                [
                    Promise.resolve(user),
                    user.comparePassword(password)
                ]
            );
        })
        .then(([user, passwordMatch]) => {
            if (!passwordMatch) {
                return Promise.reject(
                    {
                        success: false,
                        message: 'The password or username you entered is incorrect'
                    }
                );
            };

            return user;
        })
        .then((user) => getUserDataById(user._id))
        .then((user) => {
            const token = jwt.sign({ id: user.id, username: user.username}, jwtsecret, {expiresIn: 60*60*24*10});
            console.log(user)

            return Promise.resolve(
                {
                    success: true,
                    message: 'You are now logged in.',
                    token,
                    user
                }
            );
        })
};


export const logout = () => {
    return Promise.resolve(
        {
            success: true,
            message: 'You are now logged out.'
        }
    );
};
import jwt from 'jsonwebtoken';
import {compareSync} from 'bcryptjs';

import {User} from '../models';
import {jwtsecret} from '../config/passport';
import {getUserInfo} from './users';


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
            if (user) {
                return Promise.reject(
                    {
                        success: false,
                        message: "Username is already taken."
                    }
                );
            };


            const newUser = new User({
                username: username,
                password: password
            });

            return newUser.save();
        })
        .then((savedUser) => getUserInfo(savedUser._id))
        .then(({user}) => {
            const token = jwt.sign({ id: user.id, username: user.username}, jwtsecret, {expiresIn: 60*60*24*10});


            return Promise.resolve(
                {
                    success: true,
                    message: 'User has been created',
                    token,
                    user
                }
            )
        });
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

    return User.findOne({"username": username, "password": password})
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

            return Promise.all(
                [
                    Promise.resolve(user),
                    user.compareSync(password, user.password)
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
        .then(({user}) => {
            const token = jwt.sign({ id: user.id, username: user.username}, jwtsecret, {expiresIn: 60*60*24*10});


            return Promise.resolve(
                {
                    success: true,
                    message: 'You are now logged in.',
                    token,
                    user
                }
            );
        });
};


export const logout = () => {
    return Promise.resolve(
        {
            success: true,
            message: 'You are now logged out.'
        }
    );
};
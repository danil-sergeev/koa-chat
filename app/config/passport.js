import LocalStrategy from 'passport-local';
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';

import {User} from '../models';


export const jwtsecret = process.env.JWT_SECRET || 'mysecret';

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: jwtsecret
  };

export const JWTPassport = (passport) => {
    passport.use('local', new LocalStrategy({
        usernameField: 'username', 
        passwordField: 'password',
        session: false
    }, 
    function (username, password, done) {
        User.findOne({username}, (err, user) => {
            if (err) {
                done(err);
            };
            if(!user) {
                return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
            }

            return done(null ,user);
        })
    },
    ));
    passport.use('local-jwt', new JwtStrategy(jwtOptions, function (payload, done) {
        User.findById(payload.id, (err, user) => {
            if (err) {
              return done(err)
            }
            if (user) {
              done(null, user)
            } else {
              done(null, false)
            };
        })
    })
)};    

import {Schema, model} from 'mongoose';

const userSchema = new Schema(
    {
        username: {type: String, unique: true, required: true},
        password: String,
        firstName: {type: String, default: ''},
        lastName: {type: String, default: ''},
        lastVisit: Date,
    },
    {timestamps: true}
 );

 userSchema.pre('save', function checkPassword(next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    return bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        return next(saltErr);
      }
  
      return bcrypt.hash(this.password, salt, (hashErr, hash) => {
        if (hashErr) {
          return next(hashErr);
        }
  
        this.password = hash;
        return next();
      });
    });
  });


export const User = model('User', userSchema);

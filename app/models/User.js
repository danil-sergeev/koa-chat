import { Schema, model } from 'mongoose';
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
	{
		username: { type: String, unique: true, required: true },
		password: String,
		firstName: { type: String, default: '' },
		lastName: { type: String, default: '' },
		lastVisit: Date
	},
	{ timestamps: true }
);

userSchema.pre('save', function(next) {
  const user = this;
  const SALT_WORK_FACTOR = 10;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          console.log('hash', hash)
          // override the cleartext password with the hashed one
          user.password = hash;
          console.log('password', user.password);
          next();
      });
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(isMatch);
    });
  });
};

export const User = model('User', userSchema);

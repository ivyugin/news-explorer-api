const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ErrorWithStatus = require('../errors/ErrorWithStatus');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        const rgex = /^[a-z0-9\-.]+@[a-z0-9\-.]+\.[a-z]+$/;
        return rgex.test(email);
      },
      message: 'email not valid',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorWithStatus(401, 'Wrong email or password');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorWithStatus(401, 'Wrong email or password');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

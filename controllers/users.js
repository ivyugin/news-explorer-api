const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorWithStatus = require('../errors/ErrorWithStatus');
const User = require('../models/user');
const config = require('../server-config.json');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsersMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user));
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      const userData = { ...user.toObject(), password: undefined };
      res
        .send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ErrorWithStatus(409, 'User with current email already exists.');
      }
      throw new ErrorWithStatus(500, 'Server error.');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : config.JWT_DEV,
        { expiresIn: '30d' },
      );
      res
        .cookie('jwt', token, { maxAge: 3600000, httpOnly: true })
        .end();
    })
    .catch(next);
};

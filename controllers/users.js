const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorWithStatus = require('../errors/ErrorWithStatus');
const User = require('../models/user');

const JWT_SECRET = 'dev';

module.exports.getUsersMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user));
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      // eslint-disable-next-line no-param-reassign
      user.password = undefined;
      res
        .send(user);
    })
    .catch((err) => { throw new ErrorWithStatus(404, err.message); })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '30d' },
      );
      res
        .cookie('jwt', token, { maxAge: 3600000, httpOnly: true })
        .end();
    })
    .catch(next);
};

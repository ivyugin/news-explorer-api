const jwt = require('jsonwebtoken');
const ErrorWithStatus = require('../errors/ErrorWithStatus');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line no-unused-vars
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new ErrorWithStatus(401, 'Authorisation needed.');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new ErrorWithStatus(401, 'Authorisation needed.');
  }

  req.user = payload;

  next();
};

const jwt = require('jsonwebtoken');
const ErrorWithStatus = require('../errors/ErrorWithStatus');
const config = require('../server-config.json');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new ErrorWithStatus(401, 'Authorisation needed.');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : config.JWT_DEV);
  } catch (err) {
    throw new ErrorWithStatus(401, 'Authorisation needed.');
  }

  req.user = payload;

  next();
};

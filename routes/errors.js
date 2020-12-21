const errorsRouter = require('express').Router();
const auth = require('../middlewares/auth');
const ErrorWithStatus = require('../errors/ErrorWithStatus');

errorsRouter.all('*', auth, () => {
  throw new ErrorWithStatus(404, 'The requested resource was not found.');
});

module.exports = errorsRouter;

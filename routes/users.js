const usresRouter = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  createUser,
  login,
  getUsersMe,
} = require('../controllers/users');

usresRouter.post('/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(1),
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
  }),
  createUser);

usresRouter.post('/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(1),
    }),
  }), login);

usresRouter.get('/users/me', auth, getUsersMe);

module.exports = usresRouter;

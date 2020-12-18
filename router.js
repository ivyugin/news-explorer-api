const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const ErrorWithStatus = require('./errors/ErrorWithStatus');
const auth = require('./middlewares/auth');

const {
  postArticles,
  getArticles,
  deleteArticles,
} = require('./controllers/articles');

const {
  createUser,
  login,
  getUsersMe,
} = require('./controllers/users');

router.post('/signup',
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

router.post('/signin',
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

router.get('/users/me', auth, getUsersMe);

router.post('/articles',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      keyword: Joi.string()
        .required()
        .min(1),
      title: Joi.string()
        .required()
        .min(1),
      text: Joi.string()
        .required()
        .min(1),
      date: Joi.string()
        .required()
        .min(1),
      source: Joi.string()
        .required()
        .min(1),
      link: Joi.string()
        .required()
        .pattern(/^https?:\/\/[a-z0-9\-./_]+\.[a-z]{2,5}[a-z0-9\-/]*$/),
      image: Joi.string()
        .required()
        .pattern(/^https?:\/\/[a-z0-9\-./_]+\.[a-z]{2,5}[a-z0-9\-/]*$/),
    }),
  }), auth, postArticles);

router.get('/articles', auth, getArticles);

router.delete('/articles/:articleId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      articleId: Joi.string().hex().length(24),
    }),
  }), auth, deleteArticles);

router.get('*', () => {
  throw new ErrorWithStatus(404, 'Запрашиваемый ресурс не найден');
});

module.exports = router;

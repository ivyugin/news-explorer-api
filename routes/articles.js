const articlesRouter = require('express').Router();
const validator = require('validator');
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  postArticles,
  getArticles,
  deleteArticles,
} = require('../controllers/articles');

articlesRouter.post('/',
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
        .required(),
      //  .custom((value, helpers) => {
      //  if (validator.isURL(value)) {
      //    return value;
      //  }
      //  return helpers.error('link url not valid');
      //  }),
      image: Joi.string()
        .required(),
      //  .custom((value, helpers) => {
      //  if (validator.isURL(value)) {
      //    return value;
      //   }
      //  return helpers.error('image url not valid');
      //  }),
    }),
  }), auth, postArticles);

articlesRouter.get('/', auth, getArticles);

articlesRouter.delete('/:articleId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      articleId: Joi.string().hex().length(24),
    }),
  }), auth, deleteArticles);

module.exports = articlesRouter;

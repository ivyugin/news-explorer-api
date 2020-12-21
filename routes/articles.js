const articlesRouter = require('express').Router();
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
        .required()
        .pattern(/^https?:\/\/[a-z0-9\-./_]+\.[a-z]{2,5}[a-z0-9\-/]*$/),
      image: Joi.string()
        .required()
        .pattern(/^https?:\/\/[a-z0-9\-./_]+\.[a-z]{2,5}[a-z0-9\-/]*$/),
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

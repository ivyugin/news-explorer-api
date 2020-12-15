const ErrorWithStatus = require('../errors/ErrorWithStatus');
const Article = require('../models/article');

module.exports.postArticles = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      res
        .send(article);
    })
    .catch((err) => { throw new ErrorWithStatus(404, err.message); })
    .catch(next);
};

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      res
        .send(articles);
    })
    .catch((err) => { throw new ErrorWithStatus(500, err.message); })
    .catch(next);
};

module.exports.deleteArticles = (req, res, next) => {
  Article.DeleteWithPermissionCheck(req.params.articleId, req.user._id)
    .then((article) => {
      res
        .send(article);
    })
    .catch(next);
};

const mongoose = require('mongoose');
const ErrorWithStatus = require('../errors/ErrorWithStatus');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        const regex = /^https?:\/\/[a-z0-9\-./_]+\.[a-z]{2,5}[a-z0-9\-/]*$/;
        return regex.test(link);
      },
      message: 'error article link validate',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(imageUrl) {
        const regex = /^https?:\/\/[a-z0-9\-./_]+\.[a-z]{2,5}[a-z0-9\-/]*$/;
        return regex.test(imageUrl);
      },
      message: 'error image url validate',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
articleSchema.statics.DeleteWithPermissionCheck = function (articleId, userId) {
  return this.findById(articleId).select('+owner')
    .then((article) => {
      if (!article) {
        throw new ErrorWithStatus(404, 'Articl not found');
      }
      if (!article.owner.equals(userId)) {
        throw new ErrorWithStatus(403, 'Permission denaed');
      }
      return article.remove();
    });
};

module.exports = mongoose.model('article', articleSchema);

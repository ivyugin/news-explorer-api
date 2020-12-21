const router = require('express').Router();

const usresRouter = require('./users');
const articlesRouter = require('./articles');
const errorsRouter = require('./errors');

router.use('/articles', articlesRouter);
router.use('/', usresRouter);
router.use('/', errorsRouter);

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const corsOptions = { origin: 'http://localhost:3000', credentials: true };
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');
const config = require('./server-config.json');

const { PORT = 3000, MOONGODB = config.mongodb.serverLink } = process.env;

const app = express();

mongoose.connect(MOONGODB, config.mongodb.serverSettings);

app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

// celebrate errors
app.use(errors());

// central error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

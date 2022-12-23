/* eslint-disable no-console */
const cors = require('cors');

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://kingmovie.nomoredomains.club',
    'http://kingmovie.nomoredomains.club',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

require('dotenv').config();
const expres = require('express');
const mongoose = require('mongoose');

const { MONGOOSE_DATABASE = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const NotFound = require('./errors/not-found');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedError = require('./middlewares/centralized-error');

mongoose.connect(MONGOOSE_DATABASE);

const app = expres();

app.use('*', cors(options));

// Парсим все пакеты в джсон рег.боди
app.use(bodyParser.json());

app.use(requestLogger);

// Все запросы на /
app.use('/', require('./routes/index'));

// Не существующие запросы
app.use('/', (req, res, next) => {
  const error = new NotFound('Такого адреса не существует');
  next(error);
});

app.use(errorLogger);

// Обработчик ошибок Joi
app.use(errors());

// Централизованный обработчик
app.use(centralizedError);

app.listen(3001, () => {
  console.log('server started');
});

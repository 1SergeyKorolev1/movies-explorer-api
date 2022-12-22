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
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const {
  login, postUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/not-found');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

const app = expres();

app.use('*', cors(options));

// Парсим все пакеты в джсон рег.боди
app.use(bodyParser.json());

app.use(requestLogger);

// Вход(авторизация) и регистрация
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), postUser);

// Аутенфикация
app.use(auth);

// Все запросы на /users
app.use('/users', require('./routes/users'));
// Все запросы на /cards
app.use('/movies', require('./routes/movies'));

// Не существующие запросы
app.use('/', (req, res, next) => {
  const error = new NotFound('Такого адреса не существует');
  next(error);
});

app.use(errorLogger);

// Обработчик ошибок Joi
app.use(errors());

// Централизованный обработчик
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(3001, () => {
  console.log('server started');
});

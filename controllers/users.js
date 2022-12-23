const { JWT_SECRET = 'secret' } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const ServerError = require('../errors/server-error');
const Unauthorized = require('../errors/unauthorized');
const NotFound = require('../errors/not-found');
const IncorrectData = require('../errors/incorrect-data');
const Conflict = require('../errors/conflict');

const GOOD_REQUEST = 200;

// Возвращаем пользователя
module.exports.getUserMe = (req, res, next) => {
  UserSchema.findById(req.user._id)
    .then((data) => {
      if (data === null) {
        const err = new Error('errorId');
        err.name = 'ResourceNotFound';
        throw err;
      } else {
        res.status(GOOD_REQUEST).send(
          data,
        );
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new IncorrectData('Передан некоректный _id.');
        next(error);
      } else if (err.name === 'ResourceNotFound') {
        const error = new NotFound('Пользователь по указанному _id не найден.');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

// Создаем пользователя - регистрация
module.exports.postUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => UserSchema.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    })
      .then((data) => {
        const {
          email, name, _id,
        } = data;
        res.status(GOOD_REQUEST).send({
          email, name, _id,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const error = new IncorrectData('Переданы некорректные данные при создании пользователя.');
          next(error);
        } else if (err.code === 11000) {
          const error = new Conflict('Такой email уже зарегестрирован.');
          next(error);
        } else {
          const error = new ServerError('Ошибка на сервере');
          next(error);
        }
      }));
};

// Вход - авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        const err = new Error('error');
        err.name = 'Unauthorized';
        throw err;
      }
      // console.log(123);
      const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Unauthorized') {
        const error = new Unauthorized('Указаны неправильные почта или пароль!');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

// Обновляем профиль
module.exports.patchUser = (req, res, next) => {
  UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => {
      if (data === null) {
        const err = new Error('errorId');
        err.name = 'ResourceNotFound';
        throw err;
      } else {
        res.status(GOOD_REQUEST).send(
          data,
        );
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new IncorrectData('Переданы некорректные данные при обновлении профиля.');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new IncorrectData('Переданы некорректные данные при обновлении аватара.Пользователь с указанным _id не найден.');
        next(error);
      } else if (err.name === 'ResourceNotFound') {
        const error = new NotFound('Пользователь с указанным _id не найден.');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

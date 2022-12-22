const movieShema = require('../models/movie');
const ServerError = require('../errors/server-error');
const NotFound = require('../errors/not-found');
const IncorrectData = require('../errors/incorrect-data');
const Forbidden = require('../errors/forbidden');

const GOOD_REQUEST = 200;

// Создаем Фильм
module.exports.postMovie = (req, res, next) => {
  movieShema.create({ ...req.body, owner: req.user._id })
    .then((data) => {
      res.status(GOOD_REQUEST).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new IncorrectData('Переданы некорректные данные при создании фильма.');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

// Удаляем карточку по ид
module.exports.deleteMovie = (req, res, next) => {
  movieShema.findById(req.params.movieId)
    .orFail(() => {
      const err = new Error('errorId');
      err.name = 'ResourceNotFound';
      throw err;
    })
    .then((data) => {
      if (req.user._id !== data.owner._id.toString()) {
        const err = new Error('errorId');
        err.name = 'Unauthorized';
        throw err;
      } else {
        movieShema.findByIdAndRemove(req.params.movieId)
          .then((datas) => {
            res.status(GOOD_REQUEST).send(datas);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'Unauthorized') {
        const error = new Forbidden('У вас нет прав на удаление этого фильма');
        next(error);
      } else if (err.name === 'ResourceNotFound') {
        const error = new NotFound('Фильм с указанным _id не найден.');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new IncorrectData('Переданы некорректные данные при удалении создании фильма.');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  movieShema.find({})
    .then((data) => res.status(GOOD_REQUEST).send(data))
    .catch(() => {
      const error = new ServerError('Ошибка на сервере');
      next(error);
    });
};

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, postMovie, deleteMovie,
} = require('../controllers/movies');

// создаёт фильм
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/(http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?)/),
    trailerLink: Joi.string().required().pattern(/(http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?)/),
    thumbnail: Joi.string().required().pattern(/(http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?)/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), postMovie);

// удаляет сохранённый фильм по id
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteMovie);

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', getMovies);

module.exports = router;

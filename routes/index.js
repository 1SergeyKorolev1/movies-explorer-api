const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  login, postUser,
} = require('../controllers/users');
const { patchUser, getUserMe } = require('../controllers/users');
const {
  getMovies, postMovie, deleteMovie,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');

// Вход(авторизация) и регистрация
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), postUser);

// Аутенфикация
router.use(auth);

// _________________________________Все запросы на /users__________________________________________

// Возвращаем инфу пользователя
router.get('/users/me', getUserMe);

// Обновляем профиль
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), patchUser);

// ______________________________Все запросы на /movies_______________________________

// создаёт фильм
router.post('/movies', celebrate({
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
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteMovie);

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/movies', getMovies);

module.exports = router;

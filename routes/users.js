const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { patchUser, getUserMe,
} = require('../controllers/users');

// Возвращаем инфу пользователя
router.get('/me', getUserMe);

// Обновляем профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), patchUser);

module.exports = router;

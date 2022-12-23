const { JWT_SECRET = 'secret' } = process.env;
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Unauthorized('Необходима авторизация');
    next(error);
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new Unauthorized('Необходима авторизация');
    next(error);
  }

  req.user = payload;
  next();
};

const jwt = require('jsonwebtoken');
const { getJWT } = require('../utils/getJWT');
const UnauthorizedError = require('../utils/errorClasses/unauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      return next(new UnauthorizedError('Нужно авторизоваться!'));
    }
    const key = getJWT();
    payload = jwt.verify(token, key);
  } catch (e) {
    return next(new UnauthorizedError('Нужно авторизоваться!'));
  }
  req.user = payload;
  next();
};

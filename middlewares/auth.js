const jwt = require('jsonwebtoken');
const { getJWT } = require('../utils/getJWT');
const UnauthorizedError = require('../utils/errorClasses/unauthorizedError');
const {AUTH_REQUIRED_MESSAGE} = require("../utils/constants");

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  let payload;
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(AUTH_REQUIRED_MESSAGE));
  }
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const key = getJWT();
    payload = jwt.verify(token, key);
  } catch (e) {
    return next(new UnauthorizedError(AUTH_REQUIRED_MESSAGE));
  }
  req.user = payload;
  next();
};

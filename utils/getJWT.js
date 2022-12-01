require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getJWT = function () {
  return NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
};

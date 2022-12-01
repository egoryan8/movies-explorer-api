const db = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UnauthorizedError = require('../errorClasses/unauthorizedError');
const { INCORRECT_CREDENTIALS_MESSAGE } = require('../utills/constants');

const userSchema = new db.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'поле должно содержать минимум 2 символа'],
    maxlength: [30, 'максимальная длина поля 30 символов'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: ({ value }) => `${value} - некорректный адрес email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { toObject: { useProjection: true }, toJSON: { useProjection: true } });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(INCORRECT_CREDENTIALS_MESSAGE));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(INCORRECT_CREDENTIALS_MESSAGE));
          }
          return user;
        });
    });
};

module.exports = db.model('user', userSchema);

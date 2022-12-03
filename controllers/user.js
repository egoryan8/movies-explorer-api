const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../utils/errorClasses/badRequestError');
const ConflictError = require('../utils/errorClasses/conflictError');
const { DOUBLE_EMAIL_MESSAGE, INVALID_DATA_MESSAGE} = require('../utils/constants');
const { getJWT } = require('../utils/getJWT');

module.exports.register = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });
    res.send(user);
  } catch (e) {
    if (e.code === 11000) {
      next(new ConflictError(DOUBLE_EMAIL_MESSAGE));
    } else if (e.name === 'CastError') {
      next(new BadRequestError(INVALID_DATA_MESSAGE));
    } else {
      next(e);
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const key = getJWT();
    const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
    res.send({
      token,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user._id.toString() !== req.user._id) {
      throw new ConflictError(DOUBLE_EMAIL_MESSAGE);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    );
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.send(user))
    .catch(next);
};

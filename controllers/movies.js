const BadRequestError = require('../utils/errorClasses/badRequestError');
const NotFoundError = require('../utils/errorClasses/notFoundError');
const ForbiddenError = require('../utils/errorClasses/forbiddenError');
const Movie = require('../models/movie');
const {
  DOUBLE_FILM_MESSAGE,
  FILM_NOT_FOUND_MESSAGE,
  INCORRECT_ID_MESSAGE,
  SUCCESS_REMOVE_FILM_MESSAGE,
  REMOVE_NOT_OWN_FILM_MESSAGE,
} = require('../utils/constants');

module.exports.getMovies = async (req, res, next) => {
  try {
    const films = await Movie.find({ owner: req.user._id });
    res.send(films);
  } catch {
    next();
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ movieId: req.body.movieId, owner: req.user._id });
    if (movie) {
      throw new ForbiddenError(DOUBLE_FILM_MESSAGE);
    }
    const newMovie = await Movie.create({ ...req.body, owner: req.user._id });
    res.status(201).send(newMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      throw new NotFoundError(FILM_NOT_FOUND_MESSAGE);
    }
    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError(REMOVE_NOT_OWN_FILM_MESSAGE);
    }
    await movie.delete();
    res.send({ message: SUCCESS_REMOVE_FILM_MESSAGE });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(INCORRECT_ID_MESSAGE));
    } else {
      next(err);
    }
  }
};

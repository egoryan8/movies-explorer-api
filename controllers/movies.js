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

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((films) => res.send(films))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.findOne({
    movieId: req.body.movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      if (movie) {
        throw new ForbiddenError(DOUBLE_FILM_MESSAGE);
      }
      return Movie.create({ ...req.body, owner: req.user._id })
        .then((newMovie) => res.status(201).send(newMovie));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.removeMovieFromSaved = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(FILM_NOT_FOUND_MESSAGE);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(REMOVE_NOT_OWN_FILM_MESSAGE);
      }
      return movie.delete()
        .then(() => res.send({ message: SUCCESS_REMOVE_FILM_MESSAGE }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(INCORRECT_ID_MESSAGE));
      } else {
        next(err);
      }
    });
};

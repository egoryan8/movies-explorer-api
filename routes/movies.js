const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovie, validateMovieId } = require('../utils/validators/moviesValidator');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateMovie, createMovie);
movieRouter.delete('/movies/:id', validateMovieId, deleteMovie);

module.exports = movieRouter;

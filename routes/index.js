const router = require('express').Router();
const moviesRouter = require('./movies');
const usersRouter = require('./user');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errorClasses/notFoundError');
const { login, register } = require('../controllers/user');
const { validateLogin, validateRegistration } = require('../utils/validators/userValidator');
const {NOT_FOUND_MESSAGE} = require("../utils/constants");

router.post('/signup', validateRegistration, register);
router.post('/signin', validateLogin, login);
router.use(auth);
router.use(usersRouter);
router.use(moviesRouter);

router.use(() => {
  throw new NotFoundError(NOT_FOUND_MESSAGE);
});

module.exports = router;

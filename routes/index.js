const router = require('express').Router();
const moviesRouter = require('./movies');
const usersRouter = require('./user');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errorClasses/notFoundError');
const { login, register } = require('../controllers/user');
const { validateLogin, validateRegistration } = require('../utils/validators/userValidator');

router.post('/signup', validateRegistration, register);
router.post('/signin', validateLogin, login);
router.use(auth);
router.use(usersRouter);
router.use(moviesRouter);

router.use(() => {
  throw new NotFoundError('Запрашиваемый URL не найден. Проверьте адрес и метод запроса');
});

module.exports = router;

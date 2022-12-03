const userRouter = require('express').Router();
const { getMe, updateUser } = require('../controllers/user');
const { validateUser } = require('../utils/validators/userValidator');

userRouter.get('/users/me', getMe);
userRouter.patch('/users/me', validateUser, updateUser);

module.exports = userRouter;

const router = require('express').Router();
const verifyUserAuth = require('../middlewares/auth/verifyUserAuth');
const userValidator = require('../middlewares/validators/user.validator');
const { userController } = require('../controllers');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');

// GET all user
router.get('/', verifyUserAuth({ isAdmin: true }), userController.getUsers);

// GET user by Id
router.get('/user/:id', userValidator.getUserById, userController.getUserById);

// POST register user
router.post(
  '/',
  verifyUserAuth({ isAdmin: true }),
  multerBlobUploader().single('image'),
  multerErrorHandler,
  userValidator.registerUser,
  userController.registerUser
);

// POST login user
router.post('/auth', userValidator.loginUser, userController.loginUser);

// PATCH user by userId
router.patch(
  '/:id',
  multerBlobUploader().single('image'),
  multerErrorHandler,
  userValidator.editUserByIdWithParams,
  userController.editUserById,
  userValidator.editUserById
);

// DELETE user by userId
router.delete(
  '/:id',
  userValidator.deleteUserByIdWithParams,
  userController.deleteUserById
);

module.exports = router;

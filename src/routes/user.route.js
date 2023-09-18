const router = require('express').Router();
const verifyUserAuth = require('../middlewares/auth/verifyUserAuth');
const userValidator = require('../middlewares/validators/user.validator');
const { userController } = require('../controllers');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');

// GET users
router.get('/', verifyUserAuth({ isAdmin: true }), userController.getUsers);

// GET user by userId
router.get(
  '/user/:id',
  verifyUserAuth({ isAdmin: true, isCashier: true }),
  userValidator.getUserById,
  userController.getUserById
);

// GET user image by userId
router.get(
  '/image/:id',
  userValidator.getUserImageById,
  userController.getUserImageById
);

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

// PATCH edit user by userId
router.patch(
  '/:id',
  verifyUserAuth({ isAdmin: true }),
  multerBlobUploader().single('image'),
  multerErrorHandler,
  userValidator.editUserById,
  userController.editUserById
);

// DELETE user by userId
router.delete(
  '/:id',
  verifyUserAuth({ isAdmin: true }),
  userValidator.deleteUserById,
  userController.deleteUserById
);

module.exports = router;

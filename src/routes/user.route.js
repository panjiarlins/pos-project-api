const router = require('express').Router();
const { userController } = require('../controllers');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');

// POST register user
router.post(
  '/',
  multerBlobUploader().single('image'),
  multerErrorHandler,
  userController.registerUser
);

// POST login user
router.post('/auth', userController.loginUser);

// GET all user
router.get('/', userController.getAllUser);

// PATCH user by userId
router.patch('/:id', userController.editUserById);

// DELETE user by userId
router.delete('/:id', userController.deleteUserById);

module.exports = router;

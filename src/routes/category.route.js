const router = require('express').Router();
const verifyUserAuth = require('../middlewares/auth/verifyUserAuth');
const { categoryValidator } = require('../middlewares/validators');
const { categoryController } = require('../controllers');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');

// GET categories
router.get(
  '/',
  verifyUserAuth({ isAdmin: true, isCashier: true }),
  categoryController.getCategories
);

// POST new category
router.post(
  '/',
  multerBlobUploader().single('image'),
  multerErrorHandler,
  categoryValidator.createCategory,
  categoryController.createCategory
);

// PATCH edit caregory by categoryId
router.patch(
  '/:id',
  multerBlobUploader().single('image'),
  multerErrorHandler,
  categoryValidator.editCategoryById,
  categoryController.editCategoryById
);

// DELETE category by categoryId
router.delete(
  '/:id',
  categoryValidator.deleteCategoryById,
  categoryController.deleteCategoryById
);

module.exports = router;

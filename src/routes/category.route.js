const router = require('express').Router();
const { categoryValidator } = require('../middlewares/validators');
const { categoryAuth } = require('../middlewares/auth');
const { categoryController } = require('../controllers');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');

// GET all categories
router.get('/', categoryController.getAllCategories);

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
  categoryValidator.editCategoryById,
  categoryAuth.editCategoryById,
  categoryController.editCategoryById
);

// DELETE category by categoryId
router.delete(
  '/:id',
  categoryValidator.deleteCategoryById,
  categoryAuth.deleteCategoryById,
  categoryController.deleteCategoryById
);

module.exports = router;

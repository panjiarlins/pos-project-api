const router = require('express').Router();
const verifyUserAuth = require('../middlewares/auth/verifyUserAuth');
const { productValidator } = require('../middlewares/validators');
const { productController } = require('../controllers');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');

// GET products
router.get(
  '/',
  verifyUserAuth({ isAdmin: true, isCashier: true }),
  productValidator.getProducts,
  productController.getProducts
);

// GET product image by productId
router.get(
  '/image/:id',
  verifyUserAuth({ isAdmin: true, isCashier: true }),
  productValidator.getProductImageById,
  productController.getProductImageById
);

// POST new product
router.post(
  '/',
  verifyUserAuth({ isAdmin: true }),
  multerBlobUploader().single('image'),
  multerErrorHandler,
  productValidator.createProduct,
  productController.createProduct
);

// PATCH edit product by productd
router.patch(
  '/:id',
  productValidator.editProductById,
  productController.editProductById
);

// DELETE product by productId
router.delete(
  '/:id',
  verifyUserAuth({ isAdmin: true }),
  productValidator.deleteProductById,
  productController.deleteProductById
);

module.exports = router;

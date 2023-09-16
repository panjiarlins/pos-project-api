const router = require('express').Router();
const { productValidator } = require('../middlewares/validators');
const { productAuth } = require('../middlewares/auth');
const { productController } = require('../controllers');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');

// GET products
router.get(
  '/',
  productValidator.getProducts,
  productAuth.getProducts,
  productController.getProducts
);

// GET product image by productId
router.get(
  '/image/:id',
  productValidator.getProductImageById,
  productAuth.getProductImageById,
  productController.getProductImageById
);

// POST new product
router.post(
  '/',
  multerBlobUploader().single('image'),
  multerErrorHandler,
  productValidator.createProduct,
  productAuth.createProduct,
  productController.createProduct
);

// PATCH edit product by productd
router.patch(
  '/:id',
  productValidator.editProductById,
  productAuth.editProductById,
  productController.editProductById
);

// DELETE product by productId
router.delete(
  '/:id',
  productValidator.deleteProductById,
  productAuth.deleteProductById,
  productController.deleteProductId
);

module.exports = router;

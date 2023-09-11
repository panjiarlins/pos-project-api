const router = require('express').Router();
const { productValidator } = require('../middlewares/validators');
const { productAuth } = require('../middlewares/auth');
const { productController } = require('../controllers');

// GET products
router.get('/', productValidator.getProducts, productController.getProducts);

// POST new product
router.post(
  '/',
  productValidator.createProduct,
  productAuth.createProduct,
  productController.createProduct
);

// PATCH edit product by productd
router.patch(
  '/:id',
  productValidator.editProductById,
  productAuth.editProductById,
  productValidator.editProductById
);

// DELETE product by productId
router.delete(
  '/:id',
  productValidator.deleteProductById,
  productAuth.deleteProductById,
  productController.deleteProductId
);

module.exports = router;

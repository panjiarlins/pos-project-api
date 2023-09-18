const router = require('express').Router();
const { variantController } = require('../controllers');

router.get('/', variantController.getAllVariants);
router.get('/:id', variantController.getVariantById);
router.patch('/:id', variantController.editVariantById);
router.delete(':id', variantController.deleteVariantById);
router.post('/', variantController.createVariant);

module.exports = router;

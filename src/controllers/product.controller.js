const sharp = require('sharp');
const { ResponseError } = require('../errors');
const {
  Sequelize,
  sequelize,
  Product,
  Category,
  Variant,
} = require('../models');
const sendResponse = require('../utils/sendResponse');

const productController = {
  getProducts: async (req, res) => {
    try {
      const { name, categoryId, sortBy, orderBy } = req.query;

      const where = {};
      if (name) where.name = { [Sequelize.Op.like]: `%${name}%` };
      if (categoryId) where['$Categories.id$'] = categoryId;

      const productsData = await Product.findAll({
        where,
        attributes: { exclude: ['image'] },
        order: [[sortBy || 'updatedAt', orderBy || 'DESC']],
        include: [
          {
            model: Category,
            attributes: { exclude: ['image'] },
          },
        ],
      });

      sendResponse({ res, statusCode: 200, data: productsData });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProductImageById: async (req, res) => {
    try {
      const productData = await Product.findByPk(req.params.id, {
        attributes: ['image'],
      });
      if (!productData?.image)
        throw new ResponseError('product image not found', 404);

      res.set('Content-type', 'image/png').send(productData.image);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  createProduct: async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        if (req.file) {
          // get product image
          req.body.image = await sharp(req.file.buffer).png().toBuffer();
        }

        // create new product
        const productData = await Product.create(req.body, {
          field: ['name', 'description', 'image', 'isActive'],
          transaction: t,
        });

        // set product category
        if (req.body?.categoryId) {
          // check if categoryId exist
          const categoriesData = await Category.findAll({
            attributes: ['id'],
            where: { id: req.body.categoryId },
            transaction: t,
          });
          if (categoriesData?.length !== req.body.categoryId.length)
            throw new ResponseError('invalid categoryId', 400);

          // set category for new product
          await productData.setCategories(req.body.categoryId, {
            transaction: t,
          });
        }

        // set product variant
        if (req.body?.variants) {
          // set variant for new product
          const variantsData = await Variant.bulkCreate(req.body.variants, {
            fields: ['name', 'price', 'stock'],
            transaction: t,
          });
          await productData.setVariants(variantsData, { transaction: t });
        }

        // get product data
        const result = await Product.findByPk(productData.id, {
          attributes: { exclude: ['image'] },
          include: [
            { model: Category, attributes: { exclude: ['image'] } },
            { model: Variant },
          ],
          transaction: t,
        });

        sendResponse({ res, statusCode: 200, data: result });
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editProductById: async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        if (req.file) {
          // get product image
          req.body.image = await sharp(req.file.buffer).png().toBuffer();
        }

        // update product
        const [numProductUpdated] = await Product.update(req.body, {
          where: { id: req.params.id },
          field: ['name', 'description', 'image', 'isActive'],
          transaction: t,
        });
        if (numProductUpdated === 0)
          throw new ResponseError('product not found', 404);

        // get product data
        const productData = await Product.findByPk(req.params.id, {
          transaction: t,
        });

        // update product category
        if (req.body?.categoryId) {
          // check if categoryId exist
          const categoriesData = await Category.findAll({
            attributes: ['id'],
            where: { id: req.body.categoryId },
            transaction: t,
          });
          if (categoriesData?.length !== req.body.categoryId.length)
            throw new ResponseError('invalid categoryId', 400);

          // set category for product
          await productData.setCategories(req.body.categoryId, {
            transaction: t,
          });
        }

        // update product variant
        if (req.body?.variants) {
          // get existed variants and new variants
          const newVariants = req.body.variants.filter(
            (variant) => !variant?.id
          );
          const updateVariants = req.body.variants.filter(
            (variant) => !!variant?.id
          );

          // delete existed variants in db but not exist in req.body
          const variantsData = await productData.getVariants({
            transaction: t,
          });
          const updateVariantsId = updateVariants.map(({ id }) => id);
          // eslint-disable-next-line no-restricted-syntax
          for (const variantData of variantsData) {
            if (!updateVariantsId.includes(variantData.id)) {
              // eslint-disable-next-line no-await-in-loop
              await variantData.destroy({
                where: { id: variantData.id },
                transaction: t,
              });
            }
          }

          // update existed variants
          // eslint-disable-next-line no-restricted-syntax
          for (const updateVariant of updateVariants) {
            // eslint-disable-next-line no-await-in-loop
            const [numVariantUpdated] = await Variant.update(updateVariant, {
              where: { id: updateVariant.id },
              fields: ['name', 'price', 'stock'],
              transaction: t,
            });
            if (numVariantUpdated === 0)
              throw new ResponseError('invalid variant id', 400);
          }

          // create new variant
          const newVariantsData = await Variant.bulkCreate(newVariants, {
            fields: ['name', 'price', 'stock'],
            transaction: t,
          });
          await productData.addVariants(newVariantsData, { transaction: t });
        }

        res.sendStatus(204);
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteProductById: async (req, res) => {
    try {
      const result = await Product.destroy({ where: { id: req.params.id } });
      if (!result) throw new ResponseError('product not found', 404);

      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = productController;

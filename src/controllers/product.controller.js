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

        // check if categoryId exist
        const categoriesData = await Category.findAll({
          attributes: ['id'],
          where: { id: req.body.categoryId },
          transaction: t,
        });
        if (categoriesData?.length !== req.body.categoryId.length)
          throw new ResponseError('invalid categoryId', 400);

        // create new product
        const productData = await Product.create(req.body, {
          field: ['name', 'description', 'image', 'isActive'],
          transaction: t,
        });

        // set category for new product
        await productData.setCategories(req.body.categoryId, {
          transaction: t,
        });

        // set variant for new product
        const variantsData = await Variant.bulkCreate(req.body.variants, {
          fields: ['name', 'price', 'stock'],
          transaction: t,
        });
        console.log(variantsData);
        await productData.setVariants(variantsData, { transaction: t });

        // get result product data
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
      //
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  deleteProductId: async (req, res) => {
    try {
      //
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = productController;

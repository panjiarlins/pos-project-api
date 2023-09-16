const sharp = require('sharp');
const { ResponseError } = require('../errors');
const { Sequelize, sequelize, Product, Category } = require('../models');
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
        await productData.setCategories(req.body.categoryId, {
          transaction: t,
        });

        res.status(201).json({
          status: 'success',
          data: {
            ...productData.toJSON(),
            image: undefined,
          },
        });
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  editProductById: async (req, res) => {
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
        await productData.setCategories(req.body.categoryId, {
          transaction: t,
        });

        res.status(201).json({
          status: 'success',
          data: {
            ...productData.toJSON(),
            image: undefined,
          },
        });
      });
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

const sharp = require('sharp');
const { Category } = require('../models');
const { ResponseError } = require('../errors');
const sendResponse = require('../utils/sendResponse');

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categoriesData = await Category.findAll({
        attributes: { exclude: ['image'] },
      });

      sendResponse({ res, statusCode: 200, data: categoriesData });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategoryImageById: async (req, res) => {
    try {
      const categoryData = await Category.findByPk(req.params.id, {
        attributes: ['image'],
      });
      if (!categoryData?.image)
        throw new ResponseError('category image not found', 404);

      res.set('Content-type', 'image/png').send(categoryData.image);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  createCategory: async (req, res) => {
    try {
      // get category image
      req.body.image = await sharp(req.file.buffer).png().toBuffer();

      // create new category
      const categoryData = await Category.create(req.body, {
        fields: ['name', 'image'],
      });

      sendResponse({
        res,
        statusCode: 201,
        data: {
          ...categoryData.toJSON(),
          image: undefined,
        },
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editCategoryById: async (req, res) => {
    try {
      // get category image
      if (req.file)
        req.body.image = await sharp(req.file.buffer).png().toBuffer();

      // check if category exist
      const categoryData = await Category.findByPk(req.params.id);
      if (!categoryData) throw new ResponseError('category not found', 404);

      // update category
      await categoryData.update(req.body, { fields: ['name', 'image'] });

      res.sendStatus(204);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  deleteCategoryById: async (req, res) => {
    try {
      // delete category
      const result = await Category.destroy({ where: { id: req.params.id } });
      if (!result) throw new ResponseError('category not found', 404);

      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = categoryController;

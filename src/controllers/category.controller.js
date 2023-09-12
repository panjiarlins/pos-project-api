const sharp = require('sharp');
const { sequelize, Category } = require('../models');
const { ResponseError } = require('../errors');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categoriesData = await Category.findAll({
        attributes: { exclude: ['image'] },
      });
      res.status(200).json({
        status: 'success',
        data: categoriesData,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  createCategory: async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        if (req.file) {
          // get category image
          req.body.image = await sharp(req.file.buffer).png().toBuffer();
        }

        const categoryData = await Category.create(req.body, {
          fields: ['name', 'image'],
          transaction: t,
        });

        res.status(201).json({
          status: 'success',
          data: {
            ...categoryData.toJSON(),
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

  editCategoryById: async () => {},

  deleteCategoryById: async (req, res) => {
    try {
      const result = await Category.destroy({ where: { id: req.params.id } });
      if (!result) throw new ResponseError('category not found', 404);

      res.sendStatus(204);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = categoryController;

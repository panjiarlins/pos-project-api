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
        // get category image
        if (req.file)
          req.body.image = await sharp(req.file.buffer).png().toBuffer();

        // create category
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
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = categoryController;

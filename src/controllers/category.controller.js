const sharp = require('sharp');
const { ResponseError } = require('../errors');
const sendResponse = require('../utils/sendResponse');
const { Sequelize, Category, Product } = require('../models');

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const { name } = req.query;

      const where = {};
      if (name) where.name = { [Sequelize.Op.like]: `%${name}%` };

      const categoriesData = await Category.findAll({
        where,
        attributes: { exclude: ['image'] },
        include: [{ model: Product, attributes: { exclude: ['image'] } }],
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

      // check if there is data to be updated
      if (Object.keys(req.body).length === 0)
        throw new ResponseError('no data provided', 400);

      // update category
      const [numCategoryUpdated] = await Category.update(req.body, {
        where: { id: req.params.id },
        fields: ['name', 'image'],
      });
      if (numCategoryUpdated === 0)
        throw new ResponseError('category not found', 404);

      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
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

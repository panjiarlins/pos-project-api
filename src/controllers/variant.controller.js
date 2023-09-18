const { Variant } = require('../models');

const { ResponseError } = require('../errors');

const variantController = {
  createVariant: async (req, res) => {
    try {
      const newVariant = await Variant.create(req.body);
      res.status(201).json({
        status: 'success',
        data: newVariant,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  getAllVariants: async (req, res) => {
    try {
      const variantsData = await Variant.findAll();
      res.status(200).json({
        status: 'success',
        data: variantsData,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  getVariantById: async (req, res) => {
    try {
      const variantData = await Variant.findByPk(req.params.id);
      if (!variantData) throw new ResponseError('Variant not found', 404);

      res.status(200).json({
        status: 'success',
        data: variantData,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  editVariantById: async (req, res) => {
    try {
      const [numUpdated] = await Variant.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (numUpdated === 0) throw new ResponseError('Variant not found', 404);

      res.sendStatus(204);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  deleteVariantById: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedVariant = await Variant.destroy({ where: { id } });

      if (deletedVariant === 0)
        throw new ResponseError('Variant not found', 404);

      res.sendStatus(204);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = variantController;

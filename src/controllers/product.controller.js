/* eslint-disable no-unused-vars */
const { ResponseError } = require('../errors');
const { Product } = require('../models');

const productController = {
  getProducts: async (req, res) => {
    try {
      //
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  createProduct: async (req, res) => {
    try {
      //
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
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

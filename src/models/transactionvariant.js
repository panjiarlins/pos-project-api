'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TransactionVariant.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalWithoutDiscount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TransactionVariant',
    }
  );
  TransactionVariant.removeAttribute('id');
  return TransactionVariant;
};

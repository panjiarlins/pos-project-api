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
      // models.TransactionVariant.belongsTo(models.Variant, {
      //   foreignKey: 'variantId',
      // });
    }
  }
  TransactionVariant.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    // {
    //   price: {
    //     type: DataTypes.FLOAT,
    //     allowNull: false,
    //   },
    // },
    {
      sequelize,
      modelName: 'TransactionVariant',
    }
  );
  TransactionVariant.removeAttribute('id');
  return TransactionVariant;
};

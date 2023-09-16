'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Transaction.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Transaction.belongsTo(models.Voucher, {
        foreignKey: {
          name: 'voucherCode',
          allowNull: true,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Transaction.belongsToMany(models.Variant, {
        through: models.TransactionVariant,
        foreignKey: {
          name: 'transactionId',
          primaryKey: true,
          unique: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Transaction.init(
    {
      userId: DataTypes.INTEGER,
      voucherCode: DataTypes.STRING,
      total: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  );
  return Transaction;
};

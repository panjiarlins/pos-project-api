'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, {
        as: 'Transactions',
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCASE',
      });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      fullname: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.BLOB('long') },
      isAdmin: { type: DataTypes.BOOLEAN, allowNull: false },
      isCashier: { type: DataTypes.BOOLEAN, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};

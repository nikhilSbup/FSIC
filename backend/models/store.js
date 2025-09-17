const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
    address: { type: DataTypes.STRING(400), allowNull: true },
    ownerId: { type: DataTypes.INTEGER, allowNull: true },
  }, { tableName: 'stores', timestamps: true });
};

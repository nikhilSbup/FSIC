const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(60), allowNull: false, validate: { len: [2, 60] } },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING(400), allowNull: true },
    role: { type: DataTypes.ENUM('SYSTEM_ADMIN','NORMAL_USER','STORE_OWNER'), allowNull: false, defaultValue: 'NORMAL_USER' },
  }, { tableName: 'users', timestamps: true });
};

const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const StoreModel = require('./store');
const RatingModel = require('./rating');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME || 'fsic_db',
  process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  dialect: 'mysql',           // changed from 'postgres' to 'mysql'
  dialectOptions: {
    // optional: ensure timezone or SSL settings here if needed
  },
  logging: false,
});


const User = UserModel(sequelize);
const Store = StoreModel(sequelize);
const Rating = RatingModel(sequelize);

// Associations
User.hasMany(Rating, { foreignKey: 'userId', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Store.hasMany(Rating, { foreignKey: 'storeId', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

// If a user is a store owner, link them (optional)
User.hasOne(Store, { foreignKey: 'ownerId' });
Store.belongsTo(User, { foreignKey: 'ownerId' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};

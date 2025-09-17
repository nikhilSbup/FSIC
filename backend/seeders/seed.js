/**
 * Seed script to create an initial SYSTEM_ADMIN and sample stores/users.
 * Usage: node seeders/seed.js
 */
const { sequelize, User, Store } = require('../models');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await sequelize.sync();
    console.log('Database synced.');

    // Admin account
    const password = await bcrypt.hash('Admin@1234', 10);
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@fsic.test' },
      defaults: {
        name: 'Primary System Administrator Account User', // >20 chars
        email: 'admin@fsic.test',
        password,
        role: 'SYSTEM_ADMIN',
        address: 'Headquarters Main Office Address'
      }
    });

    // Store owner account
    const ownerPass = await bcrypt.hash('Owner@1234', 10);
    const [owner] = await User.findOrCreate({
      where: { email: 'owner@fsic.test' },
      defaults: {
        name: 'Registered Store Owner Account Primary User', // >20 chars
        email: 'owner@fsic.test',
        password: ownerPass,
        role: 'STORE_OWNER',
        address: 'Registered Store Owner Residential Address'
      }
    });

    // Sample stores
    await Store.findOrCreate({
      where: { name: 'Cappuccino Corner Cafe and Beverage Hub' }, // >20 chars
      defaults: {
        name: 'Cappuccino Corner Cafe and Beverage Hub',
        email: 'cappu@store.test',
        address: 'MG Road Main Branch Bangalore',
        ownerId: owner.id || owner[0].id
      }
    });

    await Store.findOrCreate({
      where: { name: 'The Sandwich Hub Authentic Snack Center' }, // >20 chars
      defaults: {
        name: 'The Sandwich Hub Authentic Snack Center',
        email: 'sand@store.test',
        address: 'Brigade Road Central Food Market',
        ownerId: owner.id || owner[0].id
      }
    });

    console.log('Seed complete. Admin login: admin@fsic.test / Admin@1234');
    process.exit(0);
  } catch (err) {
    console.error('Error during seed:', err);
    process.exit(1);
  }
}

seed();

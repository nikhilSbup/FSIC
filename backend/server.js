require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.sync(); // { force: true } if you want to reset tables
    app.listen(PORT, () => console.log('Server listening on port', PORT));
  } catch (err) {
    console.error('Failed to start', err);
  }
}

start();

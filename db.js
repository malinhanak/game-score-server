require('dotenv').config();
const mongoose = require('mongoose');

const { DB_URI } = process.env;

async function connect() {
  try {
    await mongoose.connect(DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.info(`Koppling mot databasen etablerades`);
  } catch (error) {
    console.error(`Ett fel uppstod`, error);
    process.exit(1);
  }
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };

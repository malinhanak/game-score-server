require('dotenv').config();
const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log(`Connected to DB`);
  } catch (error) {
    console.error(`Something went wrong`, err);
    // process.exit(1)
  }
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };

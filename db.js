require('dotenv').config();
const mongoose = require('mongoose');

const uri = 'mongodb+srv://hgAdmin:hg_forLIFE@malins-cluster-155rd.mongodb.net/game-score';

async function connect() {
  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
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

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  year: {
    type: String,
    required: true
  },
  games: [String]
});

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
module.exports = Game;

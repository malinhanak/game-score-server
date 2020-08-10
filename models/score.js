const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  team: {
    type: String,
    required: true,
    unique: true
  },
  scoreTotal: { type: Number },
  scores: { type: mongoose.Mixed }
});

ScoreSchema.plugin(uniqueValidator);

const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);
module.exports = Score;

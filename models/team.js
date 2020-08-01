const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  kubb: { type: Number },
  crocket: { type: Number },
  plockepin: { type: Number },
  arrowTarget: { type: Number },
});

TeamSchema.plugin(uniqueValidator);

// module.exports = mongoose.model('Team', TeamSchema);
module.exports = mongoose.models.Team || mongoose.model('Team', TeamSchema);

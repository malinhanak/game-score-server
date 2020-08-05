const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (name) => Team.doesNotExist({ name }),
      message: 'Teamet existerar redan!'
    }
  },
  slug: String,
  password: { type: String, required: true },
  members: [String]
});

TeamSchema.plugin(uniqueValidator);

TeamSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

TeamSchema.statics.doesNotExist = async function (field) {
  return (await this.where(field).countDocuments()) === 0;
};

TeamSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
module.exports = Team;

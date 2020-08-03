const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (username) => Admin.doesNotExist({ username }),
      message: 'Användaren existerar redan'
    }
  },
  name: { type: String },
  password: { type: String, required: true },
  role: [String]
});

AdminSchema.plugin(uniqueValidator);

AdminSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

AdminSchema.statics.doesNotExist = async function (field) {
  return (await this.where(field).countDocuments()) === 0;
};

AdminSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
module.exports = Admin;

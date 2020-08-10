const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const RuleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (slug) => Rule.doesNotExist({ slug }),
      message: 'Det finns redan regler för spelet, testa uppdatera istället.'
    }
  },
  rules: String
});

RuleSchema.plugin(uniqueValidator);

RuleSchema.statics.doesNotExist = async function (field) {
  return (await this.where(field).countDocuments()) === 0;
};

const Rule = mongoose.models.Rule || mongoose.model('Rule', RuleSchema);
module.exports = Rule;

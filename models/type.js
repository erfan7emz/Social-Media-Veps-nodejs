const Joi = require('joi');
const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  }
});

const Type = mongoose.model('Type', typeSchema);

function validateType(type) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required()
  });
  return schema.validate(type);
}

exports.typeSchema = typeSchema;
exports.Type = Type; 
exports.validate = validateType;
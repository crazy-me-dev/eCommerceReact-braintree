const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50
    }
  },
  //records timestamps automatically
  { timestamps: true }
);

exports.validateCategory = category => {
  const schema = Joi.object({
    name: Joi.string()
      .max(50)
      .required()
  });
  return schema.validate(category);
};

exports.Category = mongoose.model("Category", categorySchema);

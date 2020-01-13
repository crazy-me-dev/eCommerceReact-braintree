const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    sold: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    hasPhoto: {
      type: Boolean,
      default: false
    },
    shipping: {
      required: false,
      type: Boolean
    }
  },
  //records timestamps automatically
  { timestamps: true }
);

exports.validateProduct = product => {
  const schema = Joi.object({
    name: Joi.string()
      .max(500)
      .required(),
    description: Joi.string().required(),
    price: Joi.number()
      .min(0)
      .required(),
    category: Joi.objectId().required(),
    sold: Joi.number().min(0),
    quantity: Joi.number()
      .min(0)
      .required(),

    shipping: Joi.boolean().required()
  });

  return schema.validate(product);
};

exports.Product = mongoose.model("Product", productSchema);

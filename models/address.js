const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema = new Schema(
  {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zip: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },
  //records timestamps automatically
  { timestamps: true }
);
module.exports = mongoose.model("Address", addressSchema);

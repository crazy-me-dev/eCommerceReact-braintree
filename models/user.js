const mongoose = require("mongoose");
const crypto = require("crypto");
const uuid = require("uuid/v1");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const { ObjectId } = mongoose.Schema;
const Address = require("./address").schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    about: {
      type: String,
      trim: true
    },
    salt: String,
    //standard user 0, admin user 1
    role: {
      type: Number,
      default: 0
    },
    history: [{ type: ObjectId, ref: "Order" }],
    address: { type: Address }
  },
  //records timestamps automatically
  { timestamps: true }
);

//virtual fields

userSchema
  .virtual("password")
  .set(function(password) {
    this._password;
    this.salt = uuid();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

//methods

userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  encryptPassword: function(password) {
    if (!password) return "";

    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  generateAuthToken: function() {
    const token = jwt.sign({ _id: this._id }, keys.jwtPrivateKey);
    return token;
  }
};

validateNewUser = user => {
  const schema = Joi.object({
    name: Joi.string()
      .min(6)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(30)
      .pattern(/\d/)
      .required()
  });

  const result = schema.validate(user);

  if (result.error) {
    let message = result.error.details[0].message;
    if (message.includes("password")) {
      message = "Password must be at least 6 characters and contains a digit";
      result.error.details[0].message = message;
    }
  }

  return result;
};

validateUser = user => {
  const schema = Joi.object({
    name: Joi.string()
      .min(6)
      .max(50),
    password: Joi.string()
      .min(6)
      .max(30)
      .pattern(/\d/),
    address: Joi.any()
  });

  const result = schema.validate(user);

  if (result.error) {
    let message = result.error.details[0].message;
    if (message.includes("password")) {
      message = "Password must be at least 6 characters and contains a digit";
      result.error.details[0].message = message;
    }
  }
  return result;
};

const User = mongoose.model("User", userSchema);
module.exports = { User, Address, validateNewUser, validateUser };

const Joi = require("@hapi/joi");

module.exports = () => {
  //add objectId to validate mongo objectId
  Joi.objectId = require("joi-objectid")(Joi);
};

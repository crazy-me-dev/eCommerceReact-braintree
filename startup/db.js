const mongoose = require("mongoose");
const winston = require("winston");
const keys = require("../config/keys");

module.exports = async () => {
  //setting up the DB
  // mongoose.Promise = global.Promise;
  try {
    await mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log(`Connected to ${keys.mongoURI}...`);
    winston.info(`Connected to ${keys.mongoURI}...`);
  } catch (err) {
    console.log(err);
    winston.error(err);
  }
};

//will log errors globally
const winston = require("winston");

//will handle the async error globally
require("express-async-errors");

module.exports = () => {
  //handles uncaughtExceptions
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  //handles unhandledRejection
  process.on("unhandledRejection", ex => {
    throw ex;
  });

  //log into a file
  winston.configure({
    transports: [new winston.transports.File({ filename: "logfile.log" })]
  });
};

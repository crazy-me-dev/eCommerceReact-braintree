const winston = require("winston");
const { errorHandler } = require("../helpers/errorHandler");

module.exports = function(err, req, res, next) {
  //logging errors
  winston.error(err.message, err);

  let incomingError = errorHandler(err);

  //checking the status number to send a custom status number
  if (incomingError.status)
    return res.status(incomingError.status).send(incomingError.error);

  //no status sending internal error status code
  res.status(500).send(err.message);
};

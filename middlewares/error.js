const winston = require("winston");
const { errorHandler } = require("../helpers/errorHandler");

module.exports = function(err, req, res, next) {
  //logging errors
  winston.error(err.message, err);

  let incomingError = errorHandler(err);

  //checking the status number to send a custom status number
  if (incomingError.status)
    return res
      .status(incomingError.status)
      .json({ error: incomingError.error });

  //no status. Sending internal error status code
  res.status(500).json({ error: err.message });
};

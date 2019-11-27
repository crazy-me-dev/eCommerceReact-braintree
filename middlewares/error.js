const winston = require("winston");
const { errorHandler } = require("../helpers/errorHandler");

module.exports = function(err, req, res, next) {
  winston.error(err.message, err);

  let error = errorHandler(err);
  if (error.status)
    return res.status(error.status).send({ error: error.error });

  res.status(500).send(err.message);
};

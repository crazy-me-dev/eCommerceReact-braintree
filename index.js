const express = require("express");
const winston = require("winston");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();

require("./startup/validation")();

//Assigning port number
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  winston.info(`Listening on port ${PORT}`);
  console.log(`Listening on port ${PORT}`);
});

//To be use for testing purpuses
module.exports = server;

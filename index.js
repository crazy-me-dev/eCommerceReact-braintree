const express = require("express");
const winston = require("winston");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();

require("./startup/validation")();

//Assigning port number
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === "production") {
  // //express will serve up production assets
  // // like main.js or main.css
  // app.use(express.static("client/build"));

  // //Express will serve up the index.html
  // //if it does not recognize the route like /dashboard and so on
  // const path = require("path");
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  // });
  app.use(compression());
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const server = app.listen(PORT, () =>
  // winston.info(`Listening on port ${PORT}`)
  console.log(`Listening on port ${PORT}`)
);

//To be use for testing purpuses
module.exports = server;

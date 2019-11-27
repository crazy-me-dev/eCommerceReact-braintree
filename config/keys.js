if (process.env.NODE_ENV === "production") {
  //production mode
  module.exports = require("./prod");
} else if (process.env.NODE_ENV === "test") {
  //production mode
  module.exports = require("./testKeys");
} else {
  //development mode
  module.exports = require("./dev");
}

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//import routes
const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");
const categoryRoutes = require("../routes/category");
const productRoutes = require("../routes/product");
const braintreeRoutes = require("../routes/braintree");
const orderRoutes = require("../routes/order");
/**
 * will handle errors globally passed as last route
 */
const error = require("../middlewares/error");

module.exports = app => {
  //middlewares
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors());

  //routes middleware
  app.use("/api", authRoutes);
  app.use("/api", userRoutes);
  app.use("/api", categoryRoutes);
  app.use("/api", productRoutes);
  app.use("/api", braintreeRoutes);
  app.use("/api", orderRoutes);
  app.use(error);
};

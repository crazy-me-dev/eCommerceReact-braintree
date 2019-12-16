const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const {
  create,
  listOrders,
  read,
  orderById,
  getStatusValues,
  updateStatus
} = require("../controllers/order");
const { updateQuantity } = require("../controllers/product");

router.post("/order/create/:userId", requireSignin, isAuth, updateQuantity, create);

router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders);
router.get("/order/statusValues/:userId", requireSignin, isAuth, isAdmin, getStatusValues);
router.get("/order/:orderId/:userId", requireSignin, isAuth, isAdmin, read);

router.put("/order/:orderId/:userId", requireSignin, isAuth, isAdmin, updateStatus);

/**
 * All params
 */
router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;

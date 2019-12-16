const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { generateBraintreeToken, processPayment } = require("../controllers/braintree");

router.get("/braintree/token/:userId", requireSignin, isAuth, generateBraintreeToken);
router.post("/braintree/payment/:userId", requireSignin, isAuth, processPayment);

/**
 * All params
 */
router.param("userId", userById);
module.exports = router;

const express = require("express");

const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

const {
  create,
  remove,
  read,
  update,
  list,
  categoryById
} = require("../controllers/category");

router.get(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  read
);
router.get("/categories", list);

router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);

router.delete(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.put(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;

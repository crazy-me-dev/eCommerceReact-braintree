const express = require("express");

const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo
} = require("../controllers/product");

/**
 * All GET routes
 */
router.get("/product/:productId", read);
router.get("/product/photo/:productId", photo);
router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);

/**
 * All POST routes
 */
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.post("/products/by/search", listBySearch);

router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);

/**
 * All params
 */
router.param("userId", userById);
router.param("productId", productById);

module.exports = router;

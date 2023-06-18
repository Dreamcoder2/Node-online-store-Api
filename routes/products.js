const express = require("express");
const router = express.Router();
const productController = require("../controllers/productCtrl");
const isLoggedin = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");
const uploaded = require("../config/fileUpload");

router.post(
  "/addproduct",
  uploaded.array("files"),
  isLoggedin,
  isAdmin,
  productController.createProduct
);

router.get(
  "/getproducts",

  productController.getProduct
);

router.put(
  "/updateproduct/:id",
  isLoggedin,
  isAdmin,
  productController.updateProduct
);

router.delete(
  "/deleteproduct/:id",
  isLoggedin,
  isAdmin,
  productController.deleteProduct
);

module.exports = router;

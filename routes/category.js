const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryCtrl");
const isLoggedin = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");

const upload = require("../config/fileUpload");

router.get("/getcategory", categoryController.getCategory);

router.get("/getcategory/:id", categoryController.getoneCategory);

router.put(
  "/updatecategory/:id",
  isLoggedin,
  isAdmin,
  categoryController.updateCategory
);

router.delete(
  "/deletecategory/:id",
  isLoggedin,
  isAdmin,
  categoryController.deleteCategory
);

router.post(
  "/addcategory",
  isLoggedin,
  isAdmin,
  upload.single("file"),
  categoryController.createCategory
);

module.exports = router;

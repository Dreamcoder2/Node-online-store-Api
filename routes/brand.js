const express = require("express");
const router = express.Router();
const brandController = require("../controllers/BrandsCtrl");
const isAuth = require("../middlewares/isLoggedin");
// const isLoggedin = require('../middlewares/isLoggedin');
const isAdmin = require("../middlewares/isAdmin");

router.get("/getbrand", brandController.getBrand);

router.get("/getbrand/:id", brandController.getoneBrand);

router.put("/updatebrand/:id", brandController.updateBrand);

router.post("/addbrand", isAuth, isAdmin, brandController.createBrand);

router.delete("/deletebrand/:id", isAuth, isAdmin, brandController.deleteBrand);

module.exports = router;

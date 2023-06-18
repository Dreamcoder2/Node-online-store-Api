const express = require("express");
const router = express.Router();
const couponController = require("../controllers/coupons");
const isLoggedIn = require("../middlewares/isLoggedin");
const isAuth = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");

router.post("/post", isLoggedIn, couponController.createCoupon);

router.get("/get", couponController.getAllCoupouns);
router.get("/getone/:id", couponController.getonecoupon);
router.put("/update/:id", isAuth, isAdmin, couponController.updateCoupon);
router.delete("/delete/:id", isAuth, isAdmin, couponController.deleteCoupon);

module.exports = router;

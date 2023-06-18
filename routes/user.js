const express = require("express");
const UserController = require("../controllers/userCtrl");
const isLoggedIn = require("../middlewares/isLoggedin");

const router = express.Router();

router.post("/register", UserController.RegsiterUser);

router.post("/login", UserController.LoginUser);

router.get("/profile", isLoggedIn, UserController.UserProfile);

router.put("/updateshipping", isLoggedIn, UserController.updateshippingaddress);

module.exports = router;

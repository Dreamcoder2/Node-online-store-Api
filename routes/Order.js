const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderCtrl");
const isAuth = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");

router.post("/post", isAuth, isAdmin, orderController.createOrder);

router.get("/get", orderController.getAllOrders);

router.get("/get/:id", orderController.getsingleOrder);

router.put("/update/:id", isAuth, isAdmin, orderController.updateorder);

router.get("/salereport", isAuth, isAdmin, orderController.getdaysale);

module.exports = router;

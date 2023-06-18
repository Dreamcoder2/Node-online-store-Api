const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/ReviewCtrl");
const isAuth = require("../middlewares/isLoggedin");

router.post("/addreview/:id", isAuth, reviewController.createReiew);

module.exports = router;

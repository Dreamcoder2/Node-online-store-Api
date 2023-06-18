const express = require("express");
const router = express.Router();
const colorController = require("../controllers/colorCtrl");
const isAuth = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");

router.get("/getcolor", colorController.getallcolors);

router.get("/getcolor/:id", colorController.getonecolor);

router.put("/updatecolor/:id", isAuth, isAdmin, colorController.editcolor);

router.post("/addcolor", isAuth, isAdmin, colorController.addColor);

router.delete("/deletecolor/:id", isAuth, isAdmin, colorController.deletecolor);

module.exports = router;

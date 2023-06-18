const Coupon = require("../model/Coupon");
const asyncHandler = require("express-async-handler");

exports.createCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  // 01. CHECK IS ADMIN

  // 02 . CHECK COUPON ALREDY EXISTS

  const couponExists = await Coupon.findOne({
    code,
  });
  if (couponExists) {
    throw new Error("coupon already exists");
  }
  if (isNaN(discount)) {
    throw new Error("discount valu must be a number");
  }

  // 03. CREATE THE COUPOUN
  const coupon = await Coupon.create({
    user: req.userAuthId,
    code: code.toUpperCase(),
    startDate,
    endDate,
    discount,
  });
  res.json({
    msg: "success",
    coupon,
  });
});

exports.getAllCoupouns = asyncHandler(async (req, res) => {
  const coupouns = await Coupon.find();
  res.json({
    msg: "success",
    coupouns,
  });
});

exports.getonecoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const findonecoupon = await Coupon.findById(id);
  if (!findonecoupon) {
    throw new Error("no coupon foundd");
  }
  res.json({
    msg: "copun found success",
    findonecoupon,
  });
});

exports.updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate } = req.body;
  const id = req.params.id;
  const updateCoupon = await Coupon.findByIdAndUpdate(id, {
    code,
    startDate,
    endDate,
  });
  if (!updateCoupon) {
    throw new Error("not able to update");
  }
  res.json({
    msg: "copun found success",
    updateCoupon,
  });
});

exports.deleteCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deleteCoupon = await Coupon.findByIdAndDelete(id);
  if (!deleteCoupon) {
    throw new Error("not able to delete");
  }
  res.json({
    msg: "copun found success",
    deleteCoupon,
  });
});

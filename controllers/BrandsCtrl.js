const Brand = require("../model/Brand");
const asyncHandler = require("express-async-handler");

// create the brand
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // find the brand
  const brandExists = await Brand.findOne({ name });
  if (brandExists) {
    throw new Error(" Brand already exists ");
  }
  const brand = await Brand.create({
    name,
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    messsage: "brand created success",
    brand,
  });
});

// read the allbrands
exports.getBrand = asyncHandler(async (req, res) => {
  // find the brand
  const brandExists = await Brand.find();
  if (!brandExists) {
    throw new Error(" Brand not found ");
  }

  res.json({
    status: "success",
    messsage: "brand fetched success",
    brandExists,
  });
});

// get single brand
exports.getoneBrand = asyncHandler(async (req, res) => {
  // find the brand
  const brandExists = await Brand.findById(req.params.id);
  if (!brandExists) {
    throw new Error(" Brand not found ");
  }

  res.json({
    status: "success",
    messsage: "brand fetched success",
    brandExists,
  });
});

// update the brand
exports.updateBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // find the brand
  const update = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  if (!update) {
    throw new Error(" Brand not updated ");
  }

  res.json({
    status: "success",
    messsage: "brand updated success",
    update,
  });
});

// remove the brand
exports.deleteBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // find the brand
  const deleted = await Brand.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new Error(" Brand not found ");
  }

  res.json({
    status: "success",
    messsage: "brand deleted success",
    deleted,
  });
});

const Category = require("../model/Category");
const asyncHandler = require("express-async-handler");
const { findByIdAndDelete, findOneAndDelete } = require("../model/User");

exports.createCategory = asyncHandler(async (req, res) => {
  const uploadedimage = req.file.path;
  const { name, image } = req.body;

  // category exists
  const categoryFound = await Category.find({ name });

  // if (categoryFound) {
  //   throw new Error("Category already exists");
  // }
  // carete category
  const category = await Category.create({
    name,
    user: req.userAuthId,
    image: uploadedimage,
  });

  res.json({
    status: "success",
    message: "category created success",
    category,
  });
});

// fetching the categoriees
exports.getCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    throw new Error("You dont have any categories");
  }
  res.json({
    status: "success",
    message: "fetched categories success",
    categories,
  });
});

// getsingle category
exports.getoneCategory = asyncHandler(async (req, res) => {
  const categories = await Category.findById(req.params.id);
  if (!categories) {
    throw new Error("You dont have any categories");
  }
  res.json({
    status: "success",
    message: "fetched categories success",
    categories,
  });
});

// update categories
exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  const update = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      image,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "updated Succssfully",
    update,
  });
});

// delete category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const deleteproduct = await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "deleted suceess",
    deleteproduct,
  });
});

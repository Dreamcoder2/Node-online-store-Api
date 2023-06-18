const asyncHandler = require("express-async-handler");
const Color = require("../model/color");

// add color
exports.addColor = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const colorExists = await Color.findOne({ name });
  if (colorExists) {
    throw new Error("the Entered color is already exists");
  }
  const addcolor = await Color.create({
    name,
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    message: "color added success",
    addcolor,
  });
});

// Get all colors
exports.getallcolors = asyncHandler(async (req, res) => {
  const getallcolor = await Color.find();
  res.json({
    ststus: "success",
    getallcolor,
  });
});

// Get single color
exports.getonecolor = asyncHandler(async (req, res) => {
  const getonecolor = await Color.findById(req.params.id);
  res.json({
    status: "success",
    getonecolor,
  });
});

// Update the color
exports.editcolor = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const edit = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    edit,
  });
});

//DELETE THE COLOR
exports.deletecolor = asyncHandler(async (req, res) => {
  const deletecolor = await Color.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    deletecolor,
  });
});

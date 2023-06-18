const asyncHandler = require("express-async-handler");
const Reviews = require("../model/Reviews");
const Product = require("../model/Product");

// 01.CREATE REVIEW
exports.createReiew = asyncHandler(async (req, res) => {
  // 1. FIND THE PRODUCT
  const id = req.params.id;
  const { message, rating } = req.body;
  const productFound = await Product.findById(id).populate("reviews");
  if (!productFound) {
    throw new Error(" No product Found ");
  }
  // 2. USER ALREADY REVIEW THE PRODUCT
  const userReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req.userAuthId.toString();
  });
  if (userReviewed) {
    throw new Error("You have already reviewed");
  }

  // 3. CREATE THE REVIEW
  const review = await Reviews.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });

  // 4. REVIEW INTO PRODUCT
  productFound.reviews.push(review?._id);

  // 5. SAVE THE PUSH
  await productFound.save();
  res.json({
    status: "success",
    message: "Review creted success",
    review,
  });
});

const User = require("../model/User");
const asyncHandler = require("express-async-handler");

const isAdmin = asyncHandler(async (req, res, next) => {
  // FIND THE LOGIN USER
  const user = await User.findById(req.userAuthId);
  // CHECK IF IS ADMIN
  if (user.IsAdmin) {
    next();
  } else {
    throw new Error("You are not authorised");
  }
});

module.exports = isAdmin;

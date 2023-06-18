const User = require("../model/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const verifyToken = require("../utils/verifyToken");
const getHeader = require("../utils/getHeader");

//Register User
exports.RegsiterUser = asyncHandler(async (req, res, next) => {
  const { FullName, Email, Password } = req.body;
  // const user = await User.findOne({ Email });
  // if (user) {
  //   throw new Error("User already exists");
  // }
  // const hashedPasssword = await bcrypt.hash(Password, 12);
  // const new_user = new User({
  //   FullName,
  //   Email,
  //   Password: hashedPasssword,
  // });
  // try {
  //   const result = await new_user.save();
  //   res.status(201).json({
  //     status: "success",
  //     msg: "User created success",
  //     data: result,
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     msg: err.message,
  //   });
  // }
  // check user exists
  User.findOne({ Email })
    .then((email) => {
      if (email) {
        // return res.json({ msg: "User alredy exists" });
        throw new Error("user already exists");
      }

      // hash pw
      bcrypt.hash(Password, 12).then((hashedPasssword) => {
        // Create the user
        User.create({
          FullName,
          Email,
          Password: hashedPasssword,
        })
          .then((result) => {
            if (!result) {
              throw new Error("issue in create the product");
            }
            res.status(201).json({
              status: "success",
              msg: "User created success",
              data: result,
            });
          })
          .catch((err) => {
            return next(err);
          });
      });
    })
    .catch((err) => {
      // res.status(404).json({ status: "Failure", msg: err });
      const error = new Error(err);
      error.statusCode = 404;
      return next(error);
    });
});

// Login User
exports.LoginUser = asyncHandler((req, res, next) => {
  const { Email, Password } = req.body;
  User.findOne({ Email })
    .then((user) => {
      if (!user) {
        throw new Error("Invalid login details");
      }
      if (user && bcrypt.compareSync(Password, user.Password)) {
        // generate jwt token
        const userId = user._id;
        const Token = generateToken(userId);
        res
          .status(200)
          .json({ status: "success", msg: "logged in successs", user, Token });
      } else {
        throw new Error("Incorrect paassword");
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 404;
      return next(error);
    });
});

// user profile access
exports.UserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userAuthId).populate("Orders");
  res.json({
    msg: "success",
    user,
  });
});

// UPDATE THE SHIPPING ADDRESS
exports.updateshippingaddress = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phone,
    country,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      ShippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      },
      HasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  //send response
  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const cloudinarystorage =
  require("multer-storage-cloudinary").CloudinaryStorage;

// CONFIG CLOUDINARY
cloudinary.config({
  cloud_name: "ddlyqmr6k",
  api_key: "448537769157652",
  api_secret: "KX2tHGNoCElefXCl7_1MGjVrNX4",
});

// CREATE STORAGE ENGINE
const storage = new cloudinarystorage({
  cloudinary,
  allowedFormat: ["jpg", "png", "jpeg"],
  params: {
    folder: "Ecommerce-api",
  },
});

// INIT MULTER WITH STORAGE ENGINE
const upload = multer({
  storage,
});

module.exports = upload;

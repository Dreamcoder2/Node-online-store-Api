const Category = require("../model/Category");
const Product = require("../model/Product");
const asyncHandler = require("express-async-handler");
const Brand = require("../model/Brand");

exports.createProduct = asyncHandler(async (req, res, next) => {
  const imagesPath = req.files.map((file) => file.path);

  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  // product exists
  const product = await Product.findOne({ name });
  if (product) {
    throw new Error("The product is already Exists");
  }

  const product2 = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: imagesPath,
  });
  // check brand exists
  const BrandFound = await Brand.findOne({
    name: brand,
  });
  if (!BrandFound) {
    throw new Error("Not able to find the brand");
  }
  BrandFound.products.push(product2._id);
  await BrandFound.save();

  // find the category
  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error("no category found");
  }
  // push the product into the category
  categoryFound.products.push(product2._id);
  // catch res
  await categoryFound.save();
  if (!product2) {
    throw new Error("not able to create the producct");
  }
  res.status(201).json({
    status: "success",
    message: "product created success",
    product2,
  });
});

// get all products
exports.getProduct = asyncHandler(async (req, res) => {
  // queery
  let productquery = Product.find();

  // search by name
  if (req.query.name) {
    productquery = productquery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  // serach by brand
  if (req.query.brand) {
    productquery = productquery.find({
      name: { $regex: req.query.brand, $options: "i" },
    });
  }

  //filter by category
  if (req.query.category) {
    productquery = productquery.find({
      name: { $regex: req.query.caategory, $options: "i" },
    });
  }

  // filter by color
  if (req.query.color) {
    productquery = productquery.find({
      name: { $regex: req.query.color, $options: "i" },
    });
  }

  // filter by size
  if (req.query.size) {
    productquery = productquery.find({
      name: { $regex: req.query.size, $options: "i" },
    });
  }

  //filter by price raange
  if (req.query.price) {
    const price = req.query.price.split("-");

    //pasing lles then or equal to
    productquery = productquery.find({
      price: { $gte: price[0], $lte: price[1] },
    });
  }

  //paginaation
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  //start index
  const startIndex = (page - 1) * limit;

  // end index
  const endIndex = page * limit;

  // total
  const total = await Product.countDocuments();

  productquery = productquery.skip(startIndex).limit(limit);

  // pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  try {
    const products = await productquery;
    res.status(200).json({
      status: "success",
      results: products.length,
      pagination,
      products,
      message: "product fetched sccess",
    });
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//update the product
exports.updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;
  // find product and update
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        category,
        sizes,
        colors,
        user,
        price,
        totalQty,
        brand,
      },
      {
        new: true,
      }
    );
    if (!product) {
      throw new Error("some issues in update the product");
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// delete the product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new Error("producct delete is not success");
  } else {
    res.status(200).json({ msg: "product delete successfully", product });
  }
});

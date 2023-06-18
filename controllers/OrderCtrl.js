const Order = require("../model/Order");
const asyncHandler = require("express-async-handler");

const User = require("../model/User");
const Product = require("../model/Product");
const Stripe = require("stripe");
const Coupon = require("../model/Coupon");

//CONFG STRIPE
const stripe = new Stripe(
  "sk_test_51NIlEASHhQE3ZPyATiaCmsIdVF8XOJhGmdUUehnhjOy7kAQNEuLXE1z98l9afIwbtK5c297RhO1RizKzkVOoAXfk00BS7Er9pf"
);

// 01.CREATE ORDER
let couponFound;

exports.createOrder = asyncHandler(async (req, res) => {
  const coupon = req.query.coupon;
  if (coupon) {
    couponFound = await Coupon.findOne({
      code: coupon.toUpperCase(),
    });
    if (couponFound.isExpired) {
      throw new Error("coupon code is expired");
    }
    if (!couponFound) {
      throw new Error("invalid couponn code");
    }
  }

  // DISCOUNT
  const discount = couponFound.discount;

  // 01. GET THE PAYLOAD (CX , ORDER ITEMS, SHIPPING ADDDRESS , TOTAL PRICE )
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // 02.FIND THE USER

  const user = await User.findById(req.userAuthId);

  // CHECK USER HAS SHIPPING ADDRESS
  if (!user?.HasShippingAddress) {
    throw new Error("Please enter the shipping address");
  }

  // 03. CHECK PRDER IS NOT EMPTY
  if (orderItems?.length <= 0) {
    throw new Error("No order found");
  }

  // 04. PLACE THE ORDER
  const order = await Order.create({
    user: user._id,
    orderItems,
    shippingAddress,
    totalPrice: (totalPrice / 100) * discount,
  });

  if (!order) {
    throw new Error("issue in create the order");
  }

  // 04.1 - push orders into user
  user?.Orders.push(order?._id);
  await user.save();

  // 05. UPDATE THE PRODUCT QTY.
  let orderedItems;

  const orderedproduct = orderItems.map(async (items) => {
    orderedItems = items;
    console.log(orderedItems);
    const findindb = await Product.findById({ _id: items.productId });
    findindb.totalSold += items.qty;
    const updateItem = await findindb.save();
  });

  // 06. MAKE THE PAYMENT (STRIPE)

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: orderedItems.name,
            description: orderedItems.description,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: orderedItems.qty,
      },
    ],
    metaData: {
      orderId: order._id,
    },

    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });

  if (!session) {
    throw new Error("issue in payment ");
  }

  // 07.PAYMENT WEBHOOK.

  //08.UPDATE THE USER ORDER

  res.json({
    success: true,
    message: "order created",
    order,
    user,
  });
});

//02 . FETCH ORDERS
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json({
    success: true,
    message: "all orders",
    orders,
  });
});

//03 . FETCH SINGLE ORDERS
exports.getsingleOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json({
    success: true,
    message: "all orders",
    order,
  });
});

//04 . UPDATE THE ORDER
exports.updateorder = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: " order updated",
    updatedOrder,
  });
});

exports.getdaysale = asyncHandler(async (req, res) => {
  // GET MINIMUN ORDER
  const getminorder = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimunSale: {
          $min: "$totalPrice",
        },
        maximunsale: {
          $max: "$totalPrice",
        },
        averageSale: {
          $avg: "$totalPrice",
        },
        totalSale: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  // GET ONE DAY SALE
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todaysales = await Order.aggregate([
    {
      $match: {
        _id: null,
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        todaySales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  res.json({
    msg: "total order cost",
    getminorder,
    todaysales,
  });
});

const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const Stripe = require("stripe");

// Routes
const userRoute = require("./routes/user");
const productRoute = require("./routes/products");
const categoriesRoute = require("./routes/category");
const brandRoute = require("./routes/brand");
const colorRoute = require("./routes/color");
const reviewRoute = require("./routes/review");
const orderRoute = require("./routes/Order");
const couponRoute = require("./routes/coupon");

// Route imports
const api = process.env.API;

const app = express();
app.use(express.json());
env.config();

// STRIPE WEBHOOK
const stripe = new Stripe(
  "sk_test_51NIlEASHhQE3ZPyATiaCmsIdVF8XOJhGmdUUehnhjOy7kAQNEuLXE1z98l9afIwbtK5c297RhO1RizKzkVOoAXfk00BS7Er9pf"
);
const endpointSecret =
  "whsec_2a222b6d6b7abb9982f25d1da9e63f4d0a78f6935259e4ff65cae8df7b5fdde5";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );
      console.log(order);
    } else {
      return;
    }
    // // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntent = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
//Routes
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/category", categoriesRoute);
app.use("/brand", brandRoute);
app.use("/color", colorRoute);
app.use("/review", reviewRoute);
app.use("/order", orderRoute);
app.use("/coupon", couponRoute);

//Error handllers
app.use(globalErrorHandler.globalErrorHandler);
app.use(globalErrorHandler.notFound);

// connect to db
mongoose
  .connect(process.env.MONGO_URL)
  .then((result) => {
    app.listen(3000);
    console.log("db connected & server started");
  })
  .catch((err) => {
    console.log(err);
  });

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    WishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WishList",
      },
    ],
    IsAdmin: {
      type: Boolean,
      default: false,
    },
    HasShippingAddress: {
      type: Boolean,
      default: false,
    },
    ShippingAddress: {
      FirstName: {
        type: String,
      },
      LastName: {
        type: String,
      },
      Address: {
        type: String,
      },
      City: {
        type: String,
      },
      PostalCode: {
        type: String,
      },
      Province: {
        type: String,
      },
      Country: {
        type: String,
      },
      Phone: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// complie the schema to modal
module.exports = mongoose.model("User", UserSchema);

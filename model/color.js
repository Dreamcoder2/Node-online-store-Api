//Color schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // products: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Color", ColorSchema);

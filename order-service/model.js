const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: { type: String },
  productId: { type: String },
  quantity: { type: Number },
  status: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("order", schema);

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  orderId: { type: String },
  amount: { type: Number },
  status: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("payment", schema);

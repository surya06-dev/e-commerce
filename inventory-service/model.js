const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  productId: { type: String },
  stock: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("inventory", schema);

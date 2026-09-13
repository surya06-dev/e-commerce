const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("product", schema);

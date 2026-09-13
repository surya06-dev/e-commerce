const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  message: { type: String },
  type: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("notification", schema);

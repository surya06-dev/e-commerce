const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("user", schema);

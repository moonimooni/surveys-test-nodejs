const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Choice = new Schema({
  value: {
    type: String,
    required: true,
  },
  readOnly: {
    type: Boolean,
    required: true,
    default: false,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Choice", Choice);

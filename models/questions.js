const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Question = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: String,
  description: {
    type: String,
    required: true,
  },
  isRequired: {
    type: Boolean,
    required: true,
  },
  typeName: {
    type: String,
    required: true,
  },
  multipleChoicesOption: {
    allowed: {
      type: Boolean,
      required: true,
    },
    requireMin: Number,
    requireMax: Number,
  },
  choices: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Question", Question);

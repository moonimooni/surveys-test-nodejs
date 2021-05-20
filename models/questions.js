const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Question = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: String,
  description: String,
  isRequired: {
    type: Boolean,
    required: true,
  },
  typeName: {
    type: String,
    required: true,
  },
  multipleSelectOption: {
    allowed: {
      type: Boolean,
      required: true,
    },
    requiredMin: Number,
    requiredMax: Number,
  },
  choices: {
    type: Array,
    required: true,
  },
  labels: Schema.Types.Mixed,
});

module.exports = mongoose.model("Question", Question);

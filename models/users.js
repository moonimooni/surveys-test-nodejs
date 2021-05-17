const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  userKey: {
    type: String,
    required: true,
  },
  surveyId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  choiceId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Choice",
      required: true,
    },
  ],
  votedAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

module.exports = mongoose.model("User", User);

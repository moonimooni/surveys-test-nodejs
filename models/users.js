const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  userKey: {
    type: String,
    required: true,
  },
  createdSurvey: [{
    surveyId: {
      type: Schema.Types.ObjectId,
      ref: "Survey",
    },
    createdAt: {
      type: Date,
      ref: "Survey.createdAt",
    },
  }],
  votedHistory: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    choiceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Choice",
      },
    ],
    votedAt: {
      type: Date,
      default: Date.now(),
    },
  }],
});

module.exports = mongoose.model("User", User);

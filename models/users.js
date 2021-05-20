const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  userKey: {
    type: String,
    required: true,
    index: true,
  },
  createdSurvey: [
    {
      surveyId: {
        type: Schema.Types.ObjectId,
        ref: "Survey",
      },
      createdAt: {
        type: Date,
        ref: "Survey.createdAt",
      },
    },
  ],
  votedHistory: [
    {
      surveyId: {
        type: Schema.Types.ObjectId,
        ref: "Survey",
      },
      responses: Array,
      votedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

module.exports = mongoose.model("User", User);

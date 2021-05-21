const User = require("../../models/users");

exports.insertCreatorInfo = (resolveValue, creatorKey) => {
  return User.findOne({ userKey: creatorKey })
    .exec()
    .then((user) => {
      if (!user) {
        return User.create({
          userKey: creatorKey,
          createdSurvey: [
            {
              surveyId: resolveValue._id,
              createdAt: resolveValue.createdAt,
            },
          ],
        });
      }
      user.createdSurvey.push({
        surveyId: resolveValue._id,
        createdAt: resolveValue.createdAt,
      });
      return user.save();
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error);
    });
};

exports.insertVoterInfo = async (res, voterKey, surveyId, answerObjs) => {
  if (await User.exists({ userKey: voterKey })) {
    const user = await User.findOne({ userKey: voterKey }).exec();
    const voted = user.votedHistory.filter((history) => {
      return String(history.surveyId) === surveyId;
    });
    if (voted.length)
      return res.status(400).json({ MESSAGE: "user already voted" });
    else {
      user.votedHistory.push({
        surveyId: surveyId,
        responses: answerObjs,
      });
      user.save();
    }
    // TODO
  } else {
    await User.create({
      userKey: voterKey,
      votedHistory: [
        {
          surveyId: surveyId,
          responses: answerObjs,
        },
      ],
    });
  }
};

exports.insertCreatorInfo = (UserModel, resolveValue, creatorKey) => {
  return UserModel.findOne({ userKey: creatorKey })
    .exec()
    .then((user) => {
      if (!user) {
        return UserModel.create({
          userKey: creatorKey,
          createdSurvey: [{
            surveyId: resolveValue._id,
            createdAt: resolveValue.createdAt,
          }],
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

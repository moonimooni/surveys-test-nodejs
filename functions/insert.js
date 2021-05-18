const { makeChoiceObj } = require("./createModelObjs");

exports.insertManyChoices = (question, ChoiceModel, objectsArray = []) => {
  if (question.type === "rating") {
    const rateStep = question.rateStep;
    let { maxRate, minRate } = question;

    let indexCount = 0;

    while (minRate <= maxRate) {
      objectsArray.push(makeChoiceObj(minRate, indexCount));
      minRate += rateStep;
      indexCount ++;
    }
  } else {
    objectsArray = question.choices.reduce(
      (acc, choice) => acc.concat([makeChoiceObj(choice.text)]),
      objectsArray
    );
  }
  return ChoiceModel.insertMany(objectsArray);
};

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

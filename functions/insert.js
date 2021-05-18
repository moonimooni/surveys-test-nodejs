const { makeChoiceObj } = require("./createModelObjs");

exports.insertManyChoices = (question, ChoiceModel, objectsArray = []) => {
  if (question.type === "rating") {
    const rateStep = question.rateStep;

    let minValue = question.rateMin.value;
    let maxValue = question.rateMax.value;

    while (minValue <= maxValue) {
      if (minValue === question.rateMin.value) {
        objectsArray.push(makeChoiceObj(minValue, question.rateMin.text));
      } else if (minValue === question.rateMax.value) {
        objectsArray.push(makeChoiceObj(minValue, question.rateMax.text));
      } else {
        objectsArray.push(makeChoiceObj(minValue));
      }
      minValue += rateStep;
    }
  } else {
    objectsArray = question.choices.reduce(
      (acc, choice) => acc.concat([makeChoiceObj(choice.text)]),
      objectsArray
    );
  }

  return ChoiceModel.insertMany(objectsArray);
};

exports.insertUserSurveyCreationHistory = (
  UserModel,
  resolveValue,
  creatorKey
) => {
  UserModel.findOne({ userKey: creatorKey })
    .exec()
    .then((user) => {
      if (!user) {
        return UserModel.create({
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
      throw new Error(error);
    });
};

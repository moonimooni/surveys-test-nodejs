const { makeChoiceObj } = require("./createModelObjs");
const { NetworkManager } = require("aws-sdk");

exports.insertManyChoices = (question, ChoiceModel, objectsArray, res) => {
  if (question.type === "rating") {
    const rateStep = question.rateStep;

    const minValue = question.rateMin.value;
    const maxValue = question.rateMax.value;

    const minText = question.rateMin.text;
    const maxText = question.rateMax.text;

    objectsArray = objectsArray.concat([
      makeChoiceObj(minText),
      makeChoiceObj(maxText),
    ]);

    let value = minValue;

    while (value <= maxValue) {
      objectsArray.push(makeChoiceObj(value));
      value += rateStep;
    }
  } else {
    objectsArray = question.choices.reduce(
      (acc, choice) => acc.concat([makeChoiceObj(choice.text)]),
      objectsArray
    );
  };
  
  return ChoiceModel.insertMany(objectsArray);
};

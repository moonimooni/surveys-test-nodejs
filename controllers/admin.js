const Survey = require("../models/surveys");
const Question = require("../models/questions");
const Choice = require("../models/choices");

const multipleChoicesForTypes = {
  checkbox: true,
  rating: false,
};

exports.createSurvey = (req, res, next) => {
  const creatorKey = "XXXXXXXXXXXXXX";
  const pages = req.body.pages;

  pages.forEach((page) => {
    const questions = page.questions;
    const questionObjs = [];

    questions.forEach((question) => {
      let choiceObjs;

      if (question.type === "rating") {
        const rateStep = question.rateStep;

        const minValue = question.rateMin.value;
        const maxValue = question.rateMax.value;

        const minText = question.rateMin.text;
        const maxText = question.rateMax.text;

        const makeChoiceObj = (value) => {
          return new Choice({
            value: value,
            readOnly: true,
          });
        };

        choiceObjs = [makeChoiceObj(minText), makeChoiceObj(maxText)];

        let value = minValue;

        while (value <= maxValue) {
          choiceObjs.push(makeChoiceObj(value));
          value++;
        }
      } else {
        queston.choices.reduce((acc, val) =>
          acc.concat([makeChocieObj(val.text)]), []
        );
      };

      Choice.insertMany(choiceObjs)
        .then((result) => {
          console.log("result: ", result);
        })
        .catch((error) => {
          res.status(400).json({ ERROR: error });
        });

      const { title, description, type, isRequired } = question;
      let multipleOption;

      if (
        multipleChoicesForTypes[type] &&
        question["multipleChoicesOptions"]["allowed"]
      ) {
        const { requireMin, requireMax } = question["multipleChoicesOptions"];
        multipleOption = {
          allowed: true,
          requireMin: requireMin,
          requireMax: requireMax,
        };
      } else {
        multipleOption = { allowed: false };
      }

      const questionObj = new Question({
        title: title,
        description: description,
        typeName: type,
        isRequired: isRequired,
        multipleChoicesOption: multipleOption,
      });

      questionObjs.push(questionObj);
    });
  });

  Question.insertMany(questionObjs)
    .then((result) => {
      console.log("result: ", result);
      return res.status(201).json({ MESSAGE: "SUCCESS" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ ERROR: error });
    });
};

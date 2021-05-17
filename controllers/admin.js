const Survey = require("../models/surveys");
const Question = require("../models/questions");
const Choice = require("../models/choices");
const User = require("../models/users");

const { insertManyChoices } = require("../functions/insertMany");

const multipleChoicesForTypes = {
  checkbox: true,
  rating: false,
};

exports.createSurvey = (req, res, next) => {
  const { creatorKey, hasExpiry, closeAt, showResult } = req.body;
  const pages = req.body.pages;

  pages.forEach((page) => {
    const questions = page.questions;

    const questionObjs = [];

    questions.forEach((question, idx) => {
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

      insertManyChoices(question, Choice, [], res)
        .then((result) => {
          questionObjs.push(
            new Question({
              title: title,
              description: description,
              typeName: type,
              isRequired: isRequired,
              multipleChoicesOption: multipleOption,
              choices: result,
            })
          );
          if (idx === questions.length - 1) {
            Question.insertMany(questionObjs)
              .then((result) => {
                Survey.create({
                  creatorKey: creatorKey,
                  hasExpiry: haxExpiry,
                  showResult: showResult,
                  questions: result,
                });
              })
              .then(() => {
                return res.status(201).json({ MESSAGE: "SUCCESS" });
              })
              .catch((error) => {
                return res.status(400).json({ ERROR: error });
              });
          }
        })
        .catch((error) => {
          return status(400).json({ ERROR: error });
        });
    });
  });
};

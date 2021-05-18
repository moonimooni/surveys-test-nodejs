const Survey = require("../models/surveys");
const Question = require("../models/questions");
const Choice = require("../models/choices");
const User = require("../models/users");

const {
  insertManyChoices,
  insertUserSurveyCreationHistory,
} = require("../functions/insert");

const multipleChoicesAvailableTypes = {
  checkbox: true,
  rating: false,
};

exports.createSurvey = (req, res, next) => {
  // const creatorKey = req.user;
  const creatorKey = "XXXXX";
  const { hasExpiry, closeAt, showResult } = req.body;
  const pages = req.body.pages;

  pages.forEach((page, pagesIdx) => {
    const pageTitle = page.title;
    const pageDescription = page.description;
    const questions = page.questions;

    const questionObjs = [];
    const pageObjs = [];

    questions.forEach((question, questionsIdx) => {
      const { title, description, type, isRequired } = question;
      let multipleOption;

      if (
        multipleChoicesAvailableTypes[type] &&
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

      insertManyChoices(question, Choice)
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

          if (questionsIdx === questions.length - 1) {
            Question.insertMany(questionObjs)
              .then((result) => {
                pageObjs.push({
                  title: pageTitle,
                  description: pageDescription,
                  questions: result,
                });
              })
              .then(() => {
                if (pagesIdx === pages.length - 1) {
                  return Survey.create({
                    creatorKey: creatorKey,
                    hasExpiry: hasExpiry,
                    showResult: showResult,
                    // closeAt: //TODO,
                    pages: pageObjs,
                  });
                }
              })
              .then((result) => {
                if (result) {
                  return insertUserSurveyCreationHistory(
                    User,
                    result,
                    creatorKey
                  );
                }
              })
              .then((result) => {
                return res.status(201).json({ MESSAGE: "SUCCESS" });
              })
              .catch((error) => {
                console.log(error);
                return res.status(400).json({ ERROR: error });
              });
          }
        })
        .catch((error) => {
          console.log(error);
          return status(400).json({ ERROR: error });
        });
    });
  });
};

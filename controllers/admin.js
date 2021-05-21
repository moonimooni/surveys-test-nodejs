const Survey = require("../models/surveys");
const Question = require("../models/questions");
const User = require("../models/users");

const { connectToDatabase } = require("../utils/database");

const { insertCreatorInfo } = require("../functions/insert");
const { modifyRatingChoices } = require("../functions/modifyByQuestionType");

exports.createSurvey = (req, res, next) => {
  return connectToDatabase().then(() => {
    // const creatorKey = req.user;
    const creatorKey = "XXXXX";
    const { hasExpiry, closeAt, showResult } = req.body;
    const pages = req.body.pages;

    pages.forEach((page, pagesIdx) => {
      const pageTitle = page.title;
      const pageDescription = page.description;
      const questions = page.questions;

      const pageObjs = [];

      questions.map((question) => {
        if (question.type === "rating") {
          question = modifyRatingChoices(question);
        };
        return new Question({
          title: question.title,
          description: question.description,
          typeName: question.type,
          isRequired: question.isRequired,
          multipleSelectOption: question.multipleSelectOption,
          choices: question.choices,
          labels: question.labels,          
        });
      });

      Question.insertMany(questions)
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
              // closeAt: TODO,
              pages: pageObjs,
            });
          }
        })
        .then((survey) => {
          return insertCreatorInfo(User, survey, creatorKey);
        })
        .then(() => {
          return res.status(201).json({ MESSAGE: "SUCCESS" });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({ ERROR: error });
        });
    });
  });
};
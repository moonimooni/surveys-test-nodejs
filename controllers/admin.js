const Survey = require("../models/surveys");
const Question = require("../models/questions");
const Choice = require("../models/choices");
const User = require("../models/users");

const { connectToDatabase } = require("../utils/database");

const {
  insertManyChoices,
  insertCreatorInfo,
} = require("../functions/insert");

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

      const questionObjs = [];
      const pageObjs = [];

      questions.forEach((question, questionsIdx) => {
        insertManyChoices(question, Choice)
          .then((result) => {
            questionObjs.push(
              new Question({
                title: question.title,
                description: question.description,
                typeName: question.type,
                isRequired: question.isRequired,
                multipleSelectOption: question.multipleSelectOption,
                choices: result,
                labels: question.labels,
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
                      // closeAt: TODO,
                      pages: pageObjs,
                    });
                  }
                })
                .then((result) => {
                  return insertCreatorInfo(User, result, creatorKey);
                })
                .then(() => {
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
  });
};

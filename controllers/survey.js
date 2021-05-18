const Survey = require("../models/surveys");
const Question = require("../models/questions");
const Choice = require("../models/choices");
const User = require("../models/users");

const { connectToDatabase } = require("../utils/database");

exports.getSurvey = (req, res, next) => {
  connectToDatabase().then(() => {
    const surveyId = req.params.surveyId;

    Survey.findById(surveyId)
      .then((survey) => {
        if (!survey) {
          return res.status(404).json({ MESSAGE: "SURVEY NOT FOUND" });
        }
        survey.pages.forEach((page, pageIdx) => {
          page.questions.map((questionId, questionIdx) => {
            return Question.findById(questionId)
              .then((question) => {
                console.log("question : ", question);
                return question;
              })
              .then((question) => {
                page.questions[questionIdx] = question;
                if (questionIdx === page.questions.length - 1) {
                  return page;
                }
              })
              .then((modifiedPage) => {
                survey.pages[pageIdx] = modifiedPage;
                if (
                  pageIdx === survey.pages.length - 1 &&
                  questionIdx === page.questions.length - 1
                ) {
                  return res.status(200).json({ survey: survey });
                }
              })
              .catch((error) => {
                console.log(error);
                return res.status(400).json({ ERROR: error });
              });
          });
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json({ ERROR: error });
      });
  });
};

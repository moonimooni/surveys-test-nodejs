const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const Question = require("../models/questions");
const User = require("../models/users");

const { connectToDatabase } = require("../utils/database");
const { insertVoterInfo } = require("../functions/insert");

exports.voteSurvey = async (req, res, next) => {
  await connectToDatabase();
  const surveyId = req.params.surveyId;
  const { answers } = req.body;
  // const voterKey = req.user;
  const voterKey = "fffffffffff";
  const survey = await Survey.findById(surveyId)
    .populate("pages.questions")
    .exec();

  let mustQuestionsAll = [];

  survey.pages.forEach((page) => {
    page.questions.forEach((question) => {
      if (question.isRequired) {
        mustQuestionsAll.push(String(question._id));
      }
    });
  });

  const answeredQuestions = answers.map((answer) => answer.question);

  const missedQuestion = mustQuestionsAll.filter((question) => {
    return !answeredQuestions.includes(question);
  });

  if (missedQuestion.length) {
    return res
      .status(400)
      .json({ MESSAGE: "some neccessary questions missing." });
  }

  const answerObjs = answers.map((answer) => {
    const answerObj = {};
    answerObj["question"] = mongoose.Types.ObjectId(answer.question);
    answerObj["choices"] = answer.choices.map((choice) =>
      mongoose.Types.ObjectId(choice)
    );
    return answerObj;
  });

  await insertVoterInfo(res, voterKey, surveyId, answerObjs);

  for await (let answer of answers) {
    const question = await Question.findById(answer.question).exec();
    question.choices.map((choice) => {
      const choiceId = String(choice._id);
      if (answer.choices.includes(choiceId)) {
        choice.count++;
      }
      return choice;
    });
    question.save();
  }
  return res.status(201).json({ MESSAGE: "SUCCESS" });
};

exports.getSurvey = async (req, res, next) => {
  await connectToDatabase();
  const surveyId = req.params.surveyId;
  const userKey = "FPFPFPFPFPFP"; // const userKey = req.user;
  const survey = await Survey.findById(surveyId).exec();
  if (!survey) {
    return res.status(404).json({ MESSAGE: "SURVEY NOT FOUND" });
  }

  const user = await User.findOne({ userKey: userKey }).exec();

  if (user) {
    const votedHistory = user.votedHistory.filter((history) => {
      return history.surveyId === surveyId;
    });
    if (votedHistory) {
      return res.status(302).json({ MESSAGE: "ALREADY VOTED" });
    }
  }

  survey.pages.forEach((page, pageIdx) => {
    page.questions.map((questionId, questionIdx) => {
      return Question.findById(questionId)
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
};

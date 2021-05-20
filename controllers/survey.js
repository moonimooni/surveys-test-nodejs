const Survey = require("../models/surveys");
const Question = require("../models/questions");
const Choice = require("../models/choices");
const User = require("../models/users");

const { connectToDatabase } = require("../utils/database");

exports.voteSurvey = async (req, res, next) => {
  console.log("9번 줄");
  await connectToDatabase();
  console.log("11번 줄");
  const surveyId = req.params.surveyId;
  const answers = req.body;
  // const voterKey = req.user;
  const voterKey = "fffffffffff";

  const findSurvey = async () => {
    return Survey.findById(surveyId);
  };
  const mustVoteQuestions = [];

  survey.pages.forEach((page) => {
    page.questions.forEach(question => {
      const questionInfo = await Question.findById(question);
      if (questionInfo.isRequired) {
        mustVoteQuestions.push(question);
      }
    });
  });

  const answeredQuestions = answers.map((answer) => answer.questionId);

  const missedQuestion = mustVoteQuestions.filter((question) => {
    return !answeredQuestions.includes(question)
  });
  if (missedQuestion) {
    return res.status(400).json({MESSAGE: "some neccessary questions missed."})
  }

  if (await User.exists({ userKey: voterKey })) {
    const user = await User.findOne({ userKey: voterKey }).exec();
    if (!user) {
      await User.create({
        userKey: voterKey,
        votedHistory: [{
          surveyId: surveyId,
          answers: [answers]
        }]
      });
    }
  }
  answers.forEach((answer) => {
    answer.choiceIds.forEach((choiceId) => {
      await Choice.findByIdAndUpdate(choiceId, {$inc: {count: 1}});
    });
  });

  return res.status(201).json({ MESSAGE: "SUCCESS" });
};

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

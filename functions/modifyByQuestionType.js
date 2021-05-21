exports.modifyRatingChoices = (question) => {
  const modifiedChoices = [];
  let { rateStep, minRate, maxRate } = question;
  while (minRate <= maxRate) {
    modifiedChoices.push({ value: minRate });
    minRate += rateStep;
  }
  question.choices = modifiedChoices;
  return question;
};

const Choice = require("../models/choices");

exports.makeChoiceObj = (value) => {
  return new Choice({
    value: value,
    readOnly: true,
  });
};

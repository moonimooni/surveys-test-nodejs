const Choice = require("../models/choices");

exports.makeChoiceObj = (value, index = null) => {
  return new Choice({
    value: value,
    index: index,
  });
};

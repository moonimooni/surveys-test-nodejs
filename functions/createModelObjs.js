const Choice = require("../models/choices");

exports.makeChoiceObj = (value, subValue = null) => {
  return new Choice({
    value: value,
    subValue: subValue,
  });
};

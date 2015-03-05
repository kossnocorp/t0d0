var subDays = require('date-fns/src/sub_days');
var subMonths = require('date-fns/src/sub_months');

var isWithinRange = require('date-fns/src/is_within_range');
var parseDate = require('date-fns/src/parse');

var dateAgoToken = /ago$/;
var dateAgoDelimeterToken = /[ .]+/;
var daysUnitToken = /(days?|d)/;
var weeksUnitToken = /(weeks?|w)/;
var monthsUnitToken = /(months?|m)/;
var yearsUnitToken = /(years?|y)/;

var parseDateOption = function(dateStr, today) {
  today = today || new Date();
  if (dateAgoToken.test(dateStr)) {
    var dateArray = dateStr.split(dateAgoDelimeterToken);
    var numericValue = parseFloat(dateArray[0]);
    var unit = dateArray[1];

    if (daysUnitToken.test(unit)) {
      return subDays(today, numericValue);
    } else if (weeksUnitToken.test(unit)) {
      return subDays(today, numericValue * 7);
    } else if (monthsUnitToken.test(unit)) {
      return subMonths(today, numericValue);
    } else if (yearsUnitToken.test(unit)) {
      return subMonths(today, numericValue * 12);
    } else {
      return parseDate(dateStr);
    }
  } else {
    return parseDate(dateStr);
  }
};

var isReviewedRecently = function(todo, options) {
  if (!todo.isReviewed) {
    return false;
  }
  var today = new Date();
  var sinceDate = options.since ? parseDateOption(options.since, today) : subDays(today, options.days || 14);
  var untilDate = options.until ? parseDateOption(options.until, today) : today;
  return isWithinRange(todo.reviewedAt, sinceDate, untilDate);
};

module.exports = isReviewedRecently;

var subDays = require('date-fns/src/sub_days');
var isBefore = require('date-fns/src/is_before');

var countTodos = function(fullMap, options) {
  var today = new Date();
  var reviewedBoundary = subDays(today, options.days || 14);
  var stats = {};

  stats.all = 0;
  stats.reviewed = 0;
  stats.reviewedObsolete = 0;
  stats.files = {};
  stats.tags = {};

  for (var filename in fullMap) {
    var todos = fullMap[filename];
    var fileStats = {
      all: todos.length,
      reviewed: todos.filter(function(todo) {
        return todo.isReviewed && isBefore(reviewedBoundary, todo.reviewedAt);
      }).length,
      reviewedObsolete: todos.filter(function(todo) {
        return todo.isReviewed && !isBefore(reviewedBoundary, todo.reviewedAt);
      }).length
    }

    fullMap[filename].forEach(function(todo) {
      todo.tags && todo.tags.forEach(function(tag) {
        var tagStat = stats.tags[tag];
        stats.tags[tag] = tagStat ? tagStat + 1 : 1;
      });
    });

    stats.all += fileStats.all;
    stats.reviewed += fileStats.reviewed;
    stats.reviewedObsolete += fileStats.reviewedObsolete;
    stats.files[filename] = fileStats;
  }

  return stats;
}

module.exports = countTodos;

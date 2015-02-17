var isReviewedRecentlyWithOptions = require('./is_reviewed_recently');

var countTodos = function(fullMap, options) {
  var today = new Date();
  var stats = {};

  var isReviewedRecently = function(todo) {
    return isReviewedRecentlyWithOptions(todo, options);
  };

  var isReviewedObsolete = function(todo) {
    return todo.isReviewed && !isReviewedRecentlyWithOptions(todo, options);
  };

  stats.all = 0;
  stats.reviewed = 0;
  stats.reviewedObsolete = 0;
  stats.files = {};
  stats.tags = {};

  for (var filename in fullMap) {
    var todos = fullMap[filename];
    var fileStats = {
      all: todos.length,
      reviewed: todos.filter(isReviewedRecently).length,
      reviewedObsolete: todos.filter(isReviewedObsolete).length
    };

    fullMap[filename].forEach(function(todo) {
      if (todo.tags) {
        todo.tags.forEach(function(tag) {
          var tagStat = stats.tags[tag];
          stats.tags[tag] = tagStat ? tagStat + 1 : 1;
        });
      }
    });

    stats.all += fileStats.all;
    stats.reviewed += fileStats.reviewed;
    stats.reviewedObsolete += fileStats.reviewedObsolete;
    stats.files[filename] = fileStats;
  }

  return stats;
};

module.exports = countTodos;

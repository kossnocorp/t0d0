var countTodos = function(fullMap, options) {
  var stats = {};
  stats.all = 0;
  stats.reviewed = 0;
  stats.files = {};

  for (var filename in fullMap) {
    var todos = fullMap[filename];
    var fileStats = {
      all: todos.length,
      reviewed: todos.filter(function(todo) {
        return todo.isReviewed;
      }).length
    }

    stats.all += fileStats.all;
    stats.reviewed += fileStats.reviewed;
    stats.files[filename] = fileStats;
  }

  return stats;
}

module.exports = countTodos;

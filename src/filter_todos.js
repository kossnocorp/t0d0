var isReviewedRecently = require('./is_reviewed_recently');

var filterTodos = function(fullMap, options, callback) {
  var today = new Date();
  if (options.all) {
    callback(fullMap);
    return;
  }

  var filterTodo = function(todo) {
    if (options.reviewed) {
      if (!todo.isReviewed) {
        // Ignore unreviewed
        return;
      }
    } else if (options.tagged) {
      if (todo.tags.length == 0) {
        // Ignore untagged
        return;
      }
    } else if (options.untagged) {
      if (todo.tags.length > 0) {
        // Ignore tagged
        return;
      }
    } else if (options.tag) {
      if (todo.tags.indexOf(options.tag.replace('#', '')) == -1) {
        // Ignore TODOs if it doesn't contain specific tag
        return;
      }
    } else if (isReviewedRecently(todo, options)) {
      // Ignore reviewed recently
      return;
    }

    map[filename] = map[filename] || [];
    map[filename].push(todo);
  };


  var map = {};
  for (var filename in fullMap) {
    var todos = fullMap[filename];
    todos.forEach(filterTodo);
  }

  callback(map);
};

module.exports = filterTodos;

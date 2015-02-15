var subDays = require('date-fns/src/sub_days');
var isBefore = require('date-fns/src/is_before');

var filterTodos = function(fullMap, options, cb) {
  var today = new Date();
  if (options.all) {
    cb(fullMap);
    return;
  }

  var map = {};
  for (var filename in fullMap) {
    var todos = fullMap[filename];
    todos.forEach(function(todo) {
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
      } else if (todo.isReviewed) {
        if (isBefore(subDays(today, options.days || 14), todo.reviewedAt)) {
          // Ignore reviewed recently
          return;
        }
      }

      map[filename] = map[filename] || [];
      map[filename].push(todo);
    });
  }

  cb(map);
};

module.exports = filterTodos;

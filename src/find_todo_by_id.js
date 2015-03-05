var findTodoByID = function(fullMap, id, options, callback) {
  var result = [];

  var findMatchingTodos = function(searchResults, todo) {
    if (todo.id.indexOf(id) == 0) {
      searchResults.push(todo);
    }

    return searchResults;
  };

  for (var filename in fullMap) {
    result = result.concat(fullMap[filename].reduce(findMatchingTodos, []));
  }

  if (result.length > 1) {
    var err = new Error('Short SHA1 ' + id + ' is ambiguous');
    callback(err);
  } else if (result.length == 0) {
    var err = new Error('TODO ' + id + ' not found');
    callback(err);
  } else {
    callback(null, result[0]);
  }
};

module.exports = findTodoByID;

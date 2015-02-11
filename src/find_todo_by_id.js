var findTodoByID = function(fullMap, id, options) {
  var result;
  for (var filename in fullMap) {
    fullMap[filename].some(function(todo) {
      if (todo.id.indexOf(id) == 0) {
        result = todo;
        return true;
      } else {
        return false;
      }
    });

    if (result) {
      return result;
    }
  }
}

module.exports = findTodoByID;

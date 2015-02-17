var findTodoByID = function(fullMap, id, options) {
  var result;

  var checkID = function(todo) {
    if (todo.id.indexOf(id) == 0) {
      result = todo;
      return true;
    } else {
      return false;
    }
  };

  for (var filename in fullMap) {
    fullMap[filename].some(checkID);

    if (result) {
      return result;
    }
  }
};

module.exports = findTodoByID;

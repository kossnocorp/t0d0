var childProcess = require('child_process');

var runEditor = function(todo, option) {
  var vimPrc = childProcess.spawn('vim', [todo.filename, '+' + todo.lineNumber], {stdio: 'inherit'});
}

module.exports = runEditor;

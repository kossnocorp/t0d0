var childProcess = require('child_process');

var runEditor = function(todo, option, callback) {
  var vimPrc = childProcess.spawn('vim', [todo.filename, '+' + todo.lineNumber], {stdio: 'inherit'});
  vimPrc.on('close', function(code) {
    callback(code);
  });
}

module.exports = runEditor;

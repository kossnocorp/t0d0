var childProcess = require('child_process');

var runEditor = function(todo, option, cb) {
  var vimPrc = childProcess.spawn('vim', [todo.filename, '+' + todo.lineNumber], {stdio: 'inherit'});
  vimPrc.on('close', function(code) {
    cb(code);
  });
}

module.exports = runEditor;

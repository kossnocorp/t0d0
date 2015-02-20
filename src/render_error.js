var chalk = require('chalk');

var renderError = function(err) {
  console.log('  ' + chalk.red('error: ') + err.message);
}

module.exports = renderError;

var _ = require('underscore');
var chalk = require('chalk');
var fs = require('fs');
var util = require('util');

var sprintf = require('sprintf-js').sprintf;

var config = require('../config');
var core = require('../core');
var h = require('../helper');

var cmd = {
  command: 'show <keyword>',
  desc:    'show problem by name or index',
  builder: {
    gen: {
      alias:    'g',
      type:     'boolean',
      describe: 'Generate source file from template'
    },
    lang: {
      alias:    'l',
      type:     'string',
      default:  config.LANG,
      describe: 'Program language to use'
    }
  }
};

cmd.handler = function(argv) {
  core.getProblem(argv.keyword, function(e, problem) {
    if (e) return console.log('ERROR:', e);

    var msg = '';
    if (argv.gen) {
      var template = _.find(problem.templates, function(x) {
        return x.value === argv.lang;
      });
      if (!template)
        return console.log('Failed to generate source file: ' +
            'unknown language ' + argv.lang);

      var f = problem.key + h.langToExt(argv.lang);
      fs.writeFileSync(f, template.defaultCode);
      msg = sprintf('(File: %s)', chalk.yellow.underline(f));
    }

    console.log(sprintf('[%d] %s\t%s\n', problem.id, problem.name, msg));
    console.log(sprintf('%s\n', chalk.underline(problem.link)));
    console.log(sprintf('* %s (%.2f%%)', problem.level, problem.percent));
    console.log(sprintf('* Total Accepted:    %d', problem.totalAC));
    console.log(sprintf('* Total Submissions: %d', problem.totalSubmit));
    if (problem.testable && problem.testcase) {
      console.log(sprintf('* Testcase Example:  %s',
            chalk.yellow(util.inspect(problem.testcase))));
    }
    console.log();
    console.log(problem.desc);
  });
};

module.exports = cmd;

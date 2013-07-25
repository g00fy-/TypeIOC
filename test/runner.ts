/// <reference path="../lib/t.d.ts/node/node.d.ts" />

var reporter = null;


try {
    reporter = require('nodeunit').reporters.default;
}
catch(e) {
    console.log("Cannot find nodeunit module.");
    process.exit();
}

process.chdir(__dirname);
reporter.run(['level1.js',
    'level2.js',
    'level3.js',
    'level4.js',
    'level5.js',
    'level6.js',
    'level7.js',
    'level8.js']);
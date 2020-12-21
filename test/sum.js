const fs = require('fs-extra');
function sum(a, b) {
    return a + b;
}

const path= '/Users/vinsea/code/source code/extra-jsfile-webpack-plugin/aaaaaaa/test.js'
fs.ensureFile(path)

module.exports = sum;
  
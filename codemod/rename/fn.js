const path = require('path');
const fs = require('fs-extra');
const j = require('jscodeshift');

const { renameName } = require('../utils/fn');

const input = path.join(__dirname, '../../dist/output/rst.js');
// const input = path.join(__dirname, '../../demo/fn.js');
const output = path.join(__dirname, '../../dist/output/fn.js');

const code = fs.readFileSync(input, {
  encoding : 'utf8',
});

const root = j(code)
  .find(j.FunctionDeclaration)
  .forEach(p => {
    // 函数重命名
    renameName(p);
  });

// console.log(root.toSource());
// fs.outputFileSync(path.join(__dirname, '../../dist/demo/fn.js'), root.toSource());
fs.outputFileSync(output, root.toSource());

/*
 * rename：对参数进行重命名，理论上在rename/fn之后，因为为了明确区分参数，会在参数名中添加函数名作为前缀
 */
const path = require('path');
const fs = require('fs-extra');
const j = require('jscodeshift');

const { renameParams } = require('../utils/fn');

// const input = path.join(__dirname, '../../dist/output/var.js');
const input = path.join(__dirname, '../../dist/output/rst.js');
// const input = path.join(__dirname, '../../demo/args.js');
const output = path.join(__dirname, '../../dist/output/args.js');

const code = fs.readFileSync(input, {
  encoding : 'utf8',
});

const root = j(code)
  .find(j.Function)
  .forEach(p => {
    // 参数重命名
    renameParams(p);
  });

// console.log(root.toSource());
// fs.outputFileSync(path.join(__dirname, '../../dist/demo/args.js'), root.toSource());
fs.outputFileSync(output, root.toSource());

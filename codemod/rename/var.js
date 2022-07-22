/*
 * rename：对一般的变量声明进行重命名
 */
const path = require('path');
const fs = require('fs-extra');
const j = require('jscodeshift');

const { getDecName } = require('../utils/name');

const input = path.join(__dirname, '../../dist/output/fn.js');
const output = path.join(__dirname, '../../dist/output/var.js');

const code = fs.readFileSync(input, {
  encoding : 'utf8',
});

const reg = /^[A-Za-z$_]{1,2}$/;

// let count = 0;
const root = j(code)
  .find(j.VariableDeclarator)
  .filter(p => reg.test(p.get('id').getValueProperty('name')))
  .forEach(p => {
    // 变量重命名
    // renameId(p);
    // console.log(count);
    j(p).renameTo(getDecName(p));
    // count++;
  });

fs.outputFileSync(output, root.toSource());

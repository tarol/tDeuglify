/*
 * detransform：讲return语句的逗号表达式进行拆分
 */
const path = require('path');
const fs = require('fs-extra');
const j = require('jscodeshift');

const input = path.join(__dirname, '../../dist/output/rst.js');
// const input = path.join(__dirname, '../../demo/ret.js');
const output = path.join(__dirname, '../../dist/output/ret.js');

const code = fs.readFileSync(input, {
  encoding : 'utf8',
});

const root = j(code)
  .find(j.Function)
  .find(j.ReturnStatement)
  .forEach(p => {
    let bodyPath = p.get('argument');

    if (bodyPath.getValueProperty('type') === 'SequenceExpression') {
      if (p.name === 'consequent' && p.parent.getValueProperty('type') === 'IfStatement') {
        p.replace(j.blockStatement([p.node]));
        p = j([p])
          .find(j.ReturnStatement)
          .get();
        bodyPath = p.get('argument');
      }
      const expPath = bodyPath.get('expressions');
      const expNodes = expPath.value;
      const len = expNodes.length;

      if (len) {
        // 将 return 语句体前面的语句放在 return 语句的前面
        expNodes.forEach((unused, i) => {
          if (i < expNodes.length - 1) {
            const exp = expPath.get(i);

            if (exp.node.type === 'CallExpression') {
              const callee = exp.getValueProperty('callee');

              if (callee.type === 'FunctionExpression') {
                exp.replace(j.expressionStatement(exp.node));
              }
            }

            const code = j([exp]).toSource();

            p.insertBefore(code.endsWith(';') ? code : `${code};`);
          }
        });

        // 替换 return 语句体为最后一个 expression
        bodyPath.replace(j([expNodes[len - 1]]).toSource());
      }
    }
  });

// console.log(root.toSource());
// fs.outputFileSync(path.join(__dirname, '../../dist/demo/ret.js'), root.toSource());
fs.outputFileSync(output, root.toSource());

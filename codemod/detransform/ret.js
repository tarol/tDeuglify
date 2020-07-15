const path = require('path');
const fs = require('fs-extra');
const j = require('jscodeshift');

const input = path.join(__dirname, '../../dist/output/args.js');
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
        expNodes.forEach((unused, i) => {
          if (i < expNodes.length - 1) {
            const exp = expPath.get(i);

            p.insertBefore(`${j([exp]).toSource()};`);
          }
        });
        bodyPath.replace(j([expNodes[len - 1]]).toSource());
      }
    }
  });

// console.log(root.toSource());
// fs.outputFileSync(path.join(__dirname, '../../dist/demo/ret.js'), root.toSource());
fs.outputFileSync(output, root.toSource());

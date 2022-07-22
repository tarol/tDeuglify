/*
 * rename：对return语句中的变量进行重命名，理论上应该放在detransform/ret之前
 */
const path = require('path');
const fs = require('fs-extra');
const j = require('jscodeshift');

const { getVariableName } = require('../utils/name');
const { idFilter } = require('../utils/helper');

const input = path.join(__dirname, '../../dist/output/beauty.js');
// const input = path.join(__dirname, '../../demo/rst.js');
const output = path.join(__dirname, '../../dist/output/rst.js');

const code = fs.readFileSync(input, {
  encoding : 'utf8',
});

const root = j(code);

// 缓存 bindings 的修改记录
const bindingsMap = new Map();

root
  .find(j.Function)
  .find(j.ReturnStatement)
  .find(j.Identifier)
  .filter(idFilter)
  .forEach(p => {
    const name = p.getValueProperty('name');
    const bindings = p.scope.getBindings();

    let map = bindingsMap.get(bindings);

    if (!map) {
      map = {};
      bindingsMap.set(bindings, map);
    }

    if (bindings[name]) {
      const binding = bindings[name];
      const path = binding[0];
      const variablePath = path.parent;

      if (variablePath.getValueProperty('type') === 'VariableDeclarator') {
        let type = '';
        const initNode = variablePath.getValueProperty('init');

        if (initNode) {
          if (initNode.type === 'Literal') {
            type = typeof initNode.value;
          } else if (initNode.type === 'ObjectExpression') {
            type = 'object';
          } else if (initNode.type === 'ArrayExpression') {
            type = 'array';
          }
        }
        j([variablePath]).renameTo(getVariableName(type, map, variablePath));
        // variablePath.scope.scan(true);
      }
    }
  });

// console.log(root.toSource());
// fs.outputFileSync(path.join(__dirname, '../../dist/demo/rst.js'), root.toSource());
fs.outputFileSync(output, root.toSource());

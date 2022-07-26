const { startCase } = require('lodash');

function getVariableName(type, map) {
  const rawName = `rst${startCase(type)}`;

  let name = rawName;

  let count = 2;

  while (map[name]) {
    name = `${rawName}${count}`;
    count++;
  }

  // 缓存修改的 flag
  map[name] = true;
  return name;
}

// 获取最近的类型为type的祖宗节点
function getAncestorByType(path, type) {
  let parent = path.parent;

  while (parent) {
    if (parent.getValueProperty('type') === type) {
      break;
    }
    parent = parent.parent;
  }

  return parent;
}

function getArgName(path, args, i) {
  let name = args.length === 1 ? 'arg' : `arg${i}`;
  const bindings = path.scope.getBindings();

  if (path.getValueProperty('type') === 'FunctionDeclaration') {
    name = `${path.get('id').getValueProperty('name')}_${name}`;
  }
  if (
    path.getValueProperty('type') === 'FunctionExpression' ||
    path.getValueProperty('type') === 'ArrowFunctionExpression'
  ) {
    if (path.parent.getValueProperty('type') === 'Property') {
      name = `${path.parent.get('key').getValueProperty('name')}_${name}`;
    }
    const ancestor = getAncestorByType(path, 'VariableDeclarator');

    if (ancestor) {
      name = `${ancestor.get('id').getValueProperty('name')}_${name}`;
    }
  }
  if (bindings[name]) {
    name = `_${name}`;
  }

  return name;
}

const fnMap = new Map();

function getFnName(scope) {
  let type = 'outer',
      count = 0,
      suffix = '';

  let bindingsArray = fnMap.get(scope);

  if (!bindingsArray) {
    bindingsArray = [];
    fnMap.set(scope, bindingsArray);
  }
  if (scope.depth) {
    type = 'inner';
    if (scope.depth > 1) {
      const path = scope.path;

      if (path.getValueProperty('type') === 'FunctionDeclaration') {
        const reg = /(?:innerFn|outerFn)(.*)/;

        suffix = path.getValueProperty('id').name.match(reg)[1];
      }
      if (path.getValueProperty('type') === 'FunctionExpression') {
        suffix = '_anon';
      }
    }
  }

  let name = `${type}Fn${suffix}_${count}`;

  while (bindingsArray.includes(name)) {
    count++;
    name = `${type}Fn${suffix}_${count}`;
  }

  bindingsArray.push(name);

  return name;
}

function getDecName(p) {
  return `var_${p.node.loc.start.line}_${p.node.loc.start.column}`;
}

module.exports = {
  getVariableName,
  getArgName,
  getFnName,
  getDecName,
};

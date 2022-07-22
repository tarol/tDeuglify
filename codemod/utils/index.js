const j = require('jscodeshift');

const { idFilter } = require('./helper');

function isThisScope(scope, path) {
  let curScope;

  // 特殊情况：当父节点为函数声明时，当前作用域是父级作用域
  if (path.parentPath.getValueProperty('type') === 'FunctionDeclaration') {
    curScope = path.scope.parent.path.scope;
  } else {
    curScope = path.scope;
  }

  let curBindings = curScope.getBindings();

  while (!curBindings[path.getValueProperty('name')]) {
    curScope = curScope.parent;
    curBindings = curScope.getBindings();
  }

  return curScope === scope;
}

function renameTo(scope, oName, nName) {
  const bindings = scope.getBindings();
  const path = scope.path;

  if (bindings[oName]) {
    j([path])
      .find(j.Identifier, {
        name : oName,
      })
      .filter(idFilter)
      .filter(p => isThisScope(scope, p))
      .forEach(p => {
        p.get('name').replace(nName);
      });
  }
}

module.exports = {
  renameTo,
};

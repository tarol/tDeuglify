const { getArgName, getFnName } = require('./name');
const { renameTo } = require('./');

exports.renameParams = function(p) {
  const paramsPath = p.get('params');
  const paramNodes = paramsPath.value;

  paramNodes.forEach((node, i) => {
    const name = node.name;

    renameTo(p.scope, name, getArgName(p, paramNodes, i));
  });
};

exports.renameName = function(p) {
  const scope = p.scope.parent;

  renameTo(scope, p.getValueProperty('id').name, getFnName(scope));
};

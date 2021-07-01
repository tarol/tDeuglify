const { getDecName } = require('./name');
const { renameTo } = require('./');

exports.renameId = function(p) {
  const scope = p.scope.parent;

  renameTo(scope, p.getValueProperty('id').name, getDecName(scope));
};

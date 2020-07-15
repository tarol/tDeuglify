const recast = require('recast');
const types = recast.types.namedTypes;

function idFilter(path) {
  const parent = path.parent.node;

  if (types.MemberExpression.check(parent) && parent.property === path.node && !parent.computed) {
    // obj.oldName
    return false;
  }

  if (types.Property.check(parent) && parent.key === path.node && !parent.computed) {
    // { oldName: 3 }
    return false;
  }

  if (types.MethodDefinition.check(parent) && parent.key === path.node && !parent.computed) {
    // class A { oldName() {} }
    return false;
  }

  if (types.ClassProperty.check(parent) && parent.key === path.node && !parent.computed) {
    // class A { oldName = 3 }
    return false;
  }

  if (types.JSXAttribute.check(parent) && parent.name === path.node && !parent.computed) {
    // <Foo oldName={oldName} />
    return false;
  }

  return true;
}

module.exports = {
  idFilter,
};

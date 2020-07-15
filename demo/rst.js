/* eslint-disable no-unused-vars */
function test(a) {
  return a;
}

function test2() {
  const b = 1;

  return b;
}

const test3 = () => {
  const c = {};

  return c;
};

const test4 = function() {
  const d = [];

  return d;
};

const test5 = function() {
  const e = '',
        f = Symbol.for('test');

  let g;

  g = true;
  return e + f + g;
};

function test6(a) {
  return a.toString();
}

function test7() {
  const i = '',
        j = 'tarol';

  function test8() {
    const i = 'okal';

    return i;
  }

  return i + j;
}

function test9() {
  return {
    a : 'tarol',
  };
}

function test10() {
  return class A {

    a() {}

    b = 1;

  };
}

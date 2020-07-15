/* eslint-disable no-unused-vars, object-shorthand */
function a(A, B, C, D) {
  console.log(D);
  function b(D) {
    let A;

    function c() {
      console.log(A);
    }
    return A[B] || D;
  }

  return b(C);
}

function b(B) {
  function c(C) {
    return B * C;
  }
}

const c = {
  say(name) {
    console.log(name);
  },
  do : sth => {
    console.log(sth);
  },
  sleep : function(hour) {
    console.log(hour);
  },
};

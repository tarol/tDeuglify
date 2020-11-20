function a() {
  const v = {};

  function a() {
  //   function a() {}
  //   function z() {}
  //   a();
  //   z();
  }
  // function b() {
  //   function c() {}
  //   c();
  // }
  a.prototype.b = function() {
    function d() {}
  };
  v.p = function() {
    function e() {}
  };
  // a();
  // b();
}
a();

!(function() {}());

module.exports = {
  testRegexp: function (pattern, string) {
    var tester = new RegExp(pattern);
    return tester.test(string);
  }
};

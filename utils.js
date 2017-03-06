module.exports = {
  testRegexp: function(pattern, string) {
    const tester = new RegExp(pattern);
    return tester.test(string);
  }
};

var keyword_checker = require('../keyword_checker.js');

describe('keyword_checker', function () {
  it('should feedback when string contains space between # and digit', function() {
    var feedback = keyword_checker.getFeedback('Fixed # 27');
    var expectedMessage = '   * There should not be a space between the `#` and `issue-number`.\n';
    expect(feedback).toEqual(expectedMessage);
  });

  it('should feedback when string is missing issue reference', function() {
    var feedback = keyword_checker.getFeedback('Fixed something');
    var expectedMessage = '   * Issue Reference (`#<issue-number>`) missing.\n';
    expect(feedback).toEqual(expectedMessage);
  });

  it('should feedback when string does not contain GitHub keyword', function() {
    var feedback = keyword_checker.getFeedback('Repaired #123');
    var expectedMessage = '   * GitHub Keyword missing: Refer [here](https://help.github.com/articles/closing-issues-via-commit-messages/#keywords-for-closing-issues) for a list of accepted keywords.\n';
    expect(feedback).toEqual(expectedMessage);
  });

  it('should feedback both issue and keyword issues in string', function() {
    var feedback = keyword_checker.getFeedback('Repaired # 1');
    var expectedMessage = '   * There should not be a space between the `#` and `issue-number`.\n';
    expectedMessage += '   * GitHub Keyword missing: Refer [here](https://help.github.com/articles/closing-issues-via-commit-messages/#keywords-for-closing-issues) for a list of accepted keywords.\n';
    expect(feedback).toEqual(expectedMessage);
  });
});

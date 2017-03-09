// eslint-disable-next-line camelcase
const keyword_checker = require('../keyword_checker.js');

describe('keyword_checker', () => {
  it('should feedback when string contains space between # and digit', () => {
    const feedback = keyword_checker.getFeedback('Fixed # 27');
    const expectedMessage = '   * There should not be a space between the `#` and `issue-number`.\n';
    expect(feedback).toEqual(expectedMessage);
  });

  it('should feedback when string is missing issue reference', () => {
    const feedback = keyword_checker.getFeedback('Fixed something');
    const expectedMessage = '   * Issue Reference (`#<issue-number>`) missing.\n';
    expect(feedback).toEqual(expectedMessage);
  });

  it('should feedback when string does not contain GitHub keyword', () => {
    const feedback = keyword_checker.getFeedback('Repaired #123');
    const expectedMessage = '   * GitHub Keyword missing: Refer [here](https://help.github.com/articles/closing-issues-via-commit-messages/#keywords-for-closing-issues) for a list of accepted keywords.\n';
    expect(feedback).toEqual(expectedMessage);
  });

  it('should feedback both issue and keyword issues in string', () => {
    const feedback = keyword_checker.getFeedback('Repaired # 1');
    let expectedMessage = '   * There should not be a space between the `#` and `issue-number`.\n';
    expectedMessage += '   * GitHub Keyword missing: Refer [here](https://help.github.com/articles/closing-issues-via-commit-messages/#keywords-for-closing-issues) for a list of accepted keywords.\n';
    expect(feedback).toEqual(expectedMessage);
  });
});

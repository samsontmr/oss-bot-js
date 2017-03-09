// eslint-disable-next-line camelcase
const keyword_checker = require('../keyword_checker.js');

describe('keyword_checker', () => {
  it('should feedback when string contains space between # and digit', () => {
    const violations = keyword_checker.getDetailedViolations('Fixed # 27');
    const expectedViolations = { spaceBetweenHashtagAndDigit: true };
    expect(violations).toEqual(expectedViolations);
  });

  it('should feedback when string is missing issue reference', () => {
    const violations = keyword_checker.getDetailedViolations('Fixed something');
    const expectedViolations = { noIssueReference: true };
    expect(violations).toEqual(expectedViolations);
  });

  it('should feedback when string does not contain GitHub keyword', () => {
    const violations = keyword_checker.getDetailedViolations('Repaired #123');
    const expectedViolations = { missingGithubKeyword: true };
    expect(violations).toEqual(expectedViolations);
  });

  it('should feedback both issue and keyword issues in string', () => {
    const violations = keyword_checker.getDetailedViolations('Repaired # 1');
    const expectedViolations = {
      missingGithubKeyword: true,
      spaceBetweenHashtagAndDigit: true,
    };
    expect(violations).toEqual(expectedViolations);
  });
});

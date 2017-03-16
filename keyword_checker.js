const utils = require('./utils');
const winston = require('winston');

/*
* Returns true if argument contains an issue reference, false otherwise
*/
function containsIssueReference(string) {
  return utils.testRegexp('#\\d', string);
}

/*
* Returns true if argument contains a space between a # and a digit, false otherwise
*/
function containsSpaceBetweenHashtagAndDigit(string) {
  return utils.testRegexp('# \\d', string);
}

/*
* Returns true if argument contains one of GitHub keywords:
* Fix, Fixes, Fixed, Close, Closes, Closed, Resolve, Resolves, Resolved,
* and their lowercase equivalents, false otherwise
*/
function containsGithubKeyword(string) {
  const fixRegexPattern = '([F|f]ix(e[d|s])?)';
  const closeRegexPattern = '([C|c]lose[d|s]?)';
  const resolveRegexPattern = '([R|r]esolve[d|s]?)';
  return utils.testRegexp(`(${fixRegexPattern}|${closeRegexPattern}|${resolveRegexPattern})`,
    string);
}

module.exports = {
  /*
  * Scans input string for convention violations and returns violations detected.
  */
  getDetailedTitleViolations(string) {
    const violations = {};

    if (containsSpaceBetweenHashtagAndDigit(string)) {
      winston.log('Detected space between # and digit');
      violations.spaceBetweenHashtagAndDigit = true;
    } else if (!containsIssueReference(string)) {
      winston.log('Issue reference not found');
      violations.noIssueReference = true;
    }

    return violations;
  },
  /*
  * Scans input string for convention violations and returns violations detected.
  */
  getDetailedBodyViolations(string) {
    const violations = {};

    if (containsSpaceBetweenHashtagAndDigit(string)) {
      winston.log('Detected space between # and digit');
      violations.spaceBetweenHashtagAndDigit = true;
    } else if (!containsIssueReference(string)) {
      winston.log('Issue reference not found');
      violations.noIssueReference = true;
    }

    if (!containsGithubKeyword(string)) {
      winston.log('Missing GitHub keyword');
      violations.missingGithubKeyword = true;
    }

    return violations;
  },
};

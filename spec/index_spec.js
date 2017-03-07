var index = require('../index.js');

describe('index', function () {
  describe('reponse message', function () {
    beforeEach(function() {
      process.env.REGEX_PULL_REQ_TITLE = '\\S\\s';
      process.env.REGEX_PULL_REQ_BODY = '\\S\\s';
      process.env.ENABLE_KEYWORD_CHECKER = 'false';
      process.env.CONTRIBUTING_GUIDELINES = 'test';
    });

    it('should produce response message header with link to guidelines, if regex passes', function () {
      process.env.REGEX_PULL_REQ_TITLE = '\\S\\s';
      process.env.REGEX_PULL_REQ_BODY = '\\S\\s';
      process.env.ENABLE_KEYWORD_CHECKER = 'false';
      process.env.CONTRIBUTING_GUIDELINES = 'test';
      var pullRequest = {
        username: 'JohnDoe',
        title: 'A title',
        body: 'A body'
      };
      var message = index.buildResponseMessage(pullRequest);
      var expectedMessage = 'Hi @JohnDoe, these parts of your pull request do not appear to follow our [contributing guidelines](test):\n\n';
      expect(message).toEqual(expectedMessage);
    });

    it('should feedback when PR title does not match regex', function () {
      process.env.REGEX_PULL_REQ_TITLE = '#';
      var pullRequest = {
        username: 'JohnDoe',
        title: 'A title',
        body: 'A body'
      };
      var message = index.buildResponseMessage(pullRequest);
      var expectedMessage = 'Hi @JohnDoe, these parts of your pull request do not appear to follow our [contributing guidelines](test):\n\n1. PR Title\n';
      expect(message).toEqual(expectedMessage);
    });

    it('should feedback when PR message does not match regex', function () {
      process.env.REGEX_PULL_REQ_BODY = '#';
      var pullRequest = {
        username: 'JohnDoe',
        title: 'A title',
        body: 'A body'
      };
      var message = index.buildResponseMessage(pullRequest);
      var expectedMessage = 'Hi @JohnDoe, these parts of your pull request do not appear to follow our [contributing guidelines](test):\n\n1. PR Description\n';
      expect(message).toEqual(expectedMessage);
    });
  });
});

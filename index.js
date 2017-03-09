const express = require('express');
const bodyParser = require('body-parser');
const GitHub = require('github-api');
const keywordChecker = require('./keyword_checker');
const utils = require('./utils');
const winston = require('winston');

const app = express();
// basic auth
const gh = new GitHub({
  token: process.env.GITHUB_API_TOKEN,
});

// support parsing of application/json type post data
app.use(bodyParser.json());

function isPullRequest(receivedJson) {
  winston.log(`Pull Request field: {${receivedJson.body.pull_request}}`);
  return !!receivedJson.body.pull_request;
}

function extractRelevantDetails(receivedJson) {
  const { pullRequest, action } = receivedJson.body;
  const title = pullRequest.title;
  const body = pullRequest.body;
  const repo = pullRequest.base.repo.full_name;
  const username = pullRequest.user.login;
  const id = pullRequest.number;
  winston.log(`Received PR ${id} "${title}" from: ${username}\nDescription: "${body}"`);
  return {
    repo,
    id,
    title,
    body,
    username,
    action,
  };
}

function isPullRequestToCheck(prDetails) {
  return prDetails.action === 'opened' || prDetails.action === 'edited' ||
    prDetails.action === 'reopened' || prDetails.action === 'review_requested';
}

function isValidPullRequestTitle(prTitle) {
  winston.log(`Title being validated: ${prTitle}`);
  winston.log(`Regex for title: ${process.env.REGEX_PULL_REQ_TITLE}`);
  return utils.testRegexp(process.env.REGEX_PULL_REQ_TITLE, prTitle);
}

function isValidPullRequestBody(prBody) {
  winston.log(`Regex for body: ${process.env.REGEX_PULL_REQ_BODY}`);
  return utils.testRegexp(process.env.REGEX_PULL_REQ_BODY, prBody);
}

function isValidPullRequest(prDetails) {
  return isValidPullRequestTitle(prDetails.title) && isValidPullRequestBody(prDetails.body);
}

function commentOnPullRequest(repo, id, comment) {
  const repoNameSplit = repo.split('/');
  const issueObj = gh.getIssues(repoNameSplit[0], repoNameSplit[1]);
  issueObj.createIssueComment(id, comment);
}

function buildResponseMessage(prDetails) {
  let message = `Hi @${prDetails.username}, these parts of your pull request do not appear to follow our [contributing guidelines](${process.env.CONTRIBUTING_GUIDELINES}):\n\n`;
  if (!isValidPullRequestTitle(prDetails.title)) {
    message += '1. PR Title\n';
  }
  if (!isValidPullRequestBody(prDetails.body)) {
    message += '1. PR Description\n';
    if (process.env.ENABLE_KEYWORD_CHECKER !== undefined &&
      process.env.ENABLE_KEYWORD_CHECKER.toLowerCase() === 'true') {
      message += keywordChecker.getFeedback(prDetails.body);
    }
  }
  return message;
}

function receivePullRequest(request, response) {
  winston.log(`Received pull request: \n${request.body}`);
  response.send();
  if (!isPullRequest(request)) return;
  const extractedPrDetails = extractRelevantDetails(request);
  if (isPullRequestToCheck(extractedPrDetails) && !isValidPullRequest(extractedPrDetails)) {
    winston.log('Check Failed!');
    const responseMsg = buildResponseMessage(extractedPrDetails);
    commentOnPullRequest(extractedPrDetails.repo, extractedPrDetails.id, responseMsg);
    winston.log(`Message to user: \n"${responseMsg}"`);
  }
}

app.post('/pull_req', receivePullRequest);

const port = process.env.PORT || 5000;
app.set('port', port);
app.listen(port, () => {
  winston.log(`Node app is running on port ${port}`);
});

// For unit testing purposes
module.exports = {
  buildResponseMessage,
};

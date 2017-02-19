var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var GitHub = require('github-api');

// basic auth
var gh = new GitHub({
   token: process.env.GITHUB_API_TOKEN
});

app.set('port', (process.env.PORT || 5000));

//support parsing of application/json type post data
app.use(bodyParser.json());

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.post('/pull_req', receivePullRequest);


function receivePullRequest(request, response) {
    console.log('Received pull request: \n' + request.body);
    response.send();
    if (!isPullRequest(request)) return;
    extractedPrDetails = extractRelevantDetails(request);
    if (isPullRequestToCheck(extractedPrDetails) &&
        !isValidPullRequest(extractedPrDetails)) {
        console.log('Check Failed!');
        var responseMsg = buildResponseMessage(extractedPrDetails);
        commentOnPullRequest(extractedPrDetails.repo, extractedPrDetails.id,
                             responseMsg);
        console.log('Message to user: \n' + '"' + responseMsg + '"');
    }
}

function isPullRequest(receivedJson) {
    console.log("Pull Request field: " + '{' + receivedJson.body.pull_request
                + '}');
    return !!receivedJson.body.pull_request;
}

function extractRelevantDetails(receivedJson) {
    repo = receivedJson.body.pull_request.base.repo.full_name;
    action = receivedJson.body.action;
    title = receivedJson.body.pull_request.title;
    body = receivedJson.body.pull_request.body;
    username = receivedJson.body.pull_request.user.login;
    id = receivedJson.body.pull_request.number;
    console.log('Received PR ' + id + ' "' + title + '" from: ' + username +
                '\n Description: "' + body + '"');
    return {repo : repo, id : id, title : title, body : body,
            username : username, action : action};
}

function isPullRequestToCheck(prDetails) {
    return prDetails.action == 'opened' || prDetails.action == 'edited' ||
           prDetails.action == 'reopened' || prDetails.action == 'review_requested';
}

function isValidPullRequest(prDetails) {
    return isValidPullRequestTitle(prDetails.title)
           && isValidPullRequestBody(prDetails.body);
}

function isValidPullRequestTitle(prTitle) {
    titleTest = new RegExp(process.env.REGEX_PULL_REQ_TITLE);
    console.log('Title being validated: ' + prTitle);
    console.log('Regex for title: ' + process.env.REGEX_PULL_REQ_TITLE);
    return titleTest.test(prTitle);
}

function isValidPullRequestBody(prBody) {
    bodyTest = new RegExp(process.env.REGEX_PULL_REQ_BODY, "m");
    console.log('Regex for body: ' + process.env.REGEX_PULL_REQ_BODY);
    return bodyTest.test(prBody);
}

function commentOnPullRequest(repo, id, comment) {
    repoNameSplit = repo.split('/');
    issueObj = gh.getIssues(repoNameSplit[0], repoNameSplit[1]);
    issueObj.createIssueComment(id, comment);
}

function buildResponseMessage(prDetails) {
    var message =  'Hi @' + prDetails.username
                   + ', these parts of your pull request do not appear to '
                   + 'follow our [contributing guidelines]('
                   + process.env.CONTRIBUTING_GUIDELINES + '):\n\n';
    if (!isValidPullRequestTitle(prDetails.title)) {
        message += '1. PR Title\n';
    }
    if (!isValidPullRequestBody(prDetails.body)) {
        message += '1. PR Description\n';
    }
    return message;
}
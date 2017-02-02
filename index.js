var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname));

//support parsing of application/json type post data
app.use(bodyParser.json());

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.post('/pull_req', receive_pull_request);


function receive_pull_request(request, response) {
    console.log("Received pull request: \n" + request.body);
    response.send();
    extractedPrDetails = extractRelevantDetails(request);
    if (validatePullRequest(extractedPrDetails)) {
        console.log("Check passed!");
    }
}

function extractRelevantDetails(received_json) {
    title = received_json.body.pull_request.title;
    body = received_json.body.pull_request.body;
    username = received_json.body.pull_request.user.login;
    console.log('Received PR "' + title + '" from: ' + username +
                '\n Description: "' + body + '"');
    return {title : title, body : body, username : username};
}

function validatePullRequest(prDetails) {
    return validatePullRequestTitle(prDetails.title);
}

function validatePullRequestTitle(prTitle) {
    titleTest = new RegExp(process.env.REGEX_PULL_REQ_BODY);
    console.log("Regex for title: " + process.env.REGEX_PULL_REQ_BODY)
    return titleTest.test(prTitle);
}

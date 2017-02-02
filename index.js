var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));

//support parsing of application/json type post data
app.use(bodyParser.json());

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.post('/pull_req', function(request, response) {
    console.log("Received pull request")
});

//function parsePullRequest

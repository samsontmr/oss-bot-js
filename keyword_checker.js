module.exports = {
    /*
    * Scans input string for convention violations and returns feedback based on
    * detected violations
    * Returns a string containing the formatted feedback message
    */
    getFeedback: function (string) {
        message = "";
        
        if (containsSpaceBetweenHashtagAndDigit(string)) {
            console.log("Detected space between # and digit");
            message += getFormattedMessage(getMessageSpaceBetweenHashtagAndDigit());
        } else if (!containsIssueReference(string)) {
            console.log("Issue reference not found");
            message += getFormattedMessage(getMessageIssueReferenceMissing());
        }
        
        if (!containsGithubKeyword(string)) {
            console.log("Missing GitHub keyword");
            message += getFormattedMessage(getMessageGithubKeywordMissing());
        }
        
        return message;
    }
};

/*
* Checks if an issue reference is present in argument
* Returns true if present, false otherwise
*/
function containsIssueReference(string) {
    referenceTest = new RegExp(/[\s\S]*#\d[\s\S]*/);
    return referenceTest.test(string);
}

/*
* Checks if argument contains a space between a # and a digit
* Returns true if present, false otherwise
*/
function containsSpaceBetweenHashtagAndDigit(string) {
    spaceTest = new RegExp(/[\s\S]*# \d[\s\S]*/);
    return spaceTest.test(string);
}

/*
* Detects if a GitHub keyword is present in argument
* Returns true if present, false otherwise
*/
function containsGithubKeyword(string) {
    keywordTest = new RegExp(/[\s\S]*(([F|f]ix(e[d|s])?)|([C|c]lose[d|s]?)|([R|r]esolve[d|s]?))[\s\S]*/);
    return keywordTest.test(string);
}

function getFormattedMessage(message) {
    return "   * " + message + "\n";
}

function getMessageIssueReferenceMissing() {
    return "Issue Reference (`#<issue-number>`) missing."
}

function getMessageSpaceBetweenHashtagAndDigit() {
    return "There should not be a space between the `#` and `issue-number`."
}

function getMessageGithubKeywordMissing() {
    return "GitHub Keyword missing: Refer [here](https://help.github.com/articles/closing-issues-via-commit-messages/#keywords-for-closing-issues) for a list of accepted keywords."
}
module.exports = {
    getFeedback: function (string) {
        message = "";
        
        if (detectSpaceBetweenHashtagAndDigit(string)) {
            console.log("Detected space between # and digit");
            message += getMessageSpaceBetweenHashtagAndDigit();
        } else if (!detectIssueReference(string)) {
            console.log("Issue reference not found");
            message += getMessageIssueReferenceMissing();
        }
        
        if (!detectGithubKeyword(string)) {
            console.log("Missing GitHub keyword");
            message += getMessageGithubKeywordMissing();
        }
        
        return message;
    }
};

function detectIssueReference(string) {
    referenceTest = new RegExp(/[\s\S]*#\d[\s\S]*/);
    return referenceTest.test(string);
}

function detectSpaceBetweenHashtagAndDigit(string) {
    spaceTest = new RegExp(/[\s\S]*# \d[\s\S]*/);
    return spaceTest.test(string);
}

function detectGithubKeyword(string) {
    keywordTest = new RegExp(/[\s\S]*(([F|f]ix(e[d|s])?)|([C|c]lose[d|s]?)|([R|r]esolve[d|s]?))[\s\S]*/);
    return keywordTest.test(string);
}

function getMessageIssueReferenceMissing() {
    return "   * Issue Reference (`#<issue-number>`) missing.\n"
}

function getMessageSpaceBetweenHashtagAndDigit() {
    return "   * There should not be a space between the `#` and `issue-number`.\n"
}

function getMessageGithubKeywordMissing() {
    return "   * GitHub Keyword missing: Refer [here](https://help.github.com/articles/closing-issues-via-commit-messages/#keywords-for-closing-issues) for a list of accepted keywords.\n"
}
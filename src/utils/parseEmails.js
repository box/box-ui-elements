/**
 * Parse a string containing email addresses and potential contact information
 * or delimeters and return an array of email addresses
 *
 * @param  {string} text The input string
 * @return {array} A list of separated emails
 *
 * @example
 * parseEmails('Foo Bar <fbar@example.com>; Test User <test@example.com>')
 * returns ["fbar@example.com","test@example.com"]
 */
function parseEmails(text) {
    if (text === null || typeof text === 'undefined') {
        // Input text is either null or undefined
        return [];
    }

    const emails = text.match(/[^\s[<(]+@[^\s<>@,/\\]+\.[^\s<>,;)]+/gi);

    if (!emails) {
        // No match pattern is found
        return [];
    }

    return emails.map(c => {
        // Trim the leading and trailing spaces
        c = c.trim();

        // Remove double quote pairs from both ends
        // example '"""abc"""' will be altered to 'abc'
        while (c.length >= 2 && c.charAt(0) === '"' && c.charAt(c.length - 1) === '"') {
            c = c.substr(1, c.length - 2);
        }

        return c;
    });
}

export default parseEmails;

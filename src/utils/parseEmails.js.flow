/**
 * Parse a string containing email addresses and potential contact information
 * or delimiters and return an array of email addresses
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

/**
 * Check if an email belongs to an external collaborator.
 * External collaborator icons will only be displayed in the USM if the current user owns
 * the item and if the collaborator's email domain differs from the owner's email domain.
 *
 * @param {boolean} isCurrentUserOwner
 * @param {string | null} ownerEmailDomain
 * @param {string | undefined} emailToCheck
 * @returns {boolean}
 */
export const checkIsExternalUser = (isCurrentUserOwner, ownerEmailDomain, emailToCheck) => {
    if (!emailToCheck || !ownerEmailDomain || !isCurrentUserOwner) return false;
    return emailToCheck.split('@')[1] !== ownerEmailDomain;
};

export default parseEmails;

/**
 * Parse a comma separated values text and return an array of separated strings
 *
 * @param  {string} text The input string
 * @return {array} A list of separated strings
 *
 * @example
 * parse('a, b, "c, d"')
 * returns ["a", "b", "c, d"]
 */
function parseCSV(text) {
    if (text === null || typeof text === 'undefined') {
        // Input text is either null or undefined
        return [];
    }

    // Convert the comma separated text into array
    //
    // The logic of the regular expression is simple
    // look ahead comma or carriage return and retrieve:
    //   1. either strings that are surrounded by double quotes
    //   2. or strings that do not contain comma and carriage return
    const components = text.match(/(".*?"|[^",\r\n]+)(?=\s*[,\r\n]|\s*$)/g);
    if (!components) {
        // No match pattern is found
        return [];
    }

    return components.map(c => {
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

export default parseCSV;

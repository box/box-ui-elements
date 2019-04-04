/**
 * @flow
 * @file Basic fuzzy search algorithm. Matches all characters in search string to content in any order.
 * @author Box
 *
 * @param {string} search User input search string
 * @param {string} content Content to search over for matches
 * @returns {boolean} If a match is found
 */
const fuzzySearch = (search: string, content: string) => {
    const contentLength = content.length;
    const searchLength = search.length;

    if (searchLength > contentLength || searchLength === 0 || contentLength === 0) {
        return false;
    }

    const letters = new Set([...content]);
    return [...search].every(searchChar => {
        return letters.has(searchChar);
    });
};

export default fuzzySearch;

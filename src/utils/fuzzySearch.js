/**
 * @flow
 * @file Basic fuzzy search algorithm. Matches all characters in search string to content in the order they appear.
 * @author Box
 *
 * @param {string} search User input search string
 * @param {string} content Content to search over for matches
 * @param {number} minCharacters Minimum number of search characters before matching anything, default 3
 * @param {number} maxGaps Approximate maximum number of gaps in the search string to tune fuzzyness, default 2
 * @returns {boolean} If a match is found
 */
const fuzzySearch = (search: string, content: string, minCharacters: number = 3, maxGaps: number = 2) => {
    content = content.toLowerCase().replace(/\s/g, '');
    search = search.toLowerCase().replace(/\s/g, '');
    const contentLength = content.length;
    const searchLength = search.length;
    if (searchLength < minCharacters || searchLength > contentLength) {
        return false;
    }
    let totalScore = 0;
    for (let i = 0; i < contentLength; i += 1) {
        if (contentLength - i < searchLength) {
            break;
        }
        let searchIndex = 0;
        let currentScore = 0;
        let subScore = 0;
        for (let j = i; j < contentLength; j += 1) {
            if (content[j] === search[searchIndex]) {
                searchIndex += 1;
                currentScore += 1 + currentScore;
            } else {
                currentScore = 0;
            }
            subScore += currentScore;
        }
        if (searchIndex !== searchLength) {
            break;
        }
        if (subScore > totalScore) {
            totalScore = subScore;
        }
    }
    if (totalScore > 0) {
        const maxGroups = Math.min(maxGaps, searchLength);
        // minScore is calculated as a near-worst-case score given an even distribution of gaps
        // since the algorithm rewards streak of characters breaking them up evenly is the worst case
        // minimum score should also be better than just each character individually
        const minScore = Math.max(maxGroups * 2 ** Math.floor(searchLength / maxGroups - 1), searchLength + 1);
        return totalScore >= minScore;
    }
    return false;
};

export default fuzzySearch;

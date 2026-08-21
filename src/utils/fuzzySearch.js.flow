/**
 * @flow
 * @file Fuzzy search utility
 * @author Box
 *

/**
 * Fuzzy search helper to match a term against a piece of content.
 * Matches all characters in search string to content in the order they appear.
 * Requires all characters to be matched in order to return true.
 * Internal scoring rewards sequences of characters found in the content very highly.
 * Also has a minimum scoring check the uses the passed maxGaps to approximate how many breaks in the
 * search string are allowed to be present in the content while still considering it to be a match.
 *
 * @param {string} search User input search string
 * @param {string} content Content to search over for matches
 * @param {number} minCharacters Minimum number of search characters before matching anything, default 3
 * @param {number} maxGaps Approximate maximum number of gaps in the search string to tune fuzzyness, default 2
 * @returns {boolean} If a match is found
 */
const fuzzySearch = (search: string, content: ?string, minCharacters: number = 3, maxGaps: number = 2): boolean => {
    if (!content) {
        return false;
    }
    const uniformContent = content.toLowerCase().replace(/\s/g, '');
    const uniformSearch = search.toLowerCase().replace(/\s/g, '');
    const contentLength = uniformContent.length;
    const searchLength = uniformSearch.length;
    if (searchLength < minCharacters || searchLength > contentLength) {
        return false;
    }
    let matched = false;
    let totalScore = 0;
    for (let i = 0; i < contentLength; i += 1) {
        if (contentLength - i < searchLength) {
            break;
        }
        let searchIndex = 0;
        let currentScore = 0;
        let subScore = 0;
        for (let j = i; j < contentLength; j += 1) {
            if (uniformContent[j] === uniformSearch[searchIndex]) {
                searchIndex += 1;
                // For streaks of matched characters score should increase exponentially
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
        matched = totalScore >= minScore;
    }
    return matched;
};

export default fuzzySearch;

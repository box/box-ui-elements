/**
 * 
 * @file Suggested Collaborator utility functions
 * @author Box
 */

import fuzzySearch from '../../../utils/fuzzySearch';
function scoreComparator(optionA, optionB) {
  return optionB.userScore - optionA.userScore;
}

/**
 * Function to compute suggested collaborators given a list of contacts and cached suggested collaborators.
 * Used by input components to help augment API results with cached suggestions using a fuzzy search.
 */
function computeSuggestedCollabs(contacts, suggestedCollabLookup, inputValue, maxSuggestions = 3, minCharacters = 3, maxGaps = 2) {
  const contactIdSet = new Set(contacts.map(contact => contact.id.toString()));
  // $FlowFixMe
  const suggestedCollabs = Object.values(suggestedCollabLookup);
  const exactMatches = suggestedCollabs.filter(suggestedCollab => suggestedCollab.id && contactIdSet.has(suggestedCollab.id.toString()));
  const exactMatchIds = exactMatches.map(suggestedCollab => suggestedCollab.id.toString());
  const suggestedFuzzyMatches = exactMatches.length >= maxSuggestions ? [] : suggestedCollabs.filter(option => {
    if (!inputValue || exactMatchIds.includes(option.id.toString())) {
      return false;
    }
    const nameMatches = fuzzySearch(inputValue, option.name, minCharacters, maxGaps);
    const emailAddress = option.email || '';
    const emailAlias = emailAddress.substring(0, emailAddress.indexOf('@'));
    const emailMatches = inputValue.length >= minCharacters && emailAlias.includes(inputValue);
    return nameMatches || emailMatches;
  });

  // combine both lists preferring exact id matches over fuzzy matches
  const suggestedResult = [...exactMatches.sort(scoreComparator), ...suggestedFuzzyMatches.sort(scoreComparator)].slice(0, maxSuggestions);
  const suggestedResultIds = suggestedResult.map(suggestion => suggestion.id);
  const otherResults = contacts.filter(contact => !suggestedResultIds.includes(contact.id));
  return [suggestedResult, otherResults];
}
export default computeSuggestedCollabs;
//# sourceMappingURL=computeSuggestedCollabs.js.map
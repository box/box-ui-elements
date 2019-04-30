/**
 * @flow
 * @file Suggested Collaborator utility functions
 * @author Box
 */

import {
    MAX_GAPS_FUZZY_MATCH,
    MAX_SUGGESTIONS_TO_SHOW,
    MIN_CHARACTERS_FOR_MATCHING,
    SUGGESTED_COLLAB_CONTACT_TYPE,
} from '../constants';
import fuzzySearch from './fuzzySearch';

/**
 * Function to convert a suggested collaborator object to a contact object
 *
 * @param {SuggestedCollab} suggestedCollab The suggested collaborator object to convert
 * @returns {Contact} The converted contact object
 */
function convertSuggestedCollabToContact(suggestedCollab: SuggestedCollab): Contact {
    return {
        email: suggestedCollab.email,
        id: suggestedCollab.id,
        name: suggestedCollab.name,
        text: suggestedCollab.name,
        type: SUGGESTED_COLLAB_CONTACT_TYPE,
        value: suggestedCollab.email,
    };
}

/**
 * Function to compute suggested collaborators given a list of contacts and cached suggested collaborators.
 * Used by input components to help augment API results with cached suggestions using a fuzzy search.
 *
 * @param {Array<Contact>} contacts Contacts returned from the server
 * @param {SuggestedCollabLookup} suggestedCollaborators Cached suggested collab lookup to match on
 * @param {string} inputValue Value the user typed into the input box searching for collabs
 * @param {number} maxSuggestions Maximum number of items to suggest/return, default 3
 * @param {number} minCharacters Minimum number of characters before searching, default 3
 * @returns {Array<Contact>} Suggested collaborators formatted as Contacts in recommended order
 */
function computeSuggestedContacts(
    contacts: Array<Contact>,
    suggestedCollaborators: SuggestedCollabLookup,
    inputValue: string,
    maxSuggestions: number = MAX_SUGGESTIONS_TO_SHOW,
    minCharacters: number = MIN_CHARACTERS_FOR_MATCHING,
): Array<Contact> {
    const exactMatchIds = contacts
        .filter(option => {
            const id = option.id.toString();
            return id && suggestedCollaborators[id];
        })
        .map(option => option.id);

    const suggestedCollabs = Object.keys(suggestedCollaborators).map(key => suggestedCollaborators[key]);

    const suggestedExactMatches = suggestedCollabs.filter(option => {
        const id = option.id.toString();
        return id && exactMatchIds.includes(id);
    });

    const suggestedFuzzyMatches =
        exactMatchIds.length >= maxSuggestions
            ? []
            : suggestedCollabs.filter((option: SuggestedCollab) => {
                  if (!inputValue || exactMatchIds.includes(option.id.toString())) {
                      return false;
                  }
                  const nameMatches = fuzzySearch(inputValue, option.name, minCharacters, MAX_GAPS_FUZZY_MATCH);
                  const emailAddress = option.email || '';
                  const emailAlias = emailAddress.substring(0, emailAddress.indexOf('@'));
                  const emailMatches = inputValue.length >= minCharacters && emailAlias.indexOf(inputValue) > -1;
                  return nameMatches || emailMatches;
              });

    const sortSuggestionList = list => {
        return list.sort((optionA: SuggestedCollab, optionB: SuggestedCollab) => {
            const currentSuggestedItemA = suggestedCollaborators[optionA.id.toString()];
            const currentSuggestedItemB = suggestedCollaborators[optionB.id.toString()];
            return currentSuggestedItemB.userScore - currentSuggestedItemA.userScore;
        });
    };

    // combine both lists preferring exact id matches over fuzzy matches
    return [...sortSuggestionList(suggestedExactMatches), ...sortSuggestionList(suggestedFuzzyMatches)]
        .slice(0, maxSuggestions)
        .map(convertSuggestedCollabToContact);
}

export { convertSuggestedCollabToContact, computeSuggestedContacts };

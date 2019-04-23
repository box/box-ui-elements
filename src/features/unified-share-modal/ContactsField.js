// @flow

'no babel-plugin-flow-react-proptypes';

// turn off this plugin because it breaks the IntlShape flow type
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import classNames from 'classnames';

import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import ContactDatalistItem from '../../components/contact-datalist-item';
import parseEmails from '../../utils/parseEmails';
import fuzzySearch from '../../utils/fuzzySearch';
import commonMessages from '../../common/messages';

import messages from './messages';
import {
    MAX_GAPS_FUZZY_MATCH,
    MAX_SUGGESTIONS_TO_SHOW,
    MIN_CHARACTERS_FOR_MATCHING,
    SUGGESTED_COLLAB_CONTACT_TYPE,
} from './constants';
import type {
    contactType as Contact,
    suggestedCollaboratorLookupType as SuggestedCollabLookup,
    suggestedCollaboratorType as SuggestedCollab,
} from './flowTypes';

type Props = {
    disabled: boolean,
    error: string,
    fieldRef?: Object,
    getContacts: (query: string) => Promise<Array<Contact>>,
    intl: IntlShape,
    label: React.Node,
    onContactAdd: Function,
    onContactRemove: Function,
    onInput?: Function,
    selectedContacts: Array<Contact>,
    suggestedCollaborators?: SuggestedCollabLookup,
    validateForError: Function,
    validator: Function,
};

type State = {
    contacts: Array<Contact>,
    numSuggestedShowing: number,
    pillSelectorInputValue: string,
};

const isSubstring = (value, searchString) => {
    return value && value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
};

const convertSuggestedCollaboratorToContact = (suggestedCollab: SuggestedCollab): Contact => {
    return {
        email: suggestedCollab.email,
        id: suggestedCollab.id,
        name: suggestedCollab.name,
        text: suggestedCollab.name,
        type: SUGGESTED_COLLAB_CONTACT_TYPE,
        value: suggestedCollab.email,
    };
};

class ContactsField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            contacts: [],
            numSuggestedShowing: 0,
            pillSelectorInputValue: '',
        };
    }

    getSuggestedCollaboratorArray = (): Array<SuggestedCollab> => {
        const { suggestedCollaborators = {} } = this.props;
        return Object.keys(suggestedCollaborators).map(key => suggestedCollaborators[key]);
    };

    addSuggestedContacts = (contacts: Array<Contact>): Array<Contact> => {
        const { suggestedCollaborators = {} } = this.props;
        const { pillSelectorInputValue } = this.state;

        const exactMatchIds = contacts
            .filter(option => {
                const id = option.id.toString();
                return id && suggestedCollaborators[id];
            })
            .map(option => option.id);

        const suggestedCollabs = this.getSuggestedCollaboratorArray();

        const suggestedExactMatches = suggestedCollabs.filter(option => {
            const id = option.id.toString();
            return id && exactMatchIds.includes(id);
        });

        const suggestedFuzzyMatches =
            exactMatchIds.length >= MAX_SUGGESTIONS_TO_SHOW
                ? []
                : suggestedCollabs.filter((option: SuggestedCollab) => {
                      if (!pillSelectorInputValue || exactMatchIds.includes(option.id.toString())) {
                          return false;
                      }
                      const nameMatches = fuzzySearch(
                          pillSelectorInputValue,
                          option.name,
                          MIN_CHARACTERS_FOR_MATCHING,
                          MAX_GAPS_FUZZY_MATCH,
                      );
                      const emailAddress = option.email || '';
                      const emailAlias = emailAddress.substring(0, emailAddress.indexOf('@'));
                      const emailMatches =
                          pillSelectorInputValue.length >= MIN_CHARACTERS_FOR_MATCHING &&
                          emailAlias.indexOf(pillSelectorInputValue) > -1;
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
        const suggestedSelectorOptions = [
            ...sortSuggestionList(suggestedExactMatches),
            ...sortSuggestionList(suggestedFuzzyMatches),
        ]
            .slice(0, MAX_SUGGESTIONS_TO_SHOW)
            .map(convertSuggestedCollaboratorToContact);

        this.setState({ numSuggestedShowing: suggestedSelectorOptions.length });
        const selectorOptionsParsed = contacts.filter(
            option => !suggestedSelectorOptions.map(suggestion => suggestion.id).includes(option.id),
        );

        return [...suggestedSelectorOptions, ...selectorOptionsParsed];
    };

    filterContacts = (contacts: Array<Contact>) => {
        const { pillSelectorInputValue } = this.state;
        const { selectedContacts, suggestedCollaborators } = this.props;

        if (pillSelectorInputValue && contacts) {
            const fullContacts = contacts
                .filter(
                    // filter contacts whose name or email don't match input value
                    ({ name, email }) =>
                        isSubstring(name, pillSelectorInputValue) || isSubstring(email, pillSelectorInputValue),
                )
                .filter(
                    // filter contacts who have already been selected
                    ({ email, id }) => !selectedContacts.find(({ value }) => value === email || value === id),
                )
                .map<Object>(({ email, id, name, type }) => ({
                    // map to standardized DatalistItem format
                    email,
                    id,
                    text: name,
                    name,
                    type,
                    value: email || id, // if email doesn't exist, contact is a group, use id
                }));

            if (suggestedCollaborators) {
                return this.addSuggestedContacts(fullContacts);
            }

            return fullContacts;
        }

        // return empty selector options if input value is empty
        return [];
    };

    getContactsPromise = (query: string) => {
        return this.props
            .getContacts(query)
            .then(contacts => {
                const filteredContacts = this.filterContacts(contacts);
                this.setState({ contacts: filteredContacts });
            })
            .catch(error => {
                if (error.isCanceled) {
                    // silently fail - this happens often when requests get cancelled
                    // due to overlapping requests
                    return;
                }
                throw error;
            });
    };

    debouncedGetContacts = debounce(this.getContactsPromise, 200);

    handlePillSelectorInput = (value: string) => {
        const { onInput } = this.props;
        const trimmedValue = value.trim();

        this.setState({
            pillSelectorInputValue: trimmedValue,
        });

        if (onInput) {
            onInput(value);
        }

        if (!trimmedValue) {
            this.setState({ contacts: [] });
            return;
        }

        this.debouncedGetContacts(trimmedValue);
    };

    render() {
        const {
            intl,
            disabled,
            error,
            fieldRef,
            label,
            selectedContacts,
            onContactAdd,
            onContactRemove,
            validateForError,
            validator,
        } = this.props;
        const { contacts, numSuggestedShowing } = this.state;
        const groupLabel = <FormattedMessage {...messages.groupLabel} />;
        const shouldShowSuggested = numSuggestedShowing > 0 && contacts.length !== numSuggestedShowing;
        const pillSelectorOverlayClasses = classNames({
            scrollable: contacts.length > 5,
        });

        return (
            <PillSelectorDropdown
                allowCustomPills
                className={pillSelectorOverlayClasses}
                dividerIndex={shouldShowSuggested ? numSuggestedShowing : undefined}
                disabled={disabled}
                error={error}
                inputProps={{
                    autoFocus: true,
                    onChange: noop,
                }}
                label={label}
                onInput={this.handlePillSelectorInput}
                onRemove={onContactRemove}
                onSelect={onContactAdd}
                overlayTitle={shouldShowSuggested ? intl.formatMessage(messages.suggestedCollabsTitle) : undefined}
                parseItems={parseEmails}
                placeholder={intl.formatMessage(commonMessages.pillSelectorPlaceholder)}
                ref={fieldRef}
                selectedOptions={selectedContacts}
                selectorOptions={contacts}
                validateForError={validateForError}
                validator={validator}
            >
                {contacts.map(({ email, text = null, id }) => (
                    <ContactDatalistItem key={id} name={text} subtitle={email || groupLabel} />
                ))}
            </PillSelectorDropdown>
        );
    }
}

export { ContactsField as ContactsFieldBase };
export default injectIntl(ContactsField);

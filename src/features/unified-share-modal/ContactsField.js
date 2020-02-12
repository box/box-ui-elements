// @flow

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import classNames from 'classnames';

import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import ContactDatalistItem from '../../components/contact-datalist-item';
import parseEmails from '../../utils/parseEmails';
import commonMessages from '../../common/messages';

import messages from './messages';
import type { contactType as Contact, suggestedCollaboratorsType } from './flowTypes';
import type { SelectOptionProp } from '../../components/select-field/props';

type Props = {
    disabled: boolean,
    error: string,
    fieldRef?: Object,
    getContacts: (query: string) => Promise<Array<Contact>>,
    intl: any,
    label: React.Node,
    onContactAdd: Function,
    onContactRemove: Function,
    onInput?: Function,
    onPillCreate?: (pills: Array<SelectOptionProp | Contact>) => void,
    selectedContacts: Array<Contact>,
    showInviteeAvatars?: boolean,
    suggestedCollaborators?: suggestedCollaboratorsType,
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

class ContactsField extends React.Component<Props, State> {
    static defaultProps = {
        showInviteeAvatars: false,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            contacts: [],
            numSuggestedShowing: 0,
            pillSelectorInputValue: '',
        };
    }

    addSuggestedContacts = (contacts: Array<Contact>) => {
        const { suggestedCollaborators = {} } = this.props;

        const suggestedSelectorOptions = contacts
            .filter(option => {
                const { id } = option;
                return id && suggestedCollaborators[id.toString()];
            })
            .sort((optionA, optionB) => {
                const currentSuggestedItemA = suggestedCollaborators[optionA.id.toString()];
                const currentSuggestedItemB = suggestedCollaborators[optionB.id.toString()];
                return currentSuggestedItemB.userScore - currentSuggestedItemA.userScore;
            })
            .slice(0, 3);

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
                .map<Object>(({ avatarURLs = {}, email, hasCustomAvatar = false, id, isExternalUser, name, type }) => ({
                    // map to standardized DatalistItem format
                    avatarURLs,
                    email,
                    hasCustomAvatar,
                    id,
                    isExternalUser,
                    text: name,
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
            onPillCreate,
            showInviteeAvatars,
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
                onPillCreate={onPillCreate}
                overlayTitle={shouldShowSuggested ? intl.formatMessage(messages.suggestedCollabsTitle) : undefined}
                parseItems={parseEmails}
                placeholder={intl.formatMessage(commonMessages.pillSelectorPlaceholder)}
                ref={fieldRef}
                selectedOptions={selectedContacts}
                selectorOptions={contacts}
                showRoundedPills={showInviteeAvatars}
                validateForError={validateForError}
                validator={validator}
            >
                {contacts.map(({ email, text = null, id, avatarURLs, hasCustomAvatar }) => (
                    <ContactDatalistItem
                        key={id}
                        id={id}
                        name={text}
                        subtitle={email || groupLabel}
                        title={text}
                        avatarUrl={hasCustomAvatar ? avatarURLs.large || avatarURLs.small : null}
                        showAvatar={showInviteeAvatars}
                    />
                ))}
            </PillSelectorDropdown>
        );
    }
}

export { ContactsField as ContactsFieldBase };
export default injectIntl(ContactsField);

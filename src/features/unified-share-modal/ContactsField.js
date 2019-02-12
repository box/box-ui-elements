// @flow

'no babel-plugin-flow-react-proptypes';

// turn off this plugin because it breaks the IntlShape flow type
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import classNames from 'classnames';

import PillSelectorDropdown from 'components/pill-selector-dropdown';
import ContactDatalistItem from 'components/contact-datalist-item';
import parseEmails from 'utils/parseEmails';
import commonMessages from '../../common/messages';

import messages from './messages';
import type { contactType as Contact } from './flowTypes';

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
    onSuggestedCollaboratorAdd: Contact => void,
    selectedContacts: Array<Contact>,
    suggestedCollaborators?: Array<Contact>,
    validateForError: Function,
    validator: Function,
};

type State = {
    contacts: Array<Contact>,
    pillSelectorInputValue: string,
};

const isSubstring = (value, searchString) => {
    return value && value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
};

class ContactsField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            contacts: [],
            pillSelectorInputValue: '',
        };
    }

    filterContacts = (contacts: Array<Contact>) => {
        const { pillSelectorInputValue } = this.state;
        const { selectedContacts } = this.props;

        if (pillSelectorInputValue && contacts) {
            return contacts
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
                    type,
                    value: email || id, // if email doesn't exist, contact is a group, use id
                }));
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
            onSuggestedCollaboratorAdd,
            suggestedCollaborators,
            validateForError,
            validator,
        } = this.props;
        const { contacts } = this.state;
        const groupLabel = <FormattedMessage {...messages.groupLabel} />;
        const pillSelectorOverlayClasses = classNames({
            scrollable: contacts.length > 5,
        });

        return (
            <PillSelectorDropdown
                allowCustomPills
                className={pillSelectorOverlayClasses}
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
                onSuggestedPillAdd={onSuggestedCollaboratorAdd}
                parseItems={parseEmails}
                placeholder={intl.formatMessage(commonMessages.pillSelectorPlaceholder)}
                ref={fieldRef}
                selectedOptions={selectedContacts}
                selectorOptions={contacts}
                suggestedPillsData={suggestedCollaborators}
                suggestedPillsTitle={intl.formatMessage(messages.suggestedCollabsTitle)}
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

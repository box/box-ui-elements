import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import ContactDatalistItem from '../../components/contact-datalist-item';
import TextArea from '../../components/text-area';
import PrimaryButton from '../../components/primary-button';
import { ModalActions } from '../../components/modal';
import Button from '../../components/button';
import parseEmails from '../../utils/parseEmails';
import commonMessages from '../../common/messages';

import messages from './messages';

import './EmailSharedLink.scss';

class EmailSharedLink extends Component {
    static propTypes = {
        contacts: PropTypes.arrayOf(
            PropTypes.shape({
                email: PropTypes.string,
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isrequired,
                name: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
            }),
        ).isRequired,
        defaultEmailMessage: PropTypes.string,
        emailMessageProps: PropTypes.object,
        intl: PropTypes.any,
        getContacts: PropTypes.func.isRequired,
        isExpanded: PropTypes.bool,
        onExpand: PropTypes.func.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        sendEmail: PropTypes.func.isRequired,
        submitting: PropTypes.bool,
    };

    static defaultProps = {
        emailMessageProps: {},
    };

    constructor(props) {
        super(props);

        const { defaultEmailMessage } = props;

        this.state = {
            pillSelectorError: '',
            pillSelectorInputValue: '',
            emailMessage: defaultEmailMessage || '',
            selectedOptions: [],
        };
    }

    getSelectorOptions = () => {
        const { contacts } = this.props;
        const { pillSelectorInputValue, selectedOptions } = this.state;

        if (pillSelectorInputValue !== '') {
            return contacts
                .filter(
                    // filter contacts who have already been selected
                    ({ email, id }) => !selectedOptions.find(({ value }) => value === email || value === id),
                )
                .map(({ email, id, name, type }) => ({
                    // map to standardized DatalistItem format
                    // TODO: refactor this so inline conversions aren't required at every usage
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

    handlePillSelectorInput = value => {
        const { getContacts } = this.props;

        const trimmedValue = value.trim();

        getContacts(trimmedValue);

        // As user is typing, reset error
        this.setState({
            pillSelectorError: '',
            pillSelectorInputValue: trimmedValue,
        });
    };

    handlePillSelect = pills => {
        this.setState({
            selectedOptions: [...this.state.selectedOptions, ...pills],
        });
    };

    handlePillRemove = (option, index) => {
        const selectedOptions = this.state.selectedOptions.slice();
        selectedOptions.splice(index, 1);
        this.setState({ selectedOptions });
    };

    validateForError = text => {
        const {
            intl: { formatMessage },
        } = this.props;
        let pillSelectorError = '';

        if (text && !this.validator(text)) {
            pillSelectorError = formatMessage(commonMessages.invalidEmailError);
        }

        this.setState({ pillSelectorError });
    };

    validator = text => {
        // email input validation
        const pattern = /^[^\s<>@,]+@[^\s<>@,/\\]+\.[^\s<>@,]+$/i;
        return pattern.test(text);
    };

    sendEmail = event => {
        event.preventDefault();

        const {
            intl: { formatMessage },
            sendEmail,
        } = this.props;
        const { selectedOptions, emailMessage, pillSelectorError } = this.state;

        if (pillSelectorError !== '') {
            return;
        }

        if (selectedOptions.length === 0) {
            // Block submission if no pills are selected
            this.setState({
                pillSelectorError: formatMessage(messages.enterAtLeastOneEmailError),
            });
            return;
        }

        sendEmail({
            emails: selectedOptions.map(({ value }) => value),
            emailMessage,
        });
    };

    handleMessageChange = event => {
        this.setState({ emailMessage: event.target.value });
    };

    render() {
        const { pillSelectorError, selectedOptions, emailMessage } = this.state;
        const {
            emailMessageProps,
            intl: { formatMessage },
            isExpanded,
            onExpand,
            onRequestClose,
            submitting,
        } = this.props;

        const selectorOptions = this.getSelectorOptions();

        return (
            <form
                onSubmit={this.sendEmail}
                className={classNames('email-shared-link', {
                    'is-expanded': isExpanded,
                })}
            >
                <PillSelectorDropdown
                    allowCustomPills
                    error={pillSelectorError}
                    label={<FormattedMessage {...messages.emailSharedLink} />}
                    inputProps={{ onFocus: onExpand, ...emailMessageProps }}
                    onInput={this.handlePillSelectorInput}
                    onRemove={this.handlePillRemove}
                    onSelect={this.handlePillSelect}
                    parseItems={parseEmails}
                    placeholder={formatMessage(commonMessages.pillSelectorPlaceholder)}
                    selectedOptions={selectedOptions}
                    selectorOptions={selectorOptions}
                    tooltipWrapperClassName="bdl-EmailSharedLink-tooltipWrapper"
                    validateForError={this.validateForError}
                    validator={this.validator}
                >
                    {selectorOptions.map(({ email, text, value }) => (
                        <ContactDatalistItem key={value} name={text} subtitle={email} />
                    ))}
                </PillSelectorDropdown>
                <TextArea
                    isRequired
                    label={<FormattedMessage {...messages.messageTitle} />}
                    onChange={this.handleMessageChange}
                    rows={3}
                    tooltipWrapperClassName="bdl-EmailSharedLink-tooltipWrapper"
                    value={emailMessage}
                />
                {isExpanded && (
                    <ModalActions>
                        <Button isDisabled={submitting} onClick={onRequestClose} type="button">
                            <FormattedMessage {...commonMessages.cancel} />
                        </Button>
                        <PrimaryButton isDisabled={submitting} isLoading={submitting} type="submit">
                            <FormattedMessage {...commonMessages.send} />
                        </PrimaryButton>
                    </ModalActions>
                )}
            </form>
        );
    }
}

export { EmailSharedLink as EmailSharedLinkBase };
export default injectIntl(EmailSharedLink);

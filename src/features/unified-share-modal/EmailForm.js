// @flow

import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import TextArea from '../../components/text-area';
import PrimaryButton from '../../components/primary-button';
import { ModalActions } from '../../components/modal';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';
import InlineNotice from '../../components/inline-notice';
import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import commonMessages from '../../common/messages';
import { emailValidator } from '../../utils/validators';
import type { InlineNoticeType } from '../../common/types/core';
import IconGlobe from '../../icons/general/IconGlobe';

import ContactsField from './ContactsField';
import messages from './messages';
import type { SuggestedCollabLookup, contactType as Contact } from './flowTypes';
import type { SelectOptionProp } from '../../components/select-field/props';

type Props = {
    cancelButtonProps?: Object,
    children?: React.Node,
    contactLimit?: number,
    contactsFieldAvatars?: React.Node,
    contactsFieldDisabledTooltip: React.Node,
    contactsFieldLabel: React.Node,
    getContactAvatarUrl?: (contact: Contact) => string,
    getContacts: (query: string) => Promise<Array<Contact>>,
    inlineNotice: {
        content: React.Node,
        type: InlineNoticeType,
    },
    intl: any,
    isContactsFieldEnabled: boolean,
    isExpanded: boolean,
    isExternalUserSelected: boolean,
    messageProps?: Object,
    onContactAdd?: Function,
    onContactInput?: Function,
    onContactRemove?: Function,
    onPillCreate?: (pills: Array<SelectOptionProp | Contact>) => void,
    onRequestClose: Function,
    onSubmit: Function,
    openInviteCollaboratorsSection?: Function,
    recommendedSharingTooltipCalloutName?: ?string,
    selectedContacts: Array<Contact>,
    sendButtonProps?: Object,
    showEnterEmailsCallout: boolean,
    submitting: boolean,
    suggestedCollaborators?: SuggestedCollabLookup,
    updateSelectedContacts: Function,
};

type State = {
    contactsFieldError: string,
    message: string,
};

class EmailForm extends React.Component<Props, State> {
    static defaultProps = {
        messageProps: {},
        contactsFieldDisabledTooltip: null,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            contactsFieldError: '',
            message: '',
        };
    }

    contactsFieldRef: {
        current: null | PillSelectorDropdown,
    } = React.createRef();

    handleContactAdd = (contacts: Array<Contact>) => {
        const { selectedContacts, onContactAdd, updateSelectedContacts } = this.props;

        const updatedContacts = [...selectedContacts, ...contacts];
        updateSelectedContacts(updatedContacts);

        this.validateContacts(updatedContacts);

        if (onContactAdd) {
            onContactAdd(contacts);
        }
    };

    handleContactRemove = (option: any, index: number) => {
        const { onContactRemove, updateSelectedContacts } = this.props;
        const selectedContacts = this.props.selectedContacts.slice();
        const removed = selectedContacts.splice(index, 1);
        updateSelectedContacts(selectedContacts);

        this.validateContacts(selectedContacts);

        if (onContactRemove) {
            onContactRemove(removed);
        }
    };

    validateContacts = (selectedContacts: Array<Contact>) => {
        const { contactLimit, intl } = this.props;

        let contactsFieldError = '';
        if (contactLimit !== undefined && selectedContacts.length > contactLimit) {
            contactsFieldError = intl.formatMessage(messages.contactsExceedLimitError, {
                maxContacts: contactLimit,
            });
        } else if (selectedContacts.length === 0) {
            contactsFieldError = intl.formatMessage(messages.enterAtLeastOneEmailError);
        }

        this.setState({ contactsFieldError });

        return contactsFieldError;
    };

    handleContactInput = (value: string) => {
        const { onContactInput } = this.props;

        if (onContactInput) {
            onContactInput(value);
        }
    };

    handleMessageChange = (event: SyntheticEvent<HTMLTextAreaElement>) => {
        const { target } = event;

        if (target instanceof HTMLTextAreaElement) {
            this.setState({ message: target.value });
        }
    };

    handleClose = () => {
        this.setState({
            message: '',
            contactsFieldError: '',
        });

        this.props.updateSelectedContacts([]);

        /* Need to reset text in contacts field upon cancelling
           because the field still shows if the field isn't unmounted
           but only collapsed (like in invite collabs usage).
           inputValue doesn't get passed down through props but is
           internal state in pill selector. */
        if (this.contactsFieldRef.current) {
            this.contactsFieldRef.current.setState({ inputValue: '' });
        }

        this.props.onRequestClose();
    };

    handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { onSubmit, selectedContacts } = this.props;
        const { message, contactsFieldError } = this.state;

        if (contactsFieldError !== '') {
            // Block submission if there's a validation error
            return;
        }

        const contactsError = this.validateContacts(selectedContacts);
        if (contactsError) {
            return;
        }

        const emails = [];
        const groupIDs = [];

        selectedContacts.forEach(({ type, value }) => {
            if (type === 'group') {
                groupIDs.push(value);
            } else {
                emails.push(value);
            }
        });
        onSubmit({
            emails,
            groupIDs,
            message,
        }).catch(error => {
            // Remove sent emails from selected pills
            const invitedEmails = error.invitedEmails || [];
            this.filterSentEmails(invitedEmails);
        });
    };

    filterSentEmails = (sentEmails: Array<string>) => {
        this.props.updateSelectedContacts(
            this.props.selectedContacts.filter(({ value }) => !sentEmails.includes(value)),
        );
    };

    validateContactField = (text: string) => {
        const { intl } = this.props;
        let contactsFieldError = '';

        if (text && !this.isValidEmail(text)) {
            contactsFieldError = intl.formatMessage(commonMessages.invalidEmailError);
        }
        this.setState({ contactsFieldError });
    };

    isValidEmail = (text: string): boolean => {
        return emailValidator(text);
    };

    render() {
        const { contactsFieldError, message } = this.state;

        const {
            cancelButtonProps,
            children,
            contactsFieldAvatars,
            contactsFieldDisabledTooltip,
            contactsFieldLabel,
            inlineNotice,
            isContactsFieldEnabled,
            isExternalUserSelected,
            getContactAvatarUrl,
            getContacts,
            intl,
            isExpanded,
            messageProps,
            onPillCreate,
            recommendedSharingTooltipCalloutName,
            sendButtonProps,
            showEnterEmailsCallout,
            selectedContacts,
            submitting,
            suggestedCollaborators,
        } = this.props;

        const ftuxTooltipProps = {
            className: 'usm-ftux-tooltip',
            isShown: showEnterEmailsCallout,
            position: 'middle-right',
            showCloseButton: true,
            text: <FormattedMessage {...messages.enterEmailAddressesCalloutText} />,
            theme: 'callout',
        };

        const recommendedSharingTooltipProps = {
            isShown: !!recommendedSharingTooltipCalloutName,
            position: 'middle-left',
            text: (
                <FormattedMessage
                    {...messages.recommendedSharingTooltipCalloutText}
                    values={{ fullName: recommendedSharingTooltipCalloutName }}
                />
            ),
            theme: 'callout',
        };

        const tooltipPropsToRender = recommendedSharingTooltipCalloutName
            ? recommendedSharingTooltipProps
            : ftuxTooltipProps;

        const contactsField = (
            <div className="tooltip-target">
                <Tooltip {...tooltipPropsToRender}>
                    <ContactsField
                        disabled={!isContactsFieldEnabled}
                        error={contactsFieldError}
                        fieldRef={this.contactsFieldRef}
                        getContacts={getContacts}
                        getContactAvatarUrl={getContactAvatarUrl}
                        label={contactsFieldLabel}
                        onContactAdd={this.handleContactAdd}
                        onContactRemove={this.handleContactRemove}
                        onInput={this.handleContactInput}
                        onPillCreate={onPillCreate}
                        selectedContacts={selectedContacts}
                        suggestedCollaborators={suggestedCollaborators}
                        validateForError={this.validateContactField}
                        validator={this.isValidEmail}
                        showContactAvatars
                    />
                </Tooltip>
            </div>
        );

        let contactsFieldWrap;
        if (isContactsFieldEnabled) {
            contactsFieldWrap = contactsField;
        } else {
            contactsFieldWrap = (
                <Tooltip position="bottom-center" text={contactsFieldDisabledTooltip}>
                    {contactsField}
                </Tooltip>
            );
        }

        return (
            <form
                className={classNames({
                    'is-expanded': isExpanded,
                })}
                onSubmit={this.handleSubmit}
            >
                {inlineNotice.content && isExpanded && (
                    <InlineNotice type={inlineNotice.type}>{inlineNotice.content}</InlineNotice>
                )}
                {contactsFieldAvatars}
                {contactsFieldWrap}
                {children}
                {isExpanded && (
                    <TextArea
                        label={<FormattedMessage {...messages.messageTitle} />}
                        onChange={this.handleMessageChange}
                        placeholder={intl.formatMessage(commonMessages.messageSelectorPlaceholder)}
                        rows={3}
                        value={message}
                        {...messageProps}
                    />
                )}
                {isExpanded && isExternalUserSelected && (
                    <div className="security-indicator-note">
                        <span className="security-indicator-icon-globe">
                            <IconGlobe height={12} width={12} />
                        </span>
                        <FormattedMessage {...messages.contentSharedWithExternalCollaborators} />
                    </div>
                )}
                {isExpanded && (
                    <ModalActions>
                        <Button isDisabled={submitting} onClick={this.handleClose} type="button" {...cancelButtonProps}>
                            <FormattedMessage {...commonMessages.cancel} />
                        </Button>
                        <PrimaryButton
                            isDisabled={submitting}
                            isLoading={submitting}
                            type="submit"
                            {...sendButtonProps}
                        >
                            <FormattedMessage {...commonMessages.send} />
                        </PrimaryButton>
                    </ModalActions>
                )}
            </form>
        );
    }
}

export { EmailForm as EmailFormBase };
export default injectIntl(EmailForm);

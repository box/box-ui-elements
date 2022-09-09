// @flow

import * as React from 'react';
import isString from 'lodash/isString';
import partition from 'lodash/partition';
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

import ContactRestrictionNotice from './ContactRestrictionNotice';
import ContactsField from './ContactsField';
import hasRestrictedContacts from './utils/hasRestrictedContacts';
import isRestrictedContact from './utils/isRestrictedContact';
import messages from './messages';
import type { CollabRestrictionType, SuggestedCollabLookup, contactType as Contact, USMConfig } from './flowTypes';
import type { SelectOptionProp } from '../../components/select-field/props';

type Props = {
    cancelButtonProps?: Object,
    children?: React.Node,
    collabRestrictionType?: CollabRestrictionType,
    config?: USMConfig,
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
    isFetchingJustificationReasons?: boolean,
    isRestrictionJustificationEnabled: boolean,
    justificationReasons: Array<SelectOptionProp>,
    messageProps?: Object,
    onContactAdd?: Function,
    onContactInput?: Function,
    onContactRemove?: Function,
    onPillCreate?: (pills: Array<SelectOptionProp | Contact>) => void,
    onRequestClose: Function,
    onSubmit: Function,
    openInviteCollaboratorsSection?: Function,
    recommendedSharingTooltipCalloutName?: ?string,
    restrictedEmails: Array<string>,
    restrictedGroups: Array<number>,
    selectedContacts: Array<Contact>,
    sendButtonProps?: Object,
    showEnterEmailsCallout: boolean,
    submitting: boolean,
    suggestedCollaborators?: SuggestedCollabLookup,
    updateSelectedContacts: Function,
};

type State = {
    contactsFieldError: string,
    contactsRestrictionError: string,
    message: string,
    selectedJustificationReason: ?SelectOptionProp,
};

class EmailForm extends React.Component<Props, State> {
    static defaultProps = {
        messageProps: {},
        contactsFieldDisabledTooltip: null,
        isRestrictionJustificationEnabled: false,
        justificationReasons: [],
        restrictedEmails: [],
        restrictedGroups: [],
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            contactsFieldError: '',
            contactsRestrictionError: '',
            message: '',
            selectedJustificationReason: null,
        };
    }

    contactsFieldRef: {
        current: null | PillSelectorDropdown,
    } = React.createRef();

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { isRestrictionJustificationEnabled } = this.props;
        const { isRestrictionJustificationEnabled: prevIsRestrictionJustificationEnabled } = prevProps;
        const { contactsFieldError, contactsRestrictionError } = this.state;
        const {
            contactsFieldError: prevContactsFieldError,
            contactsRestrictionError: prevContactsRestrictionError,
        } = prevState;

        // Only display one type of error at a time and give preference
        // to the one triggered most recently
        if (!prevContactsFieldError && contactsFieldError) {
            this.setState({ contactsRestrictionError: '' });
        }
        if (!prevContactsRestrictionError && contactsRestrictionError) {
            this.setState({ contactsFieldError: '' });
        }

        const didJustificationRequirementChange =
            isRestrictionJustificationEnabled !== prevIsRestrictionJustificationEnabled;

        // Clear selected justification when form state is reset
        if (didJustificationRequirementChange && !isRestrictionJustificationEnabled) {
            this.setState({ selectedJustificationReason: null });
        }
    }

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

    handleRemoveRestrictedContacts = () => {
        const { onContactRemove, selectedContacts, updateSelectedContacts } = this.props;

        const [removedContacts, remainingContacts] = partition(selectedContacts, (contact: Contact) =>
            this.isRestrictedContact(contact),
        );

        updateSelectedContacts(remainingContacts);
        this.validateContacts(remainingContacts);

        if (onContactRemove) {
            removedContacts.forEach(removedContact => {
                onContactRemove(removedContact);
            });
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

    validateContactsRestrictions = () => {
        let contactsRestrictionError = '';
        const { selectedJustificationReason } = this.state;
        const {
            intl,
            isRestrictionJustificationEnabled,
            selectedContacts,
            restrictedEmails,
            restrictedGroups,
        } = this.props;

        const hasRestrictedCollabs = hasRestrictedContacts(selectedContacts, restrictedEmails, restrictedGroups);
        const isMissingRequiredJustification = isRestrictionJustificationEnabled && !selectedJustificationReason;

        if (isMissingRequiredJustification) {
            contactsRestrictionError = intl.formatMessage(messages.justificationRequiredError);
        } else if (hasRestrictedCollabs && !isRestrictionJustificationEnabled) {
            contactsRestrictionError = intl.formatMessage(messages.restrictedContactsError);
        }

        this.setState({ contactsRestrictionError });

        return contactsRestrictionError;
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

    handleSelectJustificationReason = (selectedJustificationReason: SelectOptionProp) => {
        this.setState({ selectedJustificationReason }, this.validateContactsRestrictions);
    };

    handleClose = () => {
        this.setState({
            message: '',
            contactsFieldError: '',
            selectedJustificationReason: null,
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
        const { message, contactsFieldError, selectedJustificationReason } = this.state;

        if (contactsFieldError !== '') {
            // Block submission if there's a validation error
            return;
        }

        const contactsError = this.validateContacts(selectedContacts);
        const contactsRestrictionError = this.validateContactsRestrictions();

        if (contactsError || contactsRestrictionError) {
            return;
        }

        const emails = [];
        const groupIDs = [];
        const restrictedGroups = [];
        const restrictedEmails = [];

        selectedContacts.forEach(contact => {
            const { id, type, value } = contact;

            if (type === 'group') {
                groupIDs.push(value);

                if (this.isRestrictedContact(contact)) {
                    restrictedGroups.push(id);
                }
            } else {
                if (this.isRestrictedContact(contact)) {
                    restrictedEmails.push(value);
                }
                emails.push(value);
            }
        });

        onSubmit({
            emails,
            groupIDs,
            justificationReason: selectedJustificationReason,
            message,
            restrictedEmails,
            restrictedGroups,
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

        if (text && !emailValidator(text)) {
            contactsFieldError = intl.formatMessage(commonMessages.invalidEmailError);
        }
        this.setState({ contactsFieldError });
    };

    isValidContactPill = (contactPill: string | Contact): boolean => {
        let isValid = true;
        const { selectedJustificationReason } = this.state;
        const { isRestrictionJustificationEnabled } = this.props;

        if (isString(contactPill)) {
            // If we receive a string it means we're validating unparsed
            // pill selector input. Check that we have a valid email
            isValid = emailValidator(contactPill);
        } else {
            const hasRequiredJustification = !!selectedJustificationReason && isRestrictionJustificationEnabled;
            // Invalid emails are filtered out by ContactsField when parsing
            // new pills, so parsed pills can currently only be invalid
            // when user is restricted by a security policy
            isValid = !this.isRestrictedContact(contactPill) || hasRequiredJustification;
        }
        return isValid;
    };

    getContactPillClassName = (contactPill: SelectOptionProp): string => {
        const { selectedJustificationReason } = this.state;
        const { isRestrictionJustificationEnabled } = this.props;

        const hasRequiredJustification = !!selectedJustificationReason && isRestrictionJustificationEnabled;
        const isWaivedPill = this.isRestrictedContact(contactPill) && hasRequiredJustification;

        return isWaivedPill ? 'is-waived' : '';
    };

    isRestrictedContact = (contact: Contact | SelectOptionProp) => {
        const { restrictedEmails, restrictedGroups } = this.props;

        return isRestrictedContact(contact, restrictedEmails, restrictedGroups);
    };

    render() {
        const { contactsFieldError, contactsRestrictionError, message, selectedJustificationReason } = this.state;

        const {
            cancelButtonProps,
            children,
            collabRestrictionType,
            config,
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
            isFetchingJustificationReasons,
            isRestrictionJustificationEnabled,
            justificationReasons,
            messageProps,
            onPillCreate,
            recommendedSharingTooltipCalloutName,
            restrictedEmails,
            restrictedGroups,
            selectedContacts,
            sendButtonProps,
            showEnterEmailsCallout,
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
                        getPillClassName={this.getContactPillClassName}
                        label={contactsFieldLabel}
                        onContactAdd={this.handleContactAdd}
                        onContactRemove={this.handleContactRemove}
                        onInput={this.handleContactInput}
                        onPillCreate={onPillCreate}
                        selectedContacts={selectedContacts}
                        suggestedCollaborators={suggestedCollaborators}
                        validateForError={this.validateContactField}
                        validator={this.isValidContactPill}
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

        const hideMessageSection = config && config.showInviteCollaboratorMessageSection === false;
        const shouldRenderContactRestrictionNotice =
            isExpanded && hasRestrictedContacts(selectedContacts, restrictedEmails, restrictedGroups);

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
                {shouldRenderContactRestrictionNotice && (
                    <ContactRestrictionNotice
                        collabRestrictionType={collabRestrictionType}
                        error={contactsRestrictionError}
                        isFetchingJustificationReasons={isFetchingJustificationReasons}
                        isRestrictionJustificationEnabled={isRestrictionJustificationEnabled}
                        justificationReasons={justificationReasons}
                        onRemoveRestrictedContacts={this.handleRemoveRestrictedContacts}
                        restrictedEmails={restrictedEmails}
                        restrictedGroups={restrictedGroups}
                        selectedContacts={selectedContacts}
                        selectedJustificationReason={selectedJustificationReason}
                        onSelectJustificationReason={this.handleSelectJustificationReason}
                    />
                )}
                {contactsFieldAvatars}
                {contactsFieldWrap}
                {children}
                {isExpanded && !hideMessageSection && (
                    <TextArea
                        data-testid="be-emailform-message"
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

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
import hasRestrictedExternalContacts from './utils/hasRestrictedExternalContacts';
import messages from './messages';
import type { SuggestedCollabLookup, contactType as Contact, USMConfig } from './flowTypes';
import type { SelectOptionProp } from '../../components/select-field/props';

type Props = {
    cancelButtonProps?: Object,
    children?: React.Node,
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
    restrictedExternalEmails: Array<string>,
    selectedContacts: Array<Contact>,
    sendButtonProps?: Object,
    shouldRequireExternalContactJustification: boolean,
    showEnterEmailsCallout: boolean,
    submitting: boolean,
    suggestedCollaborators?: SuggestedCollabLookup,
    updateSelectedContacts: Function,
};

type State = {
    contactsFieldError: string,
    justificationReasonsFieldError: string,
    message: string,
    selectedJustificationReason: ?SelectOptionProp,
};

class EmailForm extends React.Component<Props, State> {
    static defaultProps = {
        messageProps: {},
        contactsFieldDisabledTooltip: null,
        justificationReasons: [],
        restrictedExternalEmails: [],
        shouldRequireExternalContactJustification: false,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            contactsFieldError: '',
            justificationReasonsFieldError: '',
            message: '',
            selectedJustificationReason: null,
        };
    }

    contactsFieldRef: {
        current: null | PillSelectorDropdown,
    } = React.createRef();

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { shouldRequireExternalContactJustification } = this.props;
        const { shouldRequireExternalContactJustification: prevShouldRequireExternalContactJustification } = prevProps;
        const { contactsFieldError, justificationReasonsFieldError } = this.state;
        const {
            contactsFieldError: prevContactsFieldError,
            justificationReasonsFieldError: prevJustificationReasonsFieldError,
        } = prevState;

        // Only display one type of error at a time and give preference
        // to the one triggered most recently
        if (!prevContactsFieldError && contactsFieldError) {
            this.setState({ justificationReasonsFieldError: '' });
        }
        if (!prevJustificationReasonsFieldError && justificationReasonsFieldError) {
            this.setState({ contactsFieldError: '' });
        }

        const didJustificationRequirementChange =
            shouldRequireExternalContactJustification !== prevShouldRequireExternalContactJustification;

        // Clear selected justification when form state is reset
        if (didJustificationRequirementChange && !shouldRequireExternalContactJustification) {
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

    handleRemoveRestrictedExternalContacts = () => {
        const { onContactRemove, selectedContacts, updateSelectedContacts } = this.props;

        const [removedContacts, remainingContacts] = partition(selectedContacts, ({ value }) =>
            this.isRestrictedExternalEmail(value),
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

    validateJustificationReason = () => {
        let justificationReasonsFieldError = '';
        const { selectedJustificationReason } = this.state;
        const { intl, shouldRequireExternalContactJustification } = this.props;

        const isMissingRequiredJustification =
            shouldRequireExternalContactJustification && !selectedJustificationReason;

        if (isMissingRequiredJustification) {
            justificationReasonsFieldError = intl.formatMessage(messages.justificationRequiredError);
        }

        this.setState({ justificationReasonsFieldError });

        return justificationReasonsFieldError;
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
        this.setState({ selectedJustificationReason }, this.validateJustificationReason);
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
        const justificationReasonError = this.validateJustificationReason();

        if (contactsError || justificationReasonError) {
            return;
        }

        const emails = [];
        const groupIDs = [];
        const restrictedExternalEmails = [];

        selectedContacts.forEach(({ type, value }) => {
            if (type === 'group') {
                groupIDs.push(value);
            } else {
                if (this.isRestrictedExternalEmail(value)) {
                    restrictedExternalEmails.push(value);
                }
                emails.push(value);
            }
        });

        onSubmit({
            emails,
            groupIDs,
            justificationReason: selectedJustificationReason,
            message,
            restrictedExternalEmails,
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
        const { shouldRequireExternalContactJustification } = this.props;

        if (isString(contactPill)) {
            // If we receive a string it means we're validating unparsed
            // pill selector input. Check that we have a valid email
            isValid = emailValidator(contactPill);
        } else {
            const hasRequiredJustification = !!selectedJustificationReason && shouldRequireExternalContactJustification;
            // Invalid emails are filtered out by ContactsField when parsing
            // new pills, so parsed pills can currently only be invalid
            // when user is external and external collab is restricted
            isValid = !this.isRestrictedExternalEmail(contactPill.value) || hasRequiredJustification;
        }
        return isValid;
    };

    isRestrictedExternalEmail = (email?: string) => {
        const { restrictedExternalEmails } = this.props;

        return restrictedExternalEmails.includes(email);
    };

    render() {
        const { contactsFieldError, justificationReasonsFieldError, message, selectedJustificationReason } = this.state;

        const {
            cancelButtonProps,
            children,
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
            justificationReasons,
            messageProps,
            onPillCreate,
            recommendedSharingTooltipCalloutName,
            restrictedExternalEmails,
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
            isExpanded && hasRestrictedExternalContacts(selectedContacts, restrictedExternalEmails);

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
                        error={justificationReasonsFieldError}
                        isLoading={isFetchingJustificationReasons}
                        justificationReasons={justificationReasons}
                        onRemoveRestrictedExternalContacts={this.handleRemoveRestrictedExternalContacts}
                        restrictedExternalEmails={restrictedExternalEmails}
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

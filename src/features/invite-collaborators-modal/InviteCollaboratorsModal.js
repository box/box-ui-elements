import PropTypes from 'prop-types';
import React, { Component } from 'react';
import omit from 'lodash/omit';
import throttle from 'lodash/throttle';
import { FormattedMessage, injectIntl } from 'react-intl';

import { UpgradeBadge } from '../../components/badge';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import InlineNotice from '../../components/inline-notice';
import PrimaryButton from '../../components/primary-button';
import Select from '../../components/select';
import TextArea from '../../components/text-area';
import { Link } from '../../components/link';
import { Modal, ModalActions } from '../../components/modal';
import ContactDatalistItem from '../../components/contact-datalist-item';
import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import parseEmails from '../../utils/parseEmails';
import { RESIN_TAG_TARGET } from '../../common/variables';

import PermissionFlyout from './PermissionFlyout';
import ReferAFriendAd from './ReferAFriendAd';
import messages from './messages';
import commonMessages from '../../common/messages';

import './InviteCollaboratorsModal.scss';

const COLLAB_ROLE_FOR_FILE = 'Editor';
const INPUT_DELAY = 250;

/**
 * Returns true if the given value is a substring of the searchString
 * @param {String} value
 * @param {String} searchString
 * @return {boolean}
 */
const isSubstring = (value, searchString) => value && value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
class InviteCollaboratorsModal extends Component {
    static propTypes = {
        /** Message warning about restrictions regarding inviting collaborators to the item */
        collaborationRestrictionWarning: PropTypes.node,
        /** An array of contacts for the pill selector dropdown */
        contacts: PropTypes.arrayOf(
            PropTypes.shape({
                email: PropTypes.string,
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isrequired,
                name: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
            }),
        ).isRequired,
        /**
         * Default personal message for inviting collaborators to the item.
         * Do not include if no personal message textarea should show up.
         * Only applicable to non-file item types.
         * */
        defaultPersonalMessage: PropTypes.node,
        intl: PropTypes.any,
        /** Props for the invite button */
        inviteButtonProps: PropTypes.object,
        /** An array of invitee permissions */
        inviteePermissions: PropTypes.arrayOf(
            PropTypes.shape({
                disabled: PropTypes.bool,
                text: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            }),
        ),
        /** If true, will render a link to the refer-a-friend reward center */
        isEligibleForReferAFriendProgram: PropTypes.bool,
        /** The name of the item to invite collaborators for */
        itemName: PropTypes.string.isRequired,
        /** The type of the item to invite collaborators for (e.g. "file", "folder") */
        itemType: PropTypes.string.isRequired,
        /** The typed id of the item to invite collaborators for */
        itemTypedID: PropTypes.string.isRequired,
        /** Handler function for closing the modal */
        onRequestClose: PropTypes.func.isRequired,
        /** Handler function whenever the user types, e.g. to fetch contacts. */
        onUserInput: PropTypes.func,
        /**
         * Function to send collab invitations based on the given parameters object.
         * This function should return a Promise.
         */
        sendInvites: PropTypes.func.isRequired,
        /**
         * Flag to show link to upgrade and get more access controls.
         * Only applicable to non-file item types.
         */
        showUpgradeOptions: PropTypes.bool,
        /** Message indicating an error occurred while sending the invites. */
        submissionError: PropTypes.node,
        /**
         * Flag indicating whether the send invites request is submitting.
         */
        submitting: PropTypes.bool,
    };

    static defaultProps = {
        inviteButtonProps: {},
    };

    constructor(props) {
        super(props);
        const { defaultPersonalMessage, inviteePermissions } = props;
        this.state = {
            message: defaultPersonalMessage || '',
            permission: inviteePermissions ? inviteePermissions[0].value : COLLAB_ROLE_FOR_FILE,
            pillSelectorError: '',
            pillSelectorInputValue: '',
            selectedOptions: [],
        };
    }

    getSelectorOptions = () => {
        const { contacts } = this.props;
        const { pillSelectorInputValue, selectedOptions } = this.state;

        if (pillSelectorInputValue !== '') {
            return contacts
                .filter(
                    // filter contacts whose name or email don't match input value
                    ({ name, email }) =>
                        isSubstring(name, pillSelectorInputValue) || isSubstring(email, pillSelectorInputValue),
                )
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

    closeModal = () => {
        this.setState({
            pillSelectorError: '',
            pillSelectorInputValue: '',
            selectedOptions: [],
        });
        this.props.onRequestClose();
    };

    sendInvites = () => {
        const { intl, sendInvites } = this.props;
        const { message, permission, pillSelectorError, selectedOptions } = this.state;

        if (pillSelectorError) {
            // Block submission if there's a validation error
            return;
        }

        if (selectedOptions.length === 0) {
            // Block submission if no pills are selected
            this.setState({
                pillSelectorError: intl.formatMessage(commonMessages.requiredFieldError),
            });
            return;
        }

        const emails = [];
        const groupIDs = [];
        selectedOptions.forEach(({ type, value }) => {
            if (type === 'group') {
                groupIDs.push(value);
            } else {
                emails.push(value);
            }
        });

        const params = {
            emails: emails.join(','),
            groupIDs: groupIDs.join(','),
            emailMessage: message,
            permission: permission || COLLAB_ROLE_FOR_FILE,
            numsOfInvitees: emails.length,
            numOfInviteeGroups: groupIDs.length,
        };
        sendInvites(params).catch(error => {
            // Remove invited emails from selected pills
            const invitedEmails = error.invitedEmails || [];
            this.filterInvitedEmails(invitedEmails);
        });
    };

    filterInvitedEmails = invitedEmails => {
        this.setState({
            selectedOptions: this.state.selectedOptions.filter(({ value }) => !invitedEmails.includes(value)),
        });
    };

    handlePillSelectorInput = throttle(value => {
        const { onUserInput } = this.props;
        if (onUserInput) {
            onUserInput(value);
        }

        // As user is typing, reset error
        this.setState({ pillSelectorError: '', pillSelectorInputValue: value });
    }, INPUT_DELAY);

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
        const { intl } = this.props;
        let pillSelectorError = '';

        if (text && !this.validator(text)) {
            pillSelectorError = intl.formatMessage(commonMessages.invalidEmailError);
        }

        this.setState({ pillSelectorError });
    };

    validator = text => {
        // email input validation
        const pattern = /^[^\s<>@,]+@[^\s<>@,/\\]+\.[^\s<>@,]+$/i;
        return pattern.test(text);
    };

    handlePermissionChange = ({ target }) => {
        const { value } = target;
        this.setState({ permission: value });
    };

    handleMessageChange = ({ target }) => {
        const { value } = target;
        this.setState({ message: value });
    };

    renderFileCollabComponents() {
        return (
            <div className="invite-file-editors">
                <FormattedMessage {...messages.inviteFileEditorsLabel} />
            </div>
        );
    }

    renderPermissionsSection() {
        const { inviteePermissions } = this.props;
        return (
            <div className="invite-permissions-container">
                <Select
                    className="select-container-medium"
                    data-resin-target="selectpermission"
                    label={<FormattedMessage {...messages.inviteePermissionsFieldLabel} />}
                    name="invite-permission"
                    onChange={this.handlePermissionChange}
                >
                    {inviteePermissions.map(({ value, disabled = false, text }) => (
                        <option key={value} data-resin-option={value} disabled={disabled} value={value}>
                            {text}
                        </option>
                    ))}
                </Select>
                <PermissionFlyout />
            </div>
        );
    }

    renderFolderCollabComponents() {
        const { defaultPersonalMessage, inviteePermissions, showUpgradeOptions } = this.props;
        return (
            <div>
                {inviteePermissions && this.renderPermissionsSection()}
                {showUpgradeOptions && (
                    <Link className="upgrade-link" href="/upgrade">
                        <UpgradeBadge />
                        <FormattedMessage {...messages.upgradeGetMoreAccessControls} />
                    </Link>
                )}
                {defaultPersonalMessage && (
                    <TextArea
                        cols="30"
                        data-resin-feature="personalmessage"
                        data-resin-target="message"
                        defaultValue={defaultPersonalMessage}
                        label={<FormattedMessage {...messages.personalMessageLabel} />}
                        name="collab-message"
                        onChange={this.handleMessageChange}
                        rows="4"
                    />
                )}
            </div>
        );
    }

    render() {
        const {
            collaborationRestrictionWarning,
            intl,
            inviteButtonProps,
            isEligibleForReferAFriendProgram,
            itemName,
            itemType,
            submissionError,
            submitting,
            ...rest
        } = this.props;
        const { pillSelectorError, selectedOptions } = this.state;
        const modalProps = omit(rest, [
            'contacts',
            'defaultPersonalMessage',
            'inviteePermissions',
            'itemTypedID',
            'onRequestClose',
            'onUserInput',
            'sendInvites',
            'showUpgradeOptions',
        ]);

        const selectorOptions = this.getSelectorOptions();

        const title = (
            <FormattedMessage
                {...messages.inviteCollaboratorsModalTitle}
                values={{
                    itemName,
                }}
            />
        );

        const groupLabel = <FormattedMessage {...messages.groupLabel} />;

        return (
            <Modal
                className="invite-collaborators-modal"
                closeButtonProps={{
                    [RESIN_TAG_TARGET]: 'close',
                }}
                data-resin-component="modal"
                data-resin-feature="invitecollaborators"
                onRequestClose={this.closeModal}
                title={title}
                {...modalProps}
            >
                {submissionError && <InlineNotice type="error">{submissionError}</InlineNotice>}
                {collaborationRestrictionWarning && (
                    <InlineNotice type="warning">{collaborationRestrictionWarning}</InlineNotice>
                )}
                <PillSelectorDropdown
                    allowCustomPills
                    error={pillSelectorError}
                    label={<FormattedMessage {...messages.inviteFieldLabel} />}
                    onInput={this.handlePillSelectorInput}
                    onRemove={this.handlePillRemove}
                    onSelect={this.handlePillSelect}
                    parseItems={parseEmails}
                    placeholder={intl.formatMessage(commonMessages.pillSelectorPlaceholder)}
                    selectedOptions={selectedOptions}
                    selectorOptions={selectorOptions}
                    validateForError={this.validateForError}
                    validator={this.validator}
                >
                    {selectorOptions.map(({ email, text, value }) => (
                        <ContactDatalistItem key={value} name={text} subtitle={email || groupLabel} />
                    ))}
                </PillSelectorDropdown>
                {itemType === 'file' ? this.renderFileCollabComponents() : this.renderFolderCollabComponents()}
                {isEligibleForReferAFriendProgram && <ReferAFriendAd />}
                <ModalActions>
                    <ButtonAdapter
                        data-resin-target="cancel"
                        isDisabled={submitting}
                        onClick={this.closeModal}
                        type={ButtonType.BUTTON}
                    >
                        <FormattedMessage {...messages.inviteCollaboratorsModalCancelButton} />
                    </ButtonAdapter>
                    <PrimaryButton
                        {...inviteButtonProps}
                        isDisabled={submitting}
                        isLoading={submitting}
                        onClick={this.sendInvites}
                        type={ButtonType.BUTTON}
                    >
                        <FormattedMessage {...messages.inviteCollaboratorsModalSendInvitesButton} />
                    </PrimaryButton>
                </ModalActions>
            </Modal>
        );
    }
}

export { InviteCollaboratorsModal as InviteCollaboratorsModalBase };
export default injectIntl(InviteCollaboratorsModal);

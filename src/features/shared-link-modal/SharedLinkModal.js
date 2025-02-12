/* @flow */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import { Modal, ModalActions } from '../../components/modal';
import commonMessages from '../../common/messages';

import SharedLink from './SharedLink';
import EmailSharedLink from './EmailSharedLink';
import messages from './messages';
import { accessLevelPropType, allowedAccessLevelsPropType, permissionLevelPropType } from './propTypes';

type Props = {
    /** Current access level for this item; one of 'peopleWithTheLink' | 'peopleInYourCompany' | 'peopleInThisItem' */
    accessLevel?: accessLevelPropType,
    accessMenuButtonProps?: Object,
    /** The selectable access levels. Should be an object { peopleWithTheLink: true/false, peopleInYourCompany: true/false, peopleInThisItem: true/false } */
    allowedAccessLevels?: allowedAccessLevelsPropType,
    /** Determines whether or not user is allowed to remove shared link */
    canRemoveLink?: boolean,
    /** Function that changes access level; (newAccessLevel: 'peopleWithTheLink' | 'peopleInYourCompany' | 'peopleInThisItem') => void */
    changeAccessLevel: Function,
    /** Function that changes permission level; (newPermissionLevel: 'canView' | 'canEdit') => void. If not provided, then the permission menu won't show up. */
    changePermissionLevel?: Function,
    /** An array of contacts for the pill selector dropdown. If not provided, "Email Shared Link" section will not appear. */
    contacts?: Array<{
        email?: string,
        id: number | string,
        name: string,
        type: string,
    }>,
    copyButtonProps?: Object,
    /** Default "send shared link" email message */
    defaultEmailMessage?: string,
    emailMessageProps?: Object,
    enterpriseName?: string,
    /** Timestamp for shared link expiration date. If not provided, expiration icon will not be shown. */
    expiration?: number,
    /** Handler function whenever the user types to fetch contacts. If not provided, "Email Shared Link" section will not appear. */
    getContacts?: Function,
    isDownloadAllowed?: boolean,
    isEditAllowed?: boolean,
    isOpen?: boolean,
    isPreviewAllowed?: boolean,
    itemName: string,
    itemType: 'folder' | 'file' | 'weblink',
    modalProps?: Object,
    onCopySuccess?: Function,
    onRequestClose: Function,
    /** Handler for clicks on the settings icon. If not provided, the settings icon won't be rendered. */
    onSettingsClick?: Function,
    /** Current permission level for this item; one of 'canView' | 'canEdit'. If not provided, then the permission menu won't show up. */
    permissionLevel?: permissionLevelPropType,
    /** Function that removes the shared link; () => void */
    removeLink: Function,
    removeLinkButtonProps?: Object,
    /** Function to send the shared link to the entered emails. Calls function with an object in the format { emails: Array<string>, emailMessage: string }.
     *  If not provided, "Email Shared Link" section will not appear. */
    sendEmail?: Function,
    /** Share URL of the item */
    sharedLink: string,
    /** Whether or not a request is in progress */
    submitting?: boolean,
};

type State = {
    isEmailSharedLinkExpanded: boolean,
};

class SharedLinkModal extends Component<Props, State> {
    state = {
        isEmailSharedLinkExpanded: false,
    };

    handleEmailSharedLinkExpand = () => {
        this.setState({ isEmailSharedLinkExpanded: true });
    };

    renderSharedLink() {
        const {
            accessLevel,
            accessMenuButtonProps,
            allowedAccessLevels,
            canRemoveLink,
            changeAccessLevel,
            changePermissionLevel,
            copyButtonProps,
            enterpriseName,
            expiration,
            isDownloadAllowed,
            isEditAllowed,
            isPreviewAllowed,
            itemType,
            onCopySuccess,
            onSettingsClick,
            permissionLevel,
            removeLink,
            removeLinkButtonProps,
            sharedLink,
            submitting,
        } = this.props;
        return (
            <SharedLink
                accessLevel={accessLevel}
                accessMenuButtonProps={accessMenuButtonProps}
                allowedAccessLevels={allowedAccessLevels}
                canRemoveLink={canRemoveLink}
                changeAccessLevel={changeAccessLevel}
                changePermissionLevel={changePermissionLevel}
                copyButtonProps={copyButtonProps}
                enterpriseName={enterpriseName}
                expiration={expiration}
                isDownloadAllowed={isDownloadAllowed}
                isEditAllowed={isEditAllowed}
                isPreviewAllowed={isPreviewAllowed}
                itemType={itemType}
                onCopySuccess={onCopySuccess}
                onSettingsClick={onSettingsClick}
                permissionLevel={permissionLevel}
                removeLink={removeLink}
                removeLinkButtonProps={removeLinkButtonProps}
                sharedLink={sharedLink}
                submitting={submitting}
            />
        );
    }

    renderEmailSharedLink() {
        const { contacts, defaultEmailMessage, emailMessageProps, getContacts, onRequestClose, sendEmail, submitting } =
            this.props;

        if (!getContacts || !contacts || !sendEmail) {
            return null;
        }

        return (
            <EmailSharedLink
                contacts={contacts}
                defaultEmailMessage={defaultEmailMessage}
                emailMessageProps={emailMessageProps}
                getContacts={getContacts}
                isExpanded={this.state.isEmailSharedLinkExpanded}
                sendEmail={sendEmail}
                onRequestClose={onRequestClose}
                submitting={submitting}
                onExpand={this.handleEmailSharedLinkExpand}
            />
        );
    }

    render() {
        const { isOpen, itemName, modalProps, onRequestClose, submitting } = this.props;
        const { isEmailSharedLinkExpanded } = this.state;

        return (
            <Modal
                className="shared-link-modal"
                focusElementSelector=".shared-link-container input"
                isOpen={isOpen}
                onRequestClose={submitting ? undefined : onRequestClose}
                title={
                    <FormattedMessage
                        {...messages.sharedLinkModalTitle}
                        values={{
                            itemName,
                        }}
                    />
                }
                {...modalProps}
            >
                {this.renderSharedLink()}
                <hr />
                {this.renderEmailSharedLink()}
                {!isEmailSharedLinkExpanded && (
                    <ModalActions>
                        <ButtonAdapter isDisabled={submitting} onClick={onRequestClose} type={ButtonType.BUTTON}>
                            <FormattedMessage {...commonMessages.close} />
                        </ButtonAdapter>
                    </ModalActions>
                )}
            </Modal>
        );
    }
}

export default SharedLinkModal;

// @flow

'no babel-plugin-flow-react-proptypes';

// turn off this plugin because it breaks the IntlShape flow type
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import { Modal } from '../../components/modal';
import { Link } from '../../components/link';
import Button from '../../components/button';
import { UpgradeBadge, BetaBadge } from '../../components/badge';
import { ITEM_TYPE_WEBLINK } from '../../common/constants';
import Tooltip from '../../components/tooltip';
import { CollaboratorAvatars, CollaboratorList } from '../collaborator-avatars';

import InviteePermissionsMenu from './InviteePermissionsMenu';
import messages from './messages';
import RemoveLinkConfirmModal from './RemoveLinkConfirmModal';
import SharedLinkSection from './SharedLinkSection';
import EmailForm from './EmailForm';
import type {
    accessLevelType,
    collaboratorsListType,
    permissionLevelType,
    inviteePermissionType as InviteePermissions,
    item as ItemType,
    contactType as Contact,
    trackingPropsType,
    sharedLinkType,
} from './flowTypes';
import { EDITOR } from './constants';

import './UnifiedShareModal.scss';

type Props = {
    /** Flag to determine whether to enable invite collaborators section */
    canInvite: boolean,
    /** Handler function that changes shared link access level */
    changeSharedLinkAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>,
    /** Handler function that changes shared link permission level */
    changeSharedLinkPermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>,
    /** If item is classified this property contains the classification name */
    classificationName?: string,
    /** List of existing collaborators */
    collaborationRestrictionWarning: React.Node,
    /** Message warning about restrictions regarding inviting collaborators to the item */
    collaboratorsList?: collaboratorsListType,
    /** User ID of currently logged in user */
    currentUserID: string,
    /** Handler function for when the user types into invite collaborators field to fetch contacts. */
    focusSharedLinkOnLoad?: boolean,
    /** Handler function for when the user types into email shared link field to fetch contacts. */
    getCollaboratorContacts: (query: string) => Promise<Array<Contact>>,
    /** Whether the modal should focus the shared link after the URL is resolved */
    getInitialData: Function,
    /** Handler function for getting intial data for modal */
    getSharedLinkContacts: (query: string) => Promise<Array<Contact>>,
    intl: IntlShape,
    /** An array of invitee permissions */
    inviteePermissions: Array<InviteePermissions>,
    /** Flag to set whether the unified share modal is open */
    isOpen: boolean,
    /** Item data */
    item: ItemType,
    /** Handler function that adds the shared link */
    onAddLink: () => void,
    /** Handler function that removes the shared link */
    onRemoveLink: () => void,
    /** Handler function for when modal is closed */
    onRequestClose?: Function,
    /** Handler function for clicks on the settings icon. If not provided, the settings icon won't be rendered. */
    onSettingsClick?: Function,
    /** Shared link data */
    sendInvites: (params: Object) => Promise<Object>,
    /**
     * Function to send collab invitations based on the given parameters object.
     * This function should return a Promise.
     */
    sendInvitesError: React.Node,
    /** Message indicating an error occurred while sending the invites. */
    sendSharedLink: (params: Object) => Promise<Object>,
    /**
     * Function to send shared link email based on the given parameters object.
     * This function should return a Promise.
     */
    sendSharedLinkError: React.Node,
    /** Function hoists contact data upon updates to the parent component. Only needed for suggested collabs. */
    setUpdatedContacts?: (inviteCollabsContacts: Array<Contact>) => void,
    /** Message indicating an error occurred while sending the shared link. */
    sharedLink: sharedLinkType,
    /** Determine whether to show the First-time experience tooltip on load */
    showCalloutForUser?: boolean,
    /** Shows a callout tooltip next to the names / email addresses input field encouraging users to fill out coworkers contact info */
    showEnterEmailsCallout?: boolean,
    /** Shows a callout tooltip next gear icon with info about what can be customized */
    showSharedLinkSettingsCallout?: boolean,
    /**
     * Flag to show link to upgrade and get more access controls.
     * Only applicable to non-file item types.
     */
    showUpgradeOptions: boolean,
    /** Whether or not a request is in progress */
    submitting: boolean,
    /** Data for suggested collaborators shown at bottom of input box. UI doesn't render when this has length of 0. */
    suggestedCollaborators?: Array<Object>,
    /** Object with props and handlers for tracking interactions in unified share modal */
    trackingProps: trackingPropsType,
};

type State = {
    emailSharedLinkContacts: Array<Contact>,
    getInitialDataCalled: boolean,
    inviteCollabsContacts: Array<Contact>,
    inviteePermissionLevel: string,
    isConfirmModalOpen: boolean,
    isEmailLinkSectionExpanded: boolean,
    isFetching: boolean,
    isInviteSectionExpanded: boolean,
    sharedLinkLoaded: boolean,
    shouldRenderFTUXTooltip: boolean,
    showCollaboratorList: boolean,
};

class UnifiedShareModal extends React.Component<Props, State> {
    static defaultProps = {
        trackingProps: {
            inviteCollabsEmailTracking: {},
            sharedLinkEmailTracking: {},
            sharedLinkTracking: {},
            inviteCollabTracking: {},
            modalTracking: {},
            removeLinkConfirmModalTracking: {},
            collaboratorListTracking: {},
        },
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            emailSharedLinkContacts: [],
            inviteCollabsContacts: [],
            inviteePermissionLevel: EDITOR,
            isConfirmModalOpen: false,
            isEmailLinkSectionExpanded: false,
            isFetching: true,
            isInviteSectionExpanded: false,
            showCollaboratorList: false,
            getInitialDataCalled: false,
            shouldRenderFTUXTooltip: false,
            sharedLinkLoaded: false,
        };
    }

    componentDidMount() {
        const { item, trackingProps } = this.props;
        const { type, typedID } = item;
        const { modalTracking } = trackingProps;
        const { onLoad } = modalTracking;
        const { getInitialDataCalled } = this.state;

        // This check is to ensure minimum item props are
        // hydrated before we fetch data
        if (!getInitialDataCalled && type && typedID) {
            this.getInitialData();
        }

        if (onLoad) {
            onLoad();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { item, sharedLink } = this.props;
        const { type, typedID } = item;
        const prevSharedLink = prevProps.sharedLink;
        const { getInitialDataCalled } = this.state;

        // This check is to ensure minimum item props are
        // hydrated before we fetch data
        if (!getInitialDataCalled && type && typedID) {
            this.getInitialData();
        }

        // we use state to override the default auto copy prop when a URL comes into view
        if (prevSharedLink.url !== sharedLink.url && sharedLink.url) {
            this.setState({ sharedLinkLoaded: true });
        }
    }

    getInitialData = () => {
        const { getInitialData } = this.props;

        getInitialData().finally(() => {
            this.setState({
                isFetching: false,
                shouldRenderFTUXTooltip: true,
            });
        });
        this.setState({ getInitialDataCalled: true });
    };

    onToggleSharedLink = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const { target } = event;
        const { onAddLink, trackingProps } = this.props;
        const { shouldRenderFTUXTooltip } = this.state;
        const { sharedLinkTracking } = trackingProps;
        const { onToggleLink } = sharedLinkTracking;

        if (shouldRenderFTUXTooltip) {
            this.setState({ shouldRenderFTUXTooltip: false });
        }

        if (target.type === 'checkbox') {
            if (target.checked === false) {
                this.openConfirmModal();
            } else {
                onAddLink();
            }

            if (onToggleLink) {
                onToggleLink(target.checked);
            }
        }
    };

    openConfirmModal = () => {
        this.setState({ isConfirmModalOpen: true });
    };

    closeConfirmModal = () => {
        this.setState({ isConfirmModalOpen: false });
    };

    showCollaboratorList = () => {
        this.setState({ showCollaboratorList: true });
    };

    closeCollaboratorList = () => {
        this.setState({ showCollaboratorList: false });
    };

    handleSendInvites = (data: Object) => {
        const { sendInvites, trackingProps } = this.props;
        const { inviteCollabsEmailTracking } = trackingProps;
        const { onSendClick } = inviteCollabsEmailTracking;
        const { inviteePermissionLevel } = this.state;
        const { emails, groupIDs, message } = data;
        const params = {
            emails: emails.join(','),
            groupIDs: groupIDs.join(','),
            emailMessage: message,
            permission: inviteePermissionLevel,
            numsOfInvitees: emails.length,
            numOfInviteeGroups: groupIDs.length,
        };

        if (onSendClick) {
            onSendClick(params);
        }

        return sendInvites(params);
    };

    handleSendSharedLink = (data: Object) => {
        const { sendSharedLink, trackingProps } = this.props;
        const { sharedLinkEmailTracking } = trackingProps;
        const { onSendClick } = sharedLinkEmailTracking;

        const { emails, groupIDs } = data;

        if (onSendClick) {
            const params = {
                ...data,
                numsOfRecipients: emails.length,
                numOfRecipientGroups: groupIDs.length,
            };
            onSendClick(params);
        }

        return sendSharedLink(data);
    };

    // TODO-AH: Change permission level to use the appropriate flow type
    handleInviteePermissionChange = (permissionLevel: string) => {
        const { trackingProps } = this.props;
        const { inviteCollabTracking } = trackingProps;
        const { onInviteePermissionChange } = inviteCollabTracking;

        this.setState({ inviteePermissionLevel: permissionLevel });

        if (onInviteePermissionChange) {
            onInviteePermissionChange(permissionLevel);
        }
    };

    handleFtuxCloseClick = () => {
        this.setState({
            shouldRenderFTUXTooltip: false,
        });
    };

    openInviteCollaborators = (value: string) => {
        if (this.state.isInviteSectionExpanded) {
            return;
        }

        // checking the value because IE seems to trigger onInput immediately
        // on focus of the contacts field
        if (value !== '') {
            this.setState(
                {
                    shouldRenderFTUXTooltip: false,
                    isInviteSectionExpanded: true,
                },
                () => {
                    const {
                        trackingProps: {
                            inviteCollabTracking: { onEnterInviteCollabs },
                        },
                    } = this.props;

                    if (onEnterInviteCollabs) {
                        onEnterInviteCollabs();
                    }
                },
            );
        }
    };

    openInviteCollaboratorsSection = () => {
        this.setState({
            isInviteSectionExpanded: true,
        });
    };

    closeInviteCollaborators = () => {
        this.setState({
            isInviteSectionExpanded: false,
        });
    };

    openEmailSharedLinkForm = () => {
        this.setState({
            isEmailLinkSectionExpanded: true,
            shouldRenderFTUXTooltip: false,
        });
    };

    closeEmailSharedLinkForm = () => {
        this.setState({ isEmailLinkSectionExpanded: false });
    };

    updateInviteCollabsContacts = (inviteCollabsContacts: Array<Contact>) => {
        const { setUpdatedContacts } = this.props;
        this.setState({ inviteCollabsContacts });
        if (setUpdatedContacts) {
            setUpdatedContacts(inviteCollabsContacts);
        }
    };

    updateEmailSharedLinkContacts = (emailSharedLinkContacts: Array<Contact>) => {
        this.setState({ emailSharedLinkContacts });
    };

    renderInviteSection() {
        const {
            canInvite,
            collaborationRestrictionWarning,
            getCollaboratorContacts,
            item,
            sendInvitesError,
            showEnterEmailsCallout = false,
            showCalloutForUser = false,
            showUpgradeOptions,
            submitting,
            suggestedCollaborators,
            trackingProps,
        } = this.props;
        const { type } = item;
        const { isInviteSectionExpanded, shouldRenderFTUXTooltip } = this.state;
        const { inviteCollabsEmailTracking, modalTracking } = trackingProps;
        const contactsFieldDisabledTooltip =
            type === ITEM_TYPE_WEBLINK ? (
                <FormattedMessage {...messages.inviteDisabledWeblinkTooltip} />
            ) : (
                <FormattedMessage {...messages.inviteDisabledTooltip} />
            );
        const inlineNotice = sendInvitesError
            ? {
                  type: 'error',
                  content: sendInvitesError,
              }
            : {
                  type: 'warning',
                  content: collaborationRestrictionWarning,
              };
        const avatars = this.renderCollaboratorAvatars();
        const { ftuxConfirmButtonProps } = modalTracking;
        const ftuxTooltipText = (
            <div>
                <h4 className="ftux-tooltip-title">
                    <FormattedMessage {...messages.ftuxNewUSMUserTitle} />
                </h4>
                <p className="ftux-tooltip-body">
                    <FormattedMessage {...messages.ftuxNewUSMUserBody} />
                </p>
                <div className="ftux-tooltip-controls">
                    <Button
                        className="ftux-tooltip-button"
                        onClick={this.handleFtuxCloseClick}
                        {...ftuxConfirmButtonProps}
                    >
                        <FormattedMessage {...messages.ftuxConfirmLabel} />
                    </Button>
                </div>
            </div>
        );

        return (
            <React.Fragment>
                <Tooltip
                    className="usm-ftux-tooltip"
                    isShown={shouldRenderFTUXTooltip && showCalloutForUser}
                    position="middle-left"
                    showCloseButton
                    text={ftuxTooltipText}
                    theme="callout"
                >
                    <div className="invite-collaborator-container">
                        <EmailForm
                            contactsFieldAvatars={avatars}
                            contactsFieldDisabledTooltip={contactsFieldDisabledTooltip}
                            contactsFieldLabel={<FormattedMessage {...messages.inviteFieldLabel} />}
                            getContacts={getCollaboratorContacts}
                            inlineNotice={inlineNotice}
                            isContactsFieldEnabled={canInvite}
                            isExpanded={isInviteSectionExpanded}
                            onContactInput={this.openInviteCollaborators}
                            onRequestClose={this.closeInviteCollaborators}
                            onSubmit={this.handleSendInvites}
                            openInviteCollaboratorsSection={this.openInviteCollaboratorsSection}
                            showEnterEmailsCallout={showEnterEmailsCallout}
                            submitting={submitting}
                            selectedContacts={this.state.inviteCollabsContacts}
                            suggestedCollaborators={suggestedCollaborators}
                            updateSelectedContacts={this.updateInviteCollabsContacts}
                            {...inviteCollabsEmailTracking}
                        >
                            {this.renderInviteePermissionsDropdown()}
                            {isInviteSectionExpanded && showUpgradeOptions && this.renderUpgradeLinkDescription()}
                        </EmailForm>
                    </div>
                </Tooltip>
            </React.Fragment>
        );
    }

    renderCollaboratorAvatars() {
        const { collaboratorsList, canInvite, currentUserID, item, trackingProps } = this.props;
        const { modalTracking } = trackingProps;
        let avatarsContent = null;

        if (collaboratorsList) {
            const { collaborators } = collaboratorsList;
            const { hideCollaborators = true } = item;
            const canShowCollaboratorAvatars = hideCollaborators ? canInvite : true;

            // filter out the current user by comparing to the ItemCollabRecord ID field
            avatarsContent = canShowCollaboratorAvatars && (
                <CollaboratorAvatars
                    collaborators={collaborators.filter(collaborator => String(collaborator.userID) !== currentUserID)}
                    onClick={this.showCollaboratorList}
                    containerAttributes={modalTracking.collaboratorAvatarsProps}
                />
            );
        }

        return avatarsContent;
    }

    renderUpgradeLinkDescription() {
        const { trackingProps = {} } = this.props;
        const { inviteCollabsEmailTracking = {} } = trackingProps;
        const { upgradeLinkProps = {} } = inviteCollabsEmailTracking;

        return (
            <div className="upgrade-description">
                <UpgradeBadge type="warning" />
                <FormattedMessage
                    values={{
                        upgradeGetMoreAccessControlsLink: (
                            <Link className="upgrade-link" href="/upgrade" {...upgradeLinkProps}>
                                <FormattedMessage {...messages.upgradeGetMoreAccessControlsLink} />
                            </Link>
                        ),
                    }}
                    {...messages.upgradeGetMoreAccessControlsDescription}
                />
            </div>
        );
    }

    renderInviteePermissionsDropdown() {
        const { inviteePermissions, item, submitting, canInvite, trackingProps } = this.props;
        const { type } = item;
        const { inviteCollabTracking } = trackingProps;

        return (
            inviteePermissions && (
                <InviteePermissionsMenu
                    disabled={!canInvite || submitting}
                    inviteePermissionsButtonProps={inviteCollabTracking.inviteePermissionsButtonProps}
                    inviteePermissionLevel={this.state.inviteePermissionLevel}
                    inviteePermissions={inviteePermissions}
                    changeInviteePermissionLevel={this.handleInviteePermissionChange}
                    itemType={type}
                />
            )
        );
    }

    renderModalTitle() {
        const { isEmailLinkSectionExpanded, showCollaboratorList } = this.state;
        const { item } = this.props;
        const { name } = item;
        let title;

        if (isEmailLinkSectionExpanded) {
            title = (
                <FormattedMessage
                    {...messages.emailModalTitle}
                    values={{
                        itemName: name,
                    }}
                />
            );
        } else if (showCollaboratorList) {
            title = (
                <FormattedMessage
                    {...messages.collaboratorListTitle}
                    values={{
                        itemName: name,
                    }}
                />
            );
        } else {
            title = (
                <FormattedMessage
                    {...messages.modalTitle}
                    values={{
                        itemName: name,
                    }}
                />
            );
        }

        return title;
    }

    renderCollaboratorList() {
        const { item, collaboratorsList, trackingProps } = this.props;
        const { name, type } = item;
        const { collaboratorListTracking } = trackingProps;
        let listContent = null;

        if (collaboratorsList) {
            const { collaborators } = collaboratorsList;

            listContent = (
                <CollaboratorList
                    itemName={name}
                    itemType={type}
                    onDoneClick={this.closeCollaboratorList}
                    item={item}
                    collaborators={collaborators}
                    trackingProps={collaboratorListTracking}
                />
            );
        }

        return listContent;
    }

    render() {
        // Shared link section props
        const {
            changeSharedLinkAccessLevel,
            changeSharedLinkPermissionLevel,
            classificationName,
            focusSharedLinkOnLoad,
            item,
            onSettingsClick,
            sharedLink,
            intl,
            showEnterEmailsCallout = false,
            showSharedLinkSettingsCallout = false,
            submitting,
            ...rest
        } = this.props;
        const {
            canInvite,
            getSharedLinkContacts,
            isOpen,
            onRequestClose,
            onRemoveLink,
            sendSharedLinkError,
            trackingProps,
        } = rest;
        const {
            modalTracking,
            sharedLinkTracking,
            sharedLinkEmailTracking,
            removeLinkConfirmModalTracking,
        } = trackingProps;
        const { modalProps } = modalTracking;
        const {
            isEmailLinkSectionExpanded,
            isFetching,
            isInviteSectionExpanded,
            isConfirmModalOpen,
            showCollaboratorList,
            sharedLinkLoaded,
        } = this.state;

        // focus logic at modal level
        const extendedModalProps = {
            focusElementSelector: canInvite
                ? '.pill-selector-input' // focus on invite collabs field
                : '.toggle-simple', // focus on shared link toggle
            ...modalProps,
        };

        const shouldAutoFocus =
            focusSharedLinkOnLoad === undefined ? sharedLinkLoaded : sharedLinkLoaded && focusSharedLinkOnLoad;

        return (
            <div>
                <Modal
                    className="unified-share-modal"
                    isOpen={isConfirmModalOpen ? false : isOpen}
                    onRequestClose={submitting ? undefined : onRequestClose}
                    title={
                        <span>
                            {this.renderModalTitle()}
                            <Tooltip
                                position="top-center"
                                text={<FormattedMessage {...messages.betaFeedbackCtaCopy} />}
                            >
                                <Link
                                    href="https://goo.gl/forms/B4n3aKozjGiejyMX2"
                                    target="blank"
                                    {...modalTracking.betaLabelProps}
                                >
                                    <BetaBadge />
                                </Link>
                            </Tooltip>
                        </span>
                    }
                    {...extendedModalProps}
                >
                    <LoadingIndicatorWrapper isLoading={isFetching} hideContent>
                        {!isEmailLinkSectionExpanded && !showCollaboratorList && this.renderInviteSection()}

                        {!isEmailLinkSectionExpanded && !isInviteSectionExpanded && !showCollaboratorList && (
                            <SharedLinkSection
                                autofocusSharedLink={shouldAutoFocus}
                                triggerCopyOnLoad={focusSharedLinkOnLoad}
                                changeSharedLinkAccessLevel={changeSharedLinkAccessLevel}
                                changeSharedLinkPermissionLevel={changeSharedLinkPermissionLevel}
                                classificationName={classificationName}
                                intl={intl}
                                item={item}
                                itemType={item.type}
                                onEmailSharedLinkClick={this.openEmailSharedLinkForm}
                                onSettingsClick={onSettingsClick}
                                onToggleSharedLink={this.onToggleSharedLink}
                                sharedLink={sharedLink}
                                showSharedLinkSettingsCallout={showSharedLinkSettingsCallout}
                                submitting={submitting || isFetching}
                                trackingProps={sharedLinkTracking}
                            />
                        )}

                        {isEmailLinkSectionExpanded && !showCollaboratorList && (
                            <EmailForm
                                contactsFieldLabel={<FormattedMessage {...messages.sendSharedLinkFieldLabel} />}
                                getContacts={getSharedLinkContacts}
                                inlineNotice={{
                                    type: 'error',
                                    content: sendSharedLinkError,
                                }}
                                isContactsFieldEnabled
                                isExpanded
                                onRequestClose={this.closeEmailSharedLinkForm}
                                onSubmit={this.handleSendSharedLink}
                                showEnterEmailsCallout={showEnterEmailsCallout}
                                submitting={submitting}
                                selectedContacts={this.state.emailSharedLinkContacts}
                                updateSelectedContacts={this.updateEmailSharedLinkContacts}
                                {...sharedLinkEmailTracking}
                            />
                        )}
                        {showCollaboratorList && this.renderCollaboratorList()}
                    </LoadingIndicatorWrapper>
                </Modal>
                {isConfirmModalOpen && (
                    <RemoveLinkConfirmModal
                        isOpen={isConfirmModalOpen}
                        onRequestClose={this.closeConfirmModal}
                        removeLink={onRemoveLink}
                        submitting={submitting}
                        {...removeLinkConfirmModalTracking}
                    />
                )}
            </div>
        );
    }
}

export { UnifiedShareModal as UnifiedShareModalBase };
export default injectIntl(UnifiedShareModal);

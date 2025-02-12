import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import type { TooltipPosition, TooltipTheme } from '../../components/tooltip/Tooltip';

interface Collaborator {
    email?: string;
    id: string | number;
    name: string;
    type: string;
    userID?: string | number;
}

interface CollaboratorsList {
    collaborators: Array<Collaborator>;
}

interface UnifiedShareFormProps {
    shouldRenderFTUXTooltip?: boolean;
    canInvite?: boolean;
    collabRestrictionType?: string;
    collaborationRestrictionWarning?: React.ReactNode;
    contactLimit?: number;
    getCollaboratorContacts?: () => Promise<any>;
    recommendedSharingTooltipCalloutName?: string | null;
    sendInvitesError?: string;
    showCalloutForUser?: boolean;
    suggestedCollaborators?: Array<any>;
    collaboratorsList?: CollaboratorsList;
    currentUserID?: string;
    inviteePermissions?: Array<any>;
    openUpgradePlanModal?: () => void;
    getContactsByEmail?: (params: { emails: Array<string> }) => Promise<any>;
    sharedLinkLoaded?: boolean;
    intl: IntlShape;
    item: any;
    allShareRestrictionWarning?: JSX.Element;
    changeSharedLinkAccessLevel?: (access: string) => void;
    changeSharedLinkPermissionLevel?: (permission: string) => void;
    config?: Record<string, any>;
    createSharedLinkOnLoad?: boolean;
    displayInModal?: boolean;
    focusSharedLinkOnLoad?: boolean;
    getSharedLinkContacts?: () => void;
    getContactAvatarUrl?: (email: string) => string;
    getJustificationReasons?: (typedId: string, checkpoint: string) => Promise<any>;
    handleFtuxCloseClick?: () => void;
    initiallySelectedContacts?: Array<any>;
    isAdvancedContentInsightsChecked?: boolean;
    isAllowEditSharedLinkForFileEnabled?: boolean;
    isCollabRestrictionJustificationAllowed?: boolean;
    isFetching?: boolean;
    onAddLink?: () => void;
    onAdvancedContentInsightsToggle?: () => void;
    onCollaboratorAvatarsClick?: () => void;
    onCopyError?: () => void;
    onCopyInit?: () => void;
    onCopySuccess?: () => void;
    onDismissTooltip?: () => void;
    onRemoveAllRestrictedCollabs?: () => void;
    onSettingsClick?: () => void;
    openConfirmModal?: () => void;
    restrictedCollabEmails?: Array<string>;
    restrictedGroups?: Array<string>;
    sendInvites?: (params: SendInvitesParams) => Promise<any>;
    sendSharedLink?: (data: any) => Promise<any>;
    sendSharedLinkError?: string;
    setUpdatedContacts?: (contacts: Array<any>) => void;
    sharedLink?: any;
    sharedLinkEditTagTargetingApi?: string;
    sharedLinkEditTooltipTargetingApi?: string;
    showEnterEmailsCallout?: boolean;
    showSharedLinkSettingsCallout?: boolean;
    showUpgradeInlineNotice?: boolean;
    showUpgradeOptions?: boolean;
    submitting?: boolean;
    tooltips?: Record<string, any>;
    trackingProps?: Record<string, any>;
    upsellInlineNotice?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

interface UnifiedShareFormState {
    classificationLabelId: string;
    emailSharedLinkContacts: Array<Contact>;
    inviteCollabsContacts: Array<Contact>;
    inviteePermissionLevel: string;
    isEmailLinkSectionExpanded: boolean;
    isFetchingJustificationReasons: boolean;
    isInviteSectionExpanded: boolean;
    justificationReasons: Array<SelectOptionProp>;
    showCollaboratorList: boolean;
}



interface SendInvitesParams {
    emails: string;
    groupIDs: string;
    emailMessage: string;
    permission: string;
    numsOfInvitees: number;
    numOfInviteeGroups: number;
    classificationLabelId?: string;
    justificationReason?: {
        id: string;
        title: string;
    };
}

import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import { Link } from '../../components/link';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import { UpgradeBadge } from '../../components/badge';
import InlineNotice from '../../components/inline-notice';
import PlainButton from '../../components/plain-button';
import { ITEM_TYPE_FILE, ITEM_TYPE_WEBLINK } from '../../common/constants';
import Tooltip from '../../components/tooltip';
import { CollaboratorAvatars, CollaboratorList } from '../collaborator-avatars';

import AdvancedContentInsightsToggle from '../advanced-content-insights/AdvancedContentInsightsToggle';
import InviteePermissionsMenu from './InviteePermissionsMenu';
import messages from './messages';
import SharedLinkSection from './SharedLinkSection';
import EmailForm from './EmailForm';
import getDefaultPermissionLevel from './utils/defaultPermissionLevel';
import hasRestrictedContacts from './utils/hasRestrictedContacts';
import mergeContacts from './utils/mergeContacts';
import { JUSTIFICATION_CHECKPOINT_EXTERNAL_COLLAB } from './constants';

import {
    type contactType as Contact,
    type getJustificationReasonsResponseType as GetJustificationReasonsResponse,
    type item as Item,
    type justificationCheckpointType as JustificationCheckpoint,
    type USFProps,
} from './flowTypes';
import { type SelectOptionProp } from '../../components/select-field/props';

const SHARED_LINKS_COMMUNITY_URL = 'https://community.box.com/t5/Using-Shared-Links/Creating-Shared-Links/ta-p/19523';
const INVITE_COLLABS_CONTACTS_TYPE = 'inviteCollabsContacts';
const EMAIL_SHARED_LINK_CONTACTS_TYPE = 'emailSharedLinkContacts';

type State = {
    classificationLabelId: string,
    emailSharedLinkContacts: Array<Contact>,
    inviteCollabsContacts: Array<Contact>,
    inviteePermissionLevel: string,
    isEmailLinkSectionExpanded: boolean,
    isFetchingJustificationReasons: boolean,
    isInviteSectionExpanded: boolean,
    justificationReasons: Array<SelectOptionProp>,
    showCollaboratorList: boolean,
};

class UnifiedShareForm extends React.Component<UnifiedShareFormProps, UnifiedShareFormState> {
    static defaultProps = {
        displayInModal: true,
        initiallySelectedContacts: [],
        createSharedLinkOnLoad: false,
        focusSharedLinkOnLoad: false,
        restrictedCollabEmails: [],
        retrictedGroups: [],
        trackingProps: {
            collaboratorListTracking: {},
            inviteCollabsEmailTracking: {},
            inviteCollabTracking: {},
            modalTracking: {},
            removeLinkConfirmModalTracking: {},
            sharedLinkEmailTracking: {},
            sharedLinkTracking: {},
        },
    };

    constructor(props: USFProps) {
        super(props);

        this.state = {
            classificationLabelId: '',
            emailSharedLinkContacts: [],
            inviteCollabsContacts: props.initiallySelectedContacts,
            inviteePermissionLevel: '',
            isEmailLinkSectionExpanded: false,
            isFetchingJustificationReasons: false,
            isInviteSectionExpanded: !!props.initiallySelectedContacts.length,
            justificationReasons: [],
            showCollaboratorList: false,
        };
    }

    componentDidUpdate(prevProps: UnifiedShareFormProps) {
        const { isCollabRestrictionJustificationAllowed, item, restrictedCollabEmails, restrictedGroups } = this.props;
        const {
            restrictedGroups: prevRestrictedGroups,
            restrictedCollabEmails: prevRestrictedCollabEmails,
            isCollabRestrictionJustificationAllowed: prevIsCollabRestrictionJustificationAllowed,
        } = prevProps;

        const didCollabRestrictionsChange =
            !isEqual(restrictedGroups, prevRestrictedGroups) ||
            !isEqual(restrictedCollabEmails, prevRestrictedCollabEmails) ||
            isCollabRestrictionJustificationAllowed !== prevIsCollabRestrictionJustificationAllowed;

        if (didCollabRestrictionsChange && this.shouldRequireCollabJustification()) {
            this.fetchJustificationReasons(item, JUSTIFICATION_CHECKPOINT_EXTERNAL_COLLAB);
        }
    }

    fetchJustificationReasons = (item: Item, checkpoint: JustificationCheckpoint) => {
        const { justificationReasons } = this.state;
        const { getJustificationReasons } = this.props;
        const hasJustificationReasons = !!justificationReasons.length;

        if (!getJustificationReasons || hasJustificationReasons) {
            return Promise.resolve();
        }
        this.setState({ isFetchingJustificationReasons: true });

        return getJustificationReasons(item.typedID, checkpoint)
            .then(({ classificationLabelId, options = [] }: GetJustificationReasonsResponse) => {
                this.setState({
                    classificationLabelId,
                    justificationReasons: options.map(({ id, title }) => ({
                        displayText: title,
                        value: id,
                    })),
                });
            })
            .finally(() => {
                this.setState({ isFetchingJustificationReasons: false });
            });
    };

    shouldRequireCollabJustification = () => {
        const { inviteCollabsContacts } = this.state;
        const { isCollabRestrictionJustificationAllowed, restrictedCollabEmails, restrictedGroups } = this.props;

        const hasRestrictedCollabs = hasRestrictedContacts(
            inviteCollabsContacts,
            restrictedCollabEmails,
            restrictedGroups,
        );
        return hasRestrictedCollabs && isCollabRestrictionJustificationAllowed;
    };

    handleInviteCollabPillCreate = (pills: Array<SelectOptionProp | Contact>) => {
        return this.onPillCreate(INVITE_COLLABS_CONTACTS_TYPE, pills);
    };

    handleEmailSharedLinkPillCreate = (pills: Array<SelectOptionProp | Contact>) => {
        return this.onPillCreate(EMAIL_SHARED_LINK_CONTACTS_TYPE, pills);
    };

    onToggleSharedLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target } = event;
        const { handleFtuxCloseClick, onAddLink, openConfirmModal, shouldRenderFTUXTooltip, trackingProps } =
            this.props;
        const { sharedLinkTracking } = trackingProps;
        const { onToggleLink } = sharedLinkTracking;

        if (shouldRenderFTUXTooltip) {
            handleFtuxCloseClick();
        }

        if (target.type === 'checkbox') {
            if (target.checked === false) {
                openConfirmModal();
            } else {
                onAddLink();
            }

            if (onToggleLink) {
                onToggleLink(target.checked);
            }
        }
    };

    showCollaboratorList = () => {
        const { onCollaboratorAvatarsClick } = this.props;

        if (onCollaboratorAvatarsClick) {
            onCollaboratorAvatarsClick();
        } else {
            this.setState({ showCollaboratorList: true });
        }
    };

    closeCollaboratorList = () => {
        this.setState({ showCollaboratorList: false });
    };

    handleSendInvites = (data: {
        emails: Array<string>;
        groupIDs: Array<string>;
        justificationReason?: SelectOptionProp;
        message: string;
        restrictedEmails: Array<string>;
        restrictedGroups: Array<string>;
    }) => {
        const { inviteePermissions, isCollabRestrictionJustificationAllowed, sendInvites, trackingProps } = this.props;
        const { inviteCollabsEmailTracking } = trackingProps;
        const { onSendClick } = inviteCollabsEmailTracking;
        const { classificationLabelId, inviteePermissionLevel } = this.state;
        const defaultPermissionLevel = getDefaultPermissionLevel(inviteePermissions);
        const selectedPermissionLevel = inviteePermissionLevel || defaultPermissionLevel;
        const { emails, groupIDs, justificationReason, message, restrictedEmails, restrictedGroups } = data;

        let params: SendInvitesParams = {
            emails: emails.join(','),
            groupIDs: groupIDs.join(','),
            emailMessage: message,
            permission: selectedPermissionLevel,
            numsOfInvitees: emails.length,
            numOfInviteeGroups: groupIDs.length,
        };

        const hasJustificationReason = !!justificationReason;
        const hasRestrictedInvitees = !isEmpty(restrictedEmails) || !isEmpty(restrictedGroups);
        const shouldSubmitJustificationReason =
            hasJustificationReason && hasRestrictedInvitees && isCollabRestrictionJustificationAllowed;

        if (shouldSubmitJustificationReason) {
            params = {
                ...params,
                classificationLabelId,
                justificationReason: {
                    id: justificationReason.value,
                    title: justificationReason.displayText,
                },
            };
        }

        if (onSendClick) {
            onSendClick(params);
        }

        return sendInvites(params);
    };

    handleSendSharedLink = (data: {
        emails: Array<string>;
        groupIDs: Array<string>;
        message?: string;
    }) => {
        const { sendSharedLink, sharedLink, trackingProps } = this.props;
        const { sharedLinkEmailTracking } = trackingProps;
        const { permissionLevel } = sharedLink;
        const { onSendClick } = sharedLinkEmailTracking;

        const { emails, groupIDs } = data;

        if (onSendClick) {
            const params = {
                ...data,
                numsOfRecipients: emails.length,
                numOfRecipientGroups: groupIDs.length,
                permissionLevel,
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

    onPillCreate = (type: string, pills: Array<SelectOptionProp | Contact>) => {
        // If this is a dropdown select event, we ignore it
        // $FlowFixMe
        const selectOptionPills = pills.filter(pill => !pill.id);
        if (selectOptionPills.length === 0) {
            return;
        }

        const { getContactsByEmail } = this.props;

        if (getContactsByEmail) {
            const emails = pills.map(pill => pill.value);
            // $FlowFixMe
            getContactsByEmail({ emails }).then((contacts: Object) => {
                if (type === INVITE_COLLABS_CONTACTS_TYPE) {
                    this.setState(prevState => ({
                        inviteCollabsContacts: mergeContacts(prevState.inviteCollabsContacts, contacts),
                    }));
                } else if (type === EMAIL_SHARED_LINK_CONTACTS_TYPE) {
                    this.setState(prevState => ({
                        emailSharedLinkContacts: mergeContacts(prevState.emailSharedLinkContacts, contacts),
                    }));
                }
            });
        }
    };

    openInviteCollaborators = (value: string) => {
        const { handleFtuxCloseClick } = this.props;
        if (this.state.isInviteSectionExpanded) {
            return;
        }

        // checking the value because IE seems to trigger onInput immediately
        // on focus of the contacts field
        if (value !== '') {
            handleFtuxCloseClick();
            this.setState(
                {
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
        const { handleFtuxCloseClick } = this.props;
        handleFtuxCloseClick();
        this.setState({
            isEmailLinkSectionExpanded: true,
        });
    };

    closeEmailSharedLinkForm = () => {
        this.setState({ isEmailLinkSectionExpanded: false });
    };

    hasExternalContact = (type: string): boolean => {
        const { inviteCollabsContacts, emailSharedLinkContacts } = this.state;
        if (type === INVITE_COLLABS_CONTACTS_TYPE) {
            return inviteCollabsContacts.some(contact => contact.isExternalUser);
        }
        if (type === EMAIL_SHARED_LINK_CONTACTS_TYPE) {
            return emailSharedLinkContacts.some(contact => contact.isExternalUser);
        }
        return false;
    };

    isRemovingAllRestrictedCollabs = (
        currentInviteCollabsContacts: Array<Contact>,
        newInviteCollabsContacts: Array<Contact>,
    ) => {
        const { restrictedCollabEmails, restrictedGroups } = this.props;

        const hasRestrictedCollabs = hasRestrictedContacts(
            currentInviteCollabsContacts,
            restrictedCollabEmails,
            restrictedGroups,
        );
        const hasRestrictedCollabsAfterUpdate = hasRestrictedContacts(
            newInviteCollabsContacts,
            restrictedCollabEmails,
            restrictedGroups,
        );

        return hasRestrictedCollabs && !hasRestrictedCollabsAfterUpdate;
    };

    updateInviteCollabsContacts = (inviteCollabsContacts: Array<Contact>) => {
        const { inviteCollabsContacts: currentInviteCollabsContacts } = this.state;
        const { onRemoveAllRestrictedCollabs, setUpdatedContacts } = this.props;

        const isRemovingAllRestrictedCollabs = this.isRemovingAllRestrictedCollabs(
            currentInviteCollabsContacts,
            inviteCollabsContacts,
        );

        this.setState({
            inviteCollabsContacts,
        });

        if (setUpdatedContacts) {
            setUpdatedContacts(inviteCollabsContacts);
        }
        if (onRemoveAllRestrictedCollabs && isRemovingAllRestrictedCollabs) {
            onRemoveAllRestrictedCollabs();
        }
    };

    updateEmailSharedLinkContacts = (emailSharedLinkContacts: Array<Contact>) => {
        this.setState({
            emailSharedLinkContacts,
        });
    };

    shouldAutoFocusSharedLink = () => {
        const { focusSharedLinkOnLoad, sharedLink, sharedLinkLoaded, createSharedLinkOnLoad } = this.props;

        if (!createSharedLinkOnLoad && !focusSharedLinkOnLoad) {
            return false;
        }
        // if not forcing focus or not a newly added shared link, return false
        if (!(focusSharedLinkOnLoad || sharedLink.isNewSharedLink)) {
            return false;
        }
        // otherwise wait until the link data is loaded before focusing
        if (!sharedLinkLoaded) {
            return false;
        }
        return true;
    };

    renderInviteSection(): JSX.Element {
        const {
            canInvite,
            collabRestrictionType,
            collaborationRestrictionWarning,
            config,
            contactLimit,
            getCollaboratorContacts,
            getContactAvatarUrl,
            handleFtuxCloseClick,
            item,
            recommendedSharingTooltipCalloutName = null,
            restrictedCollabEmails,
            restrictedGroups,
            sendInvitesError,
            shouldRenderFTUXTooltip,
            showEnterEmailsCallout = false,
            showCalloutForUser = false,
            showUpgradeInlineNotice = false,
            showUpgradeOptions,
            submitting,
            suggestedCollaborators,
            trackingProps,
            upsellInlineNotice,
        } = this.props;
        const { type } = item;
        const { isFetchingJustificationReasons, isInviteSectionExpanded, justificationReasons } = this.state;
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
                    <FormattedMessage {...messages.ftuxNewUSMUserBody} />{' '}
                    <Link className="ftux-tooltip-link" href={SHARED_LINKS_COMMUNITY_URL} target="_blank">
                        <FormattedMessage {...messages.ftuxLinkText} />
                    </Link>
                </p>
                <div className="ftux-tooltip-controls">
                    <ButtonAdapter className="ftux-tooltip-button" onClick={handleFtuxCloseClick} type={ButtonType.BUTTON} {...ftuxConfirmButtonProps}>
                        <FormattedMessage {...messages.ftuxConfirmLabel} />
                    </ButtonAdapter>
                </div>
            </div>
        );
        const ftuxTooltipProps = {
            className: 'usm-ftux-tooltip',
            // don't want ftux tooltip to show if the recommended sharing tooltip callout is showing
            isShown: !recommendedSharingTooltipCalloutName && shouldRenderFTUXTooltip && showCalloutForUser,
            position: 'middle-left' as TooltipPosition,
            showCloseButton: true,
            text: ftuxTooltipText,
            theme: 'callout' as TooltipTheme,
        };
        const showUpsellInlineNotice = !!upsellInlineNotice;

        return (
            <>
                <Tooltip {...ftuxTooltipProps}>
                    <div className="invite-collaborator-container" data-testid="invite-collaborator-container">
                        <EmailForm
                            config={config}
                            contactLimit={contactLimit}
                            collabRestrictionType={collabRestrictionType}
                            contactsFieldAvatars={avatars}
                            contactsFieldDisabledTooltip={contactsFieldDisabledTooltip}
                            contactsFieldLabel={<FormattedMessage {...messages.inviteFieldLabel} />}
                            getContacts={getCollaboratorContacts}
                            getContactAvatarUrl={getContactAvatarUrl}
                            inlineNotice={inlineNotice}
                            isContactsFieldEnabled={canInvite}
                            isExpanded={isInviteSectionExpanded}
                            isFetchingJustificationReasons={isFetchingJustificationReasons}
                            isExternalUserSelected={this.hasExternalContact(INVITE_COLLABS_CONTACTS_TYPE)}
                            isRestrictionJustificationEnabled={this.shouldRequireCollabJustification()}
                            justificationReasons={justificationReasons}
                            onContactInput={this.openInviteCollaborators}
                            onPillCreate={this.handleInviteCollabPillCreate}
                            onRequestClose={this.closeInviteCollaborators}
                            onSubmit={this.handleSendInvites}
                            openInviteCollaboratorsSection={this.openInviteCollaboratorsSection}
                            recommendedSharingTooltipCalloutName={recommendedSharingTooltipCalloutName}
                            restrictedEmails={restrictedCollabEmails}
                            restrictedGroups={restrictedGroups}
                            showEnterEmailsCallout={showEnterEmailsCallout}
                            submitting={submitting}
                            selectedContacts={this.state.inviteCollabsContacts}
                            suggestedCollaborators={suggestedCollaborators}
                            updateSelectedContacts={this.updateInviteCollabsContacts}
                            {...inviteCollabsEmailTracking}
                        >
                            {this.renderInviteePermissionsDropdown()}
                            {showUpgradeOptions &&
                                !showUpgradeInlineNotice &&
                                !showUpsellInlineNotice &&
                                this.renderUpgradeLinkDescription()}
                        </EmailForm>
                    </div>
                </Tooltip>
            </>
        );
    }

    renderCollaboratorAvatars(): JSX.Element | null {
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

    renderCollaboratorMessage(resinTarget: string): JSX.Element {
        const { openUpgradePlanModal = () => {} } = this.props;
        return (
            <>
                <FormattedMessage
                    values={{
                        collaboratorAccess: (
                            <Link
                                className="upgrade-link"
                                href="https://support.box.com/hc/en-us/articles/360044196413-Understanding-Collaborator-Permission-Levels"
                                target="_blank"
                            >
                                <FormattedMessage {...messages.collabAccess} />
                            </Link>
                        ),
                        upgradeLink: (
                            <PlainButton
                                className="upgrade-link"
                                data-resin-target={resinTarget}
                                onClick={openUpgradePlanModal}
                                type={ButtonType.BUTTON}
                            >
                                <FormattedMessage {...messages.upgradeLink} />
                            </PlainButton>
                        ),
                    }}
                    {...messages.setLevelOfCollabAccess}
                />
            </>
        );
    }

    renderUpgradeLinkDescription(): JSX.Element {
        const { openUpgradePlanModal = () => {}, trackingProps = {} } = this.props;
        const { inviteCollabsEmailTracking = {} } = trackingProps;
        const { upgradeLinkProps = {} } = inviteCollabsEmailTracking;

        return (
            <div className="upgrade-description">
                <UpgradeBadge />
                <FormattedMessage
                    values={{
                        upgradeGetMoreAccessControlsLink: (
                            <PlainButton
                                className="upgrade-link"
                                onClick={openUpgradePlanModal}
                                type={ButtonType.BUTTON}
                                {...upgradeLinkProps}
                            >
                                <FormattedMessage {...messages.upgradeGetMoreAccessControlsLink} />
                            </PlainButton>
                        ),
                    }}
                    {...messages.upgradeGetMoreAccessControlsDescription}
                />
            </div>
        );
    }

    renderUpgradeInlineNotice(): JSX.Element {
        return (
            <InlineNotice title={<FormattedMessage {...messages.upgradeInlineNoticeTitle} />} type="info">
                {this.renderCollaboratorMessage('external_collab_top_message_upgrade_cta')}
            </InlineNotice>
        );
    }

    renderInviteePermissionsDropdown(): JSX.Element | null {
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

    renderCollaboratorList(): JSX.Element | null {
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

    render(): JSX.Element {
        // Shared link section props
        const {
            allShareRestrictionWarning,
            changeSharedLinkAccessLevel,
            changeSharedLinkPermissionLevel,
            config,
            createSharedLinkOnLoad,
            displayInModal,
            focusSharedLinkOnLoad,
            getSharedLinkContacts,
            getContactAvatarUrl,
            intl,
            isAdvancedContentInsightsChecked,
            isAllowEditSharedLinkForFileEnabled,
            isFetching,
            item,
            onAddLink,
            onAdvancedContentInsightsToggle,
            onCopyError,
            onCopyInit,
            onCopySuccess,
            onDismissTooltip = () => {},
            onSettingsClick,
            sendSharedLinkError,
            sharedLink,
            sharedLinkEditTagTargetingApi,
            sharedLinkEditTooltipTargetingApi,
            showEnterEmailsCallout = false,
            showSharedLinkSettingsCallout = false,
            showUpgradeInlineNotice = false,
            showUpgradeOptions,
            submitting,
            tooltips = {},
            trackingProps,
            upsellInlineNotice = null,
        } = this.props;
        const { sharedLinkTracking, sharedLinkEmailTracking } = trackingProps;
        const { isEmailLinkSectionExpanded, isInviteSectionExpanded, showCollaboratorList } = this.state;

        const hasExpandedSections = isEmailLinkSectionExpanded || isInviteSectionExpanded || showCollaboratorList;

        const showContentInsightsToggle =
            onAdvancedContentInsightsToggle && !hasExpandedSections && item?.type === ITEM_TYPE_FILE;

        return (
            <div className={displayInModal ? '' : 'be bdl-UnifiedShareForm'}>
                <LoadingIndicatorWrapper isLoading={isFetching} hideContent>
                    <>
                        <div className="bdl-UnifiedShareForm-sections" data-testid="unified-share-form-sections">
                            {!hasExpandedSections && allShareRestrictionWarning}

                            {!!upsellInlineNotice && <div className="upsell-inline-notice">{upsellInlineNotice}</div>}

                            {showUpgradeOptions && showUpgradeInlineNotice && this.renderUpgradeInlineNotice()}

                            {!isEmailLinkSectionExpanded && !showCollaboratorList && this.renderInviteSection()}
                        </div>


                    {!hasExpandedSections && (
                        <SharedLinkSection
                            addSharedLink={onAddLink}
                            autofocusSharedLink={this.shouldAutoFocusSharedLink()}
                            autoCreateSharedLink={createSharedLinkOnLoad}
                            config={config}
                            triggerCopyOnLoad={createSharedLinkOnLoad && focusSharedLinkOnLoad}
                            changeSharedLinkAccessLevel={changeSharedLinkAccessLevel}
                            changeSharedLinkPermissionLevel={changeSharedLinkPermissionLevel}
                            intl={intl}
                            isAllowEditSharedLinkForFileEnabled={isAllowEditSharedLinkForFileEnabled}
                            item={item}
                            itemType={item.type}
                            onDismissTooltip={onDismissTooltip}
                            onEmailSharedLinkClick={this.openEmailSharedLinkForm}
                            onSettingsClick={onSettingsClick}
                            onToggleSharedLink={this.onToggleSharedLink}
                            onCopyInit={onCopyInit}
                            onCopySuccess={onCopySuccess}
                            onCopyError={onCopyError}
                            sharedLink={sharedLink}
                            sharedLinkEditTagTargetingApi={sharedLinkEditTagTargetingApi}
                            sharedLinkEditTooltipTargetingApi={sharedLinkEditTooltipTargetingApi}
                            showSharedLinkSettingsCallout={showSharedLinkSettingsCallout}
                            submitting={submitting || isFetching}
                            trackingProps={sharedLinkTracking}
                            tooltips={tooltips}
                        />
                    )}

                    {showContentInsightsToggle && (
                        <React.Fragment>
                            <hr className="bdl-UnifiedShareForm-separator" />
                            <div className="bdl-UnifiedShareForm-row">
                                <AdvancedContentInsightsToggle
                                    isChecked={isAdvancedContentInsightsChecked}
                                    isDisabled={submitting || isFetching}
                                    onChange={onAdvancedContentInsightsToggle}
                                />
                            </div>
                        </React.Fragment>
                    )}

                    {isEmailLinkSectionExpanded && !showCollaboratorList && (
                        <EmailForm
                            contactsFieldLabel={<FormattedMessage {...messages.sendSharedLinkFieldLabel} />}
                            getContactAvatarUrl={getContactAvatarUrl}
                            getContacts={getSharedLinkContacts}
                            inlineNotice={{
                                type: 'error',
                                content: sendSharedLinkError,
                            }}
                            isContactsFieldEnabled
                            isExpanded
                            isExternalUserSelected={this.hasExternalContact(EMAIL_SHARED_LINK_CONTACTS_TYPE)}
                            onPillCreate={this.handleEmailSharedLinkPillCreate}
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
                    </>
                </LoadingIndicatorWrapper>
            </div>
        );
    }
}

export { UnifiedShareForm as UnifiedShareFormBase };
export default injectIntl(UnifiedShareForm);

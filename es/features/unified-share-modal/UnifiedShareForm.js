function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { FormattedMessage, injectIntl } from 'react-intl';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import { Link } from '../../components/link';
import Button from '../../components/button';
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
const SHARED_LINKS_COMMUNITY_URL = 'https://community.box.com/t5/Using-Shared-Links/Creating-Shared-Links/ta-p/19523';
const INVITE_COLLABS_CONTACTS_TYPE = 'inviteCollabsContacts';
const EMAIL_SHARED_LINK_CONTACTS_TYPE = 'emailSharedLinkContacts';
class UnifiedShareForm extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "fetchJustificationReasons", (item, checkpoint) => {
      const {
        justificationReasons
      } = this.state;
      const {
        getJustificationReasons
      } = this.props;
      const hasJustificationReasons = !!justificationReasons.length;
      if (!getJustificationReasons || hasJustificationReasons) {
        return Promise.resolve();
      }
      this.setState({
        isFetchingJustificationReasons: true
      });
      return getJustificationReasons(item.typedID, checkpoint).then(({
        classificationLabelId,
        options = []
      }) => {
        this.setState({
          classificationLabelId,
          justificationReasons: options.map(({
            id,
            title
          }) => ({
            displayText: title,
            value: id
          }))
        });
      }).finally(() => {
        this.setState({
          isFetchingJustificationReasons: false
        });
      });
    });
    _defineProperty(this, "shouldRequireCollabJustification", () => {
      const {
        inviteCollabsContacts
      } = this.state;
      const {
        isCollabRestrictionJustificationAllowed,
        restrictedCollabEmails,
        restrictedGroups
      } = this.props;
      const hasRestrictedCollabs = hasRestrictedContacts(inviteCollabsContacts, restrictedCollabEmails, restrictedGroups);
      return hasRestrictedCollabs && isCollabRestrictionJustificationAllowed;
    });
    _defineProperty(this, "handleInviteCollabPillCreate", pills => {
      return this.onPillCreate(INVITE_COLLABS_CONTACTS_TYPE, pills);
    });
    _defineProperty(this, "handleEmailSharedLinkPillCreate", pills => {
      return this.onPillCreate(EMAIL_SHARED_LINK_CONTACTS_TYPE, pills);
    });
    _defineProperty(this, "onToggleSharedLink", event => {
      const {
        target
      } = event;
      const {
        handleFtuxCloseClick,
        onAddLink,
        openConfirmModal,
        shouldRenderFTUXTooltip,
        trackingProps
      } = this.props;
      const {
        sharedLinkTracking
      } = trackingProps;
      const {
        onToggleLink
      } = sharedLinkTracking;
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
    });
    _defineProperty(this, "showCollaboratorList", () => {
      const {
        onCollaboratorAvatarsClick
      } = this.props;
      if (onCollaboratorAvatarsClick) {
        onCollaboratorAvatarsClick();
      } else {
        this.setState({
          showCollaboratorList: true
        });
      }
    });
    _defineProperty(this, "closeCollaboratorList", () => {
      this.setState({
        showCollaboratorList: false
      });
    });
    _defineProperty(this, "handleSendInvites", data => {
      const {
        inviteePermissions,
        isCollabRestrictionJustificationAllowed,
        sendInvites,
        trackingProps
      } = this.props;
      const {
        inviteCollabsEmailTracking
      } = trackingProps;
      const {
        onSendClick
      } = inviteCollabsEmailTracking;
      const {
        classificationLabelId,
        inviteePermissionLevel
      } = this.state;
      const defaultPermissionLevel = getDefaultPermissionLevel(inviteePermissions);
      const selectedPermissionLevel = inviteePermissionLevel || defaultPermissionLevel;
      const {
        emails,
        groupIDs,
        justificationReason,
        message,
        restrictedEmails,
        restrictedGroups
      } = data;
      let params = {
        emails: emails.join(','),
        groupIDs: groupIDs.join(','),
        emailMessage: message,
        permission: selectedPermissionLevel,
        numsOfInvitees: emails.length,
        numOfInviteeGroups: groupIDs.length
      };
      const hasJustificationReason = !!justificationReason;
      const hasRestrictedInvitees = !isEmpty(restrictedEmails) || !isEmpty(restrictedGroups);
      const shouldSubmitJustificationReason = hasJustificationReason && hasRestrictedInvitees && isCollabRestrictionJustificationAllowed;
      if (shouldSubmitJustificationReason) {
        params = _objectSpread(_objectSpread({}, params), {}, {
          classificationLabelId,
          justificationReason: {
            id: justificationReason.value,
            title: justificationReason.displayText
          }
        });
      }
      if (onSendClick) {
        onSendClick(params);
      }
      return sendInvites(params);
    });
    _defineProperty(this, "handleSendSharedLink", data => {
      const {
        sendSharedLink,
        sharedLink,
        trackingProps
      } = this.props;
      const {
        sharedLinkEmailTracking
      } = trackingProps;
      const {
        permissionLevel
      } = sharedLink;
      const {
        onSendClick
      } = sharedLinkEmailTracking;
      const {
        emails,
        groupIDs
      } = data;
      if (onSendClick) {
        const params = _objectSpread(_objectSpread({}, data), {}, {
          numsOfRecipients: emails.length,
          numOfRecipientGroups: groupIDs.length,
          permissionLevel
        });
        onSendClick(params);
      }
      return sendSharedLink(data);
    });
    // TODO-AH: Change permission level to use the appropriate flow type
    _defineProperty(this, "handleInviteePermissionChange", permissionLevel => {
      const {
        trackingProps
      } = this.props;
      const {
        inviteCollabTracking
      } = trackingProps;
      const {
        onInviteePermissionChange
      } = inviteCollabTracking;
      this.setState({
        inviteePermissionLevel: permissionLevel
      });
      if (onInviteePermissionChange) {
        onInviteePermissionChange(permissionLevel);
      }
    });
    _defineProperty(this, "onPillCreate", (type, pills) => {
      // If this is a dropdown select event, we ignore it
      // $FlowFixMe
      const selectOptionPills = pills.filter(pill => !pill.id);
      if (selectOptionPills.length === 0) {
        return;
      }
      const {
        getContactsByEmail
      } = this.props;
      if (getContactsByEmail) {
        const emails = pills.map(pill => pill.value);
        // $FlowFixMe
        getContactsByEmail({
          emails
        }).then(contacts => {
          if (type === INVITE_COLLABS_CONTACTS_TYPE) {
            this.setState(prevState => ({
              inviteCollabsContacts: mergeContacts(prevState.inviteCollabsContacts, contacts)
            }));
          } else if (type === EMAIL_SHARED_LINK_CONTACTS_TYPE) {
            this.setState(prevState => ({
              emailSharedLinkContacts: mergeContacts(prevState.emailSharedLinkContacts, contacts)
            }));
          }
        });
      }
    });
    _defineProperty(this, "openInviteCollaborators", value => {
      const {
        handleFtuxCloseClick
      } = this.props;
      if (this.state.isInviteSectionExpanded) {
        return;
      }

      // checking the value because IE seems to trigger onInput immediately
      // on focus of the contacts field
      if (value !== '') {
        handleFtuxCloseClick();
        this.setState({
          isInviteSectionExpanded: true
        }, () => {
          const {
            trackingProps: {
              inviteCollabTracking: {
                onEnterInviteCollabs
              }
            }
          } = this.props;
          if (onEnterInviteCollabs) {
            onEnterInviteCollabs();
          }
        });
      }
    });
    _defineProperty(this, "openInviteCollaboratorsSection", () => {
      this.setState({
        isInviteSectionExpanded: true
      });
    });
    _defineProperty(this, "closeInviteCollaborators", () => {
      this.setState({
        isInviteSectionExpanded: false
      });
    });
    _defineProperty(this, "openEmailSharedLinkForm", () => {
      const {
        handleFtuxCloseClick
      } = this.props;
      handleFtuxCloseClick();
      this.setState({
        isEmailLinkSectionExpanded: true
      });
    });
    _defineProperty(this, "closeEmailSharedLinkForm", () => {
      this.setState({
        isEmailLinkSectionExpanded: false
      });
    });
    _defineProperty(this, "hasExternalContact", type => {
      const {
        inviteCollabsContacts,
        emailSharedLinkContacts
      } = this.state;
      if (type === INVITE_COLLABS_CONTACTS_TYPE) {
        return inviteCollabsContacts.some(contact => contact.isExternalUser);
      }
      if (type === EMAIL_SHARED_LINK_CONTACTS_TYPE) {
        return emailSharedLinkContacts.some(contact => contact.isExternalUser);
      }
      return false;
    });
    _defineProperty(this, "isRemovingAllRestrictedCollabs", (currentInviteCollabsContacts, newInviteCollabsContacts) => {
      const {
        restrictedCollabEmails,
        restrictedGroups
      } = this.props;
      const hasRestrictedCollabs = hasRestrictedContacts(currentInviteCollabsContacts, restrictedCollabEmails, restrictedGroups);
      const hasRestrictedCollabsAfterUpdate = hasRestrictedContacts(newInviteCollabsContacts, restrictedCollabEmails, restrictedGroups);
      return hasRestrictedCollabs && !hasRestrictedCollabsAfterUpdate;
    });
    _defineProperty(this, "updateInviteCollabsContacts", inviteCollabsContacts => {
      const {
        inviteCollabsContacts: currentInviteCollabsContacts
      } = this.state;
      const {
        onRemoveAllRestrictedCollabs,
        setUpdatedContacts
      } = this.props;
      const isRemovingAllRestrictedCollabs = this.isRemovingAllRestrictedCollabs(currentInviteCollabsContacts, inviteCollabsContacts);
      this.setState({
        inviteCollabsContacts
      });
      if (setUpdatedContacts) {
        setUpdatedContacts(inviteCollabsContacts);
      }
      if (onRemoveAllRestrictedCollabs && isRemovingAllRestrictedCollabs) {
        onRemoveAllRestrictedCollabs();
      }
    });
    _defineProperty(this, "updateEmailSharedLinkContacts", emailSharedLinkContacts => {
      this.setState({
        emailSharedLinkContacts
      });
    });
    _defineProperty(this, "shouldAutoFocusSharedLink", () => {
      const {
        focusSharedLinkOnLoad,
        sharedLink,
        sharedLinkLoaded,
        createSharedLinkOnLoad
      } = this.props;
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
    });
    this.state = {
      classificationLabelId: '',
      emailSharedLinkContacts: [],
      inviteCollabsContacts: props.initiallySelectedContacts,
      inviteePermissionLevel: '',
      isEmailLinkSectionExpanded: false,
      isFetchingJustificationReasons: false,
      isInviteSectionExpanded: !!props.initiallySelectedContacts.length,
      justificationReasons: [],
      showCollaboratorList: false
    };
  }
  componentDidUpdate(prevProps) {
    const {
      isCollabRestrictionJustificationAllowed,
      item,
      restrictedCollabEmails,
      restrictedGroups
    } = this.props;
    const {
      restrictedGroups: prevRestrictedGroups,
      restrictedCollabEmails: prevRestrictedCollabEmails,
      isCollabRestrictionJustificationAllowed: prevIsCollabRestrictionJustificationAllowed
    } = prevProps;
    const didCollabRestrictionsChange = !isEqual(restrictedGroups, prevRestrictedGroups) || !isEqual(restrictedCollabEmails, prevRestrictedCollabEmails) || isCollabRestrictionJustificationAllowed !== prevIsCollabRestrictionJustificationAllowed;
    if (didCollabRestrictionsChange && this.shouldRequireCollabJustification()) {
      this.fetchJustificationReasons(item, JUSTIFICATION_CHECKPOINT_EXTERNAL_COLLAB);
    }
  }
  renderInviteSection() {
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
      upsellInlineNotice
    } = this.props;
    const {
      type
    } = item;
    const {
      isFetchingJustificationReasons,
      isInviteSectionExpanded,
      justificationReasons
    } = this.state;
    const {
      inviteCollabsEmailTracking,
      modalTracking
    } = trackingProps;
    const contactsFieldDisabledTooltip = type === ITEM_TYPE_WEBLINK ? /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteDisabledWeblinkTooltip) : /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteDisabledTooltip);
    const inlineNotice = sendInvitesError ? {
      type: 'error',
      content: sendInvitesError
    } : {
      type: 'warning',
      content: collaborationRestrictionWarning
    };
    const avatars = this.renderCollaboratorAvatars();
    const {
      ftuxConfirmButtonProps
    } = modalTracking;
    const ftuxTooltipText = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
      className: "ftux-tooltip-title"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.ftuxNewUSMUserTitle)), /*#__PURE__*/React.createElement("p", {
      className: "ftux-tooltip-body"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.ftuxNewUSMUserBody), ' ', /*#__PURE__*/React.createElement(Link, {
      className: "ftux-tooltip-link",
      href: SHARED_LINKS_COMMUNITY_URL,
      target: "_blank"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.ftuxLinkText))), /*#__PURE__*/React.createElement("div", {
      className: "ftux-tooltip-controls"
    }, /*#__PURE__*/React.createElement(Button, _extends({
      className: "ftux-tooltip-button",
      onClick: handleFtuxCloseClick
    }, ftuxConfirmButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, messages.ftuxConfirmLabel))));
    const ftuxTooltipProps = {
      className: 'usm-ftux-tooltip',
      // don't want ftux tooltip to show if the recommended sharing tooltip callout is showing
      isShown: !recommendedSharingTooltipCalloutName && shouldRenderFTUXTooltip && showCalloutForUser,
      position: 'middle-left',
      showCloseButton: true,
      text: ftuxTooltipText,
      theme: 'callout'
    };
    const showUpsellInlineNotice = !!upsellInlineNotice;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, ftuxTooltipProps, /*#__PURE__*/React.createElement("div", {
      className: "invite-collaborator-container",
      "data-testid": "invite-collaborator-container"
    }, /*#__PURE__*/React.createElement(EmailForm, _extends({
      config: config,
      contactLimit: contactLimit,
      collabRestrictionType: collabRestrictionType,
      contactsFieldAvatars: avatars,
      contactsFieldDisabledTooltip: contactsFieldDisabledTooltip,
      contactsFieldLabel: /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteFieldLabel),
      getContacts: getCollaboratorContacts,
      getContactAvatarUrl: getContactAvatarUrl,
      inlineNotice: inlineNotice,
      isContactsFieldEnabled: canInvite,
      isExpanded: isInviteSectionExpanded,
      isFetchingJustificationReasons: isFetchingJustificationReasons,
      isExternalUserSelected: this.hasExternalContact(INVITE_COLLABS_CONTACTS_TYPE),
      isRestrictionJustificationEnabled: this.shouldRequireCollabJustification(),
      justificationReasons: justificationReasons,
      onContactInput: this.openInviteCollaborators,
      onPillCreate: this.handleInviteCollabPillCreate,
      onRequestClose: this.closeInviteCollaborators,
      onSubmit: this.handleSendInvites,
      openInviteCollaboratorsSection: this.openInviteCollaboratorsSection,
      recommendedSharingTooltipCalloutName: recommendedSharingTooltipCalloutName,
      restrictedEmails: restrictedCollabEmails,
      restrictedGroups: restrictedGroups,
      showEnterEmailsCallout: showEnterEmailsCallout,
      submitting: submitting,
      selectedContacts: this.state.inviteCollabsContacts,
      suggestedCollaborators: suggestedCollaborators,
      updateSelectedContacts: this.updateInviteCollabsContacts
    }, inviteCollabsEmailTracking), this.renderInviteePermissionsDropdown(), showUpgradeOptions && !showUpgradeInlineNotice && !showUpsellInlineNotice && this.renderUpgradeLinkDescription()))));
  }
  renderCollaboratorAvatars() {
    const {
      collaboratorsList,
      canInvite,
      currentUserID,
      item,
      trackingProps
    } = this.props;
    const {
      modalTracking
    } = trackingProps;
    let avatarsContent = null;
    if (collaboratorsList) {
      const {
        collaborators
      } = collaboratorsList;
      const {
        hideCollaborators = true
      } = item;
      const canShowCollaboratorAvatars = hideCollaborators ? canInvite : true;

      // filter out the current user by comparing to the ItemCollabRecord ID field
      avatarsContent = canShowCollaboratorAvatars && /*#__PURE__*/React.createElement(CollaboratorAvatars, {
        collaborators: collaborators.filter(collaborator => String(collaborator.userID) !== currentUserID),
        onClick: this.showCollaboratorList,
        containerAttributes: modalTracking.collaboratorAvatarsProps
      });
    }
    return avatarsContent;
  }
  renderCollaboratorMessage(resinTarget) {
    const {
      openUpgradePlanModal = () => {}
    } = this.props;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
      values: {
        collaboratorAccess: /*#__PURE__*/React.createElement(Link, {
          className: "upgrade-link",
          href: "https://support.box.com/hc/en-us/articles/360044196413-Understanding-Collaborator-Permission-Levels",
          target: "_blank"
        }, /*#__PURE__*/React.createElement(FormattedMessage, messages.collabAccess)),
        upgradeLink: /*#__PURE__*/React.createElement(PlainButton, {
          className: "upgrade-link",
          "data-resin-target": resinTarget,
          onClick: openUpgradePlanModal,
          type: "button"
        }, /*#__PURE__*/React.createElement(FormattedMessage, messages.upgradeLink))
      }
    }, messages.setLevelOfCollabAccess)));
  }
  renderUpgradeLinkDescription() {
    const {
      openUpgradePlanModal = () => {},
      trackingProps = {}
    } = this.props;
    const {
      inviteCollabsEmailTracking = {}
    } = trackingProps;
    const {
      upgradeLinkProps = {}
    } = inviteCollabsEmailTracking;
    return /*#__PURE__*/React.createElement("div", {
      className: "upgrade-description"
    }, /*#__PURE__*/React.createElement(UpgradeBadge, null), /*#__PURE__*/React.createElement(FormattedMessage, _extends({
      values: {
        upgradeGetMoreAccessControlsLink: /*#__PURE__*/React.createElement(PlainButton, _extends({
          className: "upgrade-link",
          onClick: openUpgradePlanModal,
          type: "button"
        }, upgradeLinkProps), /*#__PURE__*/React.createElement(FormattedMessage, messages.upgradeGetMoreAccessControlsLink))
      }
    }, messages.upgradeGetMoreAccessControlsDescription)));
  }
  renderUpgradeInlineNotice() {
    return /*#__PURE__*/React.createElement(InlineNotice, {
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.upgradeInlineNoticeTitle),
      type: "info"
    }, this.renderCollaboratorMessage('external_collab_top_message_upgrade_cta'));
  }
  renderInviteePermissionsDropdown() {
    const {
      inviteePermissions,
      item,
      submitting,
      canInvite,
      trackingProps
    } = this.props;
    const {
      type
    } = item;
    const {
      inviteCollabTracking
    } = trackingProps;
    return inviteePermissions && /*#__PURE__*/React.createElement(InviteePermissionsMenu, {
      disabled: !canInvite || submitting,
      inviteePermissionsButtonProps: inviteCollabTracking.inviteePermissionsButtonProps,
      inviteePermissionLevel: this.state.inviteePermissionLevel,
      inviteePermissions: inviteePermissions,
      changeInviteePermissionLevel: this.handleInviteePermissionChange,
      itemType: type
    });
  }
  renderCollaboratorList() {
    const {
      item,
      collaboratorsList,
      trackingProps,
      canRemoveCollaborators,
      onRemoveCollaboratorClick
    } = this.props;
    const {
      name,
      type
    } = item;
    const {
      collaboratorListTracking
    } = trackingProps;
    let listContent = null;
    if (collaboratorsList) {
      const {
        collaborators
      } = collaboratorsList;
      listContent = /*#__PURE__*/React.createElement(CollaboratorList, {
        itemName: name,
        itemType: type,
        onDoneClick: this.closeCollaboratorList,
        item: item,
        collaborators: collaborators,
        trackingProps: collaboratorListTracking,
        canRemoveCollaborators: canRemoveCollaborators,
        onRemoveCollaboratorClick: onRemoveCollaboratorClick
      });
    }
    return listContent;
  }
  render() {
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
      upsellInlineNotice = null
    } = this.props;
    const {
      sharedLinkTracking,
      sharedLinkEmailTracking
    } = trackingProps;
    const {
      isEmailLinkSectionExpanded,
      isInviteSectionExpanded,
      showCollaboratorList
    } = this.state;
    const hasExpandedSections = isEmailLinkSectionExpanded || isInviteSectionExpanded || showCollaboratorList;
    const showContentInsightsToggle = onAdvancedContentInsightsToggle && !hasExpandedSections && item?.type === ITEM_TYPE_FILE;
    return /*#__PURE__*/React.createElement("div", {
      className: displayInModal ? '' : 'be bdl-UnifiedShareForm'
    }, /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
      isLoading: isFetching,
      hideContent: true
    }, !hasExpandedSections && allShareRestrictionWarning, !!upsellInlineNotice && /*#__PURE__*/React.createElement("div", {
      className: "upsell-inline-notice"
    }, upsellInlineNotice), showUpgradeOptions && showUpgradeInlineNotice && this.renderUpgradeInlineNotice(), !isEmailLinkSectionExpanded && !showCollaboratorList && this.renderInviteSection(), !hasExpandedSections && /*#__PURE__*/React.createElement(SharedLinkSection, {
      addSharedLink: onAddLink,
      autofocusSharedLink: this.shouldAutoFocusSharedLink(),
      autoCreateSharedLink: createSharedLinkOnLoad,
      config: config,
      triggerCopyOnLoad: createSharedLinkOnLoad && focusSharedLinkOnLoad,
      changeSharedLinkAccessLevel: changeSharedLinkAccessLevel,
      changeSharedLinkPermissionLevel: changeSharedLinkPermissionLevel,
      intl: intl,
      isAllowEditSharedLinkForFileEnabled: isAllowEditSharedLinkForFileEnabled,
      item: item,
      itemType: item.type,
      onDismissTooltip: onDismissTooltip,
      onEmailSharedLinkClick: this.openEmailSharedLinkForm,
      onSettingsClick: onSettingsClick,
      onToggleSharedLink: this.onToggleSharedLink,
      onCopyInit: onCopyInit,
      onCopySuccess: onCopySuccess,
      onCopyError: onCopyError,
      sharedLink: sharedLink,
      sharedLinkEditTagTargetingApi: sharedLinkEditTagTargetingApi,
      sharedLinkEditTooltipTargetingApi: sharedLinkEditTooltipTargetingApi,
      showSharedLinkSettingsCallout: showSharedLinkSettingsCallout,
      submitting: submitting || isFetching,
      trackingProps: sharedLinkTracking,
      tooltips: tooltips
    }), showContentInsightsToggle && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", {
      className: "bdl-UnifiedShareForm-separator"
    }), /*#__PURE__*/React.createElement("div", {
      className: "bdl-UnifiedShareForm-row"
    }, /*#__PURE__*/React.createElement(AdvancedContentInsightsToggle, {
      isChecked: isAdvancedContentInsightsChecked,
      isDisabled: submitting || isFetching,
      onChange: onAdvancedContentInsightsToggle
    }))), isEmailLinkSectionExpanded && !showCollaboratorList && /*#__PURE__*/React.createElement(EmailForm, _extends({
      contactsFieldLabel: /*#__PURE__*/React.createElement(FormattedMessage, messages.sendSharedLinkFieldLabel),
      getContactAvatarUrl: getContactAvatarUrl,
      getContacts: getSharedLinkContacts,
      inlineNotice: {
        type: 'error',
        content: sendSharedLinkError
      },
      isContactsFieldEnabled: true,
      isExpanded: true,
      isExternalUserSelected: this.hasExternalContact(EMAIL_SHARED_LINK_CONTACTS_TYPE),
      onPillCreate: this.handleEmailSharedLinkPillCreate,
      onRequestClose: this.closeEmailSharedLinkForm,
      onSubmit: this.handleSendSharedLink,
      showEnterEmailsCallout: showEnterEmailsCallout,
      submitting: submitting,
      selectedContacts: this.state.emailSharedLinkContacts,
      updateSelectedContacts: this.updateEmailSharedLinkContacts
    }, sharedLinkEmailTracking)), showCollaboratorList && this.renderCollaboratorList()));
  }
}
_defineProperty(UnifiedShareForm, "defaultProps", {
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
    removeCollaboratorConfirmModalTracking: {}
  }
});
export { UnifiedShareForm as UnifiedShareFormBase };
export default injectIntl(UnifiedShareForm);
//# sourceMappingURL=UnifiedShareForm.js.map
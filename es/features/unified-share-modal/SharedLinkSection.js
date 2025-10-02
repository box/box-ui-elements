function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, injectIntl } from 'react-intl';
import PlainButton from '../../components/plain-button';
import Button from '../../components/button';
import GuideTooltip from '../../components/guide-tooltip';
import TextInputWithCopyButton from '../../components/text-input-with-copy-button';
import Toggle from '../../components/toggle/Toggle';
import Tooltip from '../../components/tooltip';
import { convertToMs } from '../../utils/datetime';
import IconMail from '../../icons/general/IconMail';
import IconClock from '../../icons/general/IconClock';
import IconGlobe from '../../icons/general/IconGlobe';
import { bdlWatermelonRed } from '../../styles/variables';
import { isBoxNote } from '../../utils/file';
import Browser from '../../utils/Browser';
import convertToBoxItem from './utils/item';
import SharedLinkAccessMenu from './SharedLinkAccessMenu';
import SharedLinkPermissionMenu from './SharedLinkPermissionMenu';
import messages from './messages';
import { ANYONE_IN_COMPANY, ANYONE_WITH_LINK, CAN_EDIT, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY, PEOPLE_IN_ITEM } from './constants';
class SharedLinkSection extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "canAddSharedLink", (isSharedLinkEnabled, canAddLink) => {
      return !isSharedLinkEnabled && canAddLink;
    });
    _defineProperty(this, "canRemoveSharedLink", (isSharedLinkEnabled, canRemoveLink) => {
      return isSharedLinkEnabled && canRemoveLink;
    });
    _defineProperty(this, "getAllowedPermissionLevels", () => {
      const {
        isAllowEditSharedLinkForFileEnabled,
        sharedLink
      } = this.props;
      const {
        canChangeAccessLevel,
        isEditSettingAvailable,
        isDownloadSettingAvailable,
        permissionLevel
      } = sharedLink;
      let allowedPermissionLevels = [CAN_EDIT, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY];
      if (!canChangeAccessLevel) {
        // remove all but current level
        allowedPermissionLevels = allowedPermissionLevels.filter(level => level === permissionLevel);
      }

      // if we cannot set the download value, we remove this option from the dropdown
      if (!isDownloadSettingAvailable) {
        allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== CAN_VIEW_DOWNLOAD);
      }

      // if the user cannot edit, we remove this option from the dropdown
      if (!isEditSettingAvailable || !isAllowEditSharedLinkForFileEnabled) {
        allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== CAN_EDIT);
      }
      return allowedPermissionLevels;
    });
    this.state = {
      isAutoCreatingSharedLink: false,
      isCopySuccessful: null,
      isSharedLinkEditTooltipShown: false
    };
  }
  componentDidMount() {
    const {
      sharedLink,
      autoCreateSharedLink,
      addSharedLink,
      submitting
    } = this.props;
    if (autoCreateSharedLink && !this.state.isAutoCreatingSharedLink && sharedLink && !sharedLink.url && !submitting && !sharedLink.isNewSharedLink) {
      this.setState({
        isAutoCreatingSharedLink: true
      });
      addSharedLink();
    }
  }

  // We handle didUpdate but not didMount because
  // the component initially renders with empty data
  // in order to start showing UI components.
  // When getInitialData completes in the parent we
  // rerender with correct sharedLink data and can
  // check whether to auto create a new one.
  // Note: we are assuming the 2nd render is safe
  // to start doing this check.
  componentDidUpdate(prevProps) {
    const {
      sharedLink,
      autoCreateSharedLink,
      addSharedLink,
      sharedLinkEditTooltipTargetingApi,
      submitting,
      triggerCopyOnLoad,
      onCopyError = () => {},
      onCopySuccess = () => {},
      onCopyInit = () => {}
    } = this.props;
    const {
      isAutoCreatingSharedLink,
      isCopySuccessful,
      isSharedLinkEditTooltipShown
    } = this.state;
    if (autoCreateSharedLink && !isAutoCreatingSharedLink && !sharedLink.url && !submitting && !sharedLink.isNewSharedLink) {
      this.setState({
        isAutoCreatingSharedLink: true
      });
      addSharedLink();
    }
    if (!prevProps.sharedLink.url && sharedLink.url) {
      this.setState({
        isAutoCreatingSharedLink: false
      });
      if (this.toggleRef) {
        this.toggleRef.focus();
      }
    }
    if (Browser.canWriteToClipboard() && triggerCopyOnLoad && !isAutoCreatingSharedLink && sharedLink.url && isCopySuccessful === null) {
      onCopyInit();
      navigator.clipboard.writeText(sharedLink.url).then(() => {
        this.setState({
          isCopySuccessful: true
        });
        onCopySuccess();
      }).catch(() => {
        this.setState({
          isCopySuccessful: false
        });
        onCopyError();
      });
    }

    // if ESL ftux tooltip is showing on initial mount, we call onShow
    const allowedPermissionLevels = this.getAllowedPermissionLevels();
    if (allowedPermissionLevels.includes(CAN_EDIT) && sharedLinkEditTooltipTargetingApi && sharedLinkEditTooltipTargetingApi.canShow && !isSharedLinkEditTooltipShown) {
      const {
        onShow
      } = sharedLinkEditTooltipTargetingApi;
      onShow();
      this.setState({
        isSharedLinkEditTooltipShown: true
      });
    }
  }
  renderSharedLink() {
    const {
      autofocusSharedLink,
      changeSharedLinkAccessLevel,
      changeSharedLinkPermissionLevel,
      config,
      item,
      itemType,
      intl,
      onDismissTooltip,
      onEmailSharedLinkClick,
      sharedLink,
      sharedLinkEditTagTargetingApi,
      sharedLinkEditTooltipTargetingApi,
      submitting,
      trackingProps,
      triggerCopyOnLoad,
      tooltips
    } = this.props;
    const {
      isCopySuccessful,
      isSharedLinkEditTooltipShown
    } = this.state;
    const {
      accessLevel,
      accessLevelsDisabledReason,
      allowedAccessLevels,
      canChangeAccessLevel,
      enterpriseName,
      isEditAllowed,
      permissionLevel,
      url
    } = sharedLink;
    const {
      copyButtonProps: copyButtonTrackingProps,
      onChangeSharedLinkAccessLevel,
      onChangeSharedLinkPermissionLevel,
      onSharedLinkAccessMenuOpen,
      onSharedLinkCopy = noop,
      sendSharedLinkButtonProps,
      sharedLinkAccessMenuButtonProps: sharedLinkAccessMenuButtonTrackingProps,
      sharedLinkPermissionsMenuButtonProps: sharedLinkPermissionsMenuButtonTrackingProps
    } = trackingProps;
    const shouldTriggerCopyOnLoad = !!triggerCopyOnLoad && !!isCopySuccessful;

    /**
     * The email button should be rendered by default.
     * Only hide the button if there is a config prop that declares showEmailSharedLinkForm to be false.
     */
    const hideEmailButton = config && config.showEmailSharedLinkForm === false;
    const isEditableBoxNote = isBoxNote(convertToBoxItem(item)) && isEditAllowed;
    const allowedPermissionLevels = this.getAllowedPermissionLevels();
    const copyButtonProps = _objectSpread(_objectSpread({}, copyButtonTrackingProps), {}, {
      'data-target-id': 'Button-CopySharedLink'
    });
    const sharedLinkAccessMenuButtonProps = _objectSpread(_objectSpread({}, sharedLinkAccessMenuButtonTrackingProps), {}, {
      'data-target-id': 'Button-SharedLinkAccessMenuLabel'
    });
    const sharedLinkPermissionsMenuButtonProps = _objectSpread(_objectSpread({}, sharedLinkPermissionsMenuButtonTrackingProps), {}, {
      'data-target-id': 'Button-SharedLinkPermissionsMenuLabel'
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "shared-link-field-row"
    }, /*#__PURE__*/React.createElement(Tooltip, {
      className: "usm-ftux-tooltip",
      isShown: !!tooltips['shared-link-copy-button'],
      onDismiss: () => onDismissTooltip('shared-link-copy-button'),
      position: "middle-right",
      showCloseButton: true,
      text: tooltips['shared-link-copy-button'],
      theme: "callout"
    }, /*#__PURE__*/React.createElement(TextInputWithCopyButton, {
      "aria-label": intl.formatMessage(messages.sharedLinkURLLabel),
      autofocus: autofocusSharedLink,
      buttonProps: copyButtonProps,
      className: "shared-link-field-container",
      disabled: submitting,
      label: "",
      onCopySuccess: () => onSharedLinkCopy(permissionLevel),
      triggerCopyOnLoad: shouldTriggerCopyOnLoad,
      type: "url",
      value: url
    })), !hideEmailButton && /*#__PURE__*/React.createElement(Tooltip, {
      position: "top-left",
      text: intl.formatMessage(messages.sendSharedLink)
    }, /*#__PURE__*/React.createElement(Button, _extends({
      "aria-label": intl.formatMessage(messages.sendSharedLink),
      className: "email-shared-link-btn",
      "data-target-id": "Button-SendSharedLink",
      isDisabled: submitting,
      onClick: onEmailSharedLinkClick,
      type: "button"
    }, sendSharedLinkButtonProps), /*#__PURE__*/React.createElement(IconMail, null)))), /*#__PURE__*/React.createElement("div", {
      className: "shared-link-access-row"
    }, /*#__PURE__*/React.createElement(SharedLinkAccessMenu, {
      accessLevel: accessLevel,
      accessLevelsDisabledReason: accessLevelsDisabledReason,
      allowedAccessLevels: allowedAccessLevels,
      changeAccessLevel: changeSharedLinkAccessLevel,
      enterpriseName: enterpriseName,
      itemType: itemType,
      onDismissTooltip: () => onDismissTooltip('shared-link-access-menu'),
      tooltipContent: tooltips['shared-link-access-menu'] || null,
      submitting: submitting,
      trackingProps: {
        onChangeSharedLinkAccessLevel,
        onSharedLinkAccessMenuOpen,
        sharedLinkAccessMenuButtonProps
      }
    }), !isEditableBoxNote && accessLevel !== PEOPLE_IN_ITEM && /*#__PURE__*/React.createElement(GuideTooltip, {
      isShown: allowedPermissionLevels.includes(CAN_EDIT) && sharedLinkEditTooltipTargetingApi?.canShow,
      title: intl.formatMessage(messages.ftuxEditPermissionTooltipTitle),
      body: intl.formatMessage(messages.ftuxEditPermissionTooltipBody),
      onDismiss: () => {
        if (sharedLinkEditTooltipTargetingApi) {
          const {
            onClose
          } = sharedLinkEditTooltipTargetingApi;
          onClose();
        }
      },
      position: "bottom-center"
    }, /*#__PURE__*/React.createElement(SharedLinkPermissionMenu, {
      allowedPermissionLevels: allowedPermissionLevels,
      canChangePermissionLevel: canChangeAccessLevel,
      changePermissionLevel: changeSharedLinkPermissionLevel,
      isSharedLinkEditTooltipShown: isSharedLinkEditTooltipShown,
      permissionLevel: permissionLevel,
      sharedLinkEditTagTargetingApi: sharedLinkEditTagTargetingApi,
      sharedLinkEditTooltipTargetingApi: sharedLinkEditTooltipTargetingApi,
      submitting: submitting,
      trackingProps: {
        onChangeSharedLinkPermissionLevel,
        sharedLinkPermissionsMenuButtonProps
      }
    })), isEditableBoxNote && /*#__PURE__*/React.createElement(Tooltip, {
      text: intl.formatMessage(messages.sharedLinkPermissionsEditTooltip)
    }, /*#__PURE__*/React.createElement(PlainButton, {
      isDisabled: true,
      className: "can-edit-btn"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.sharedLinkPermissionsEdit)))), accessLevel === ANYONE_WITH_LINK && /*#__PURE__*/React.createElement("div", {
      className: "security-indicator-note"
    }, /*#__PURE__*/React.createElement("span", {
      className: "security-indicator-icon-globe"
    }, /*#__PURE__*/React.createElement(IconGlobe, {
      height: 12,
      width: 12
    })), permissionLevel === CAN_EDIT && /*#__PURE__*/React.createElement(FormattedMessage, _extends({
      "data-testid": "shared-link-editable-publicly-available-message"
    }, messages.sharedLinkEditablePubliclyAvailable)), permissionLevel !== CAN_EDIT && /*#__PURE__*/React.createElement(FormattedMessage, _extends({
      "data-testid": "shared-link-publicly-available-message"
    }, messages.sharedLinkPubliclyAvailable))), accessLevel === ANYONE_IN_COMPANY && permissionLevel === CAN_EDIT && /*#__PURE__*/React.createElement("div", {
      className: "security-indicator-note"
    }, /*#__PURE__*/React.createElement("span", {
      className: "security-indicator-icon-globe"
    }, /*#__PURE__*/React.createElement(IconGlobe, {
      height: 12,
      width: 12
    })), /*#__PURE__*/React.createElement(FormattedMessage, _extends({
      "data-testid": "shared-link-elevated-editable-company-available-message"
    }, messages.sharedLinkElevatedEditableCompanyAvailable))));
  }
  renderSharedLinkSettingsLink() {
    const {
      intl,
      onDismissTooltip,
      onSettingsClick,
      showSharedLinkSettingsCallout,
      trackingProps,
      tooltips
    } = this.props;
    const {
      sharedLinkSettingsButtonProps
    } = trackingProps;
    return /*#__PURE__*/React.createElement("div", {
      className: "shared-link-settings-btn-container"
    }, /*#__PURE__*/React.createElement(Tooltip, {
      className: "usm-ftux-tooltip",
      isShown: !!tooltips['shared-link-settings'] || showSharedLinkSettingsCallout,
      onDismiss: () => onDismissTooltip('shared-link-settings'),
      position: "middle-right",
      showCloseButton: true,
      text: tooltips['shared-link-settings'] || intl.formatMessage(messages.sharedLinkSettingsCalloutText),
      theme: "callout"
    }, /*#__PURE__*/React.createElement(PlainButton, _extends({}, sharedLinkSettingsButtonProps, {
      "aria-haspopup": "dialog",
      className: "shared-link-settings-btn",
      "data-target-id": "PlainButton-SharedLinkSettings",
      onClick: onSettingsClick,
      type: "button"
    }), /*#__PURE__*/React.createElement(FormattedMessage, messages.sharedLinkSettings))));
  }
  renderToggle() {
    const {
      intl,
      item,
      onDismissTooltip,
      onToggleSharedLink,
      sharedLink,
      submitting,
      tooltips
    } = this.props;
    const {
      canChangeAccessLevel,
      expirationTimestamp,
      url
    } = sharedLink;
    const isSharedLinkEnabled = !!url;
    const canAddSharedLink = this.canAddSharedLink(isSharedLinkEnabled, item.grantedPermissions.itemShare);
    const canRemoveSharedLink = this.canRemoveSharedLink(isSharedLinkEnabled, canChangeAccessLevel);
    const isToggleEnabled = (canAddSharedLink || canRemoveSharedLink) && !submitting;
    let linkText;
    if (isSharedLinkEnabled) {
      linkText = /*#__PURE__*/React.createElement(FormattedMessage, messages.linkShareOn);
      if (expirationTimestamp && expirationTimestamp !== 0) {
        linkText = /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FormattedMessage, messages.linkShareOn), /*#__PURE__*/React.createElement(Tooltip, {
          position: "top-center",
          text: intl.formatMessage(messages.sharedLinkExpirationTooltip, {
            expiration: convertToMs(expirationTimestamp)
          })
        }, /*#__PURE__*/React.createElement("span", {
          "aria-label": intl.formatMessage(messages.expiresMessage),
          className: "shared-link-expiration-badge",
          role: "img"
        }, /*#__PURE__*/React.createElement(IconClock, {
          color: bdlWatermelonRed
        }))));
      }
    } else {
      linkText = /*#__PURE__*/React.createElement(FormattedMessage, messages.linkShareOff);
    }
    const toggleComponent = /*#__PURE__*/React.createElement(Toggle, {
      "data-target-id": "Toggle-CreateSharedLink",
      isDisabled: !isToggleEnabled,
      isOn: isSharedLinkEnabled,
      label: linkText,
      name: "toggle",
      onChange: onToggleSharedLink,
      ref: ref => {
        this.toggleRef = ref;
      }
    });
    if (!submitting) {
      if (canAddSharedLink) {
        const sharedLinkToggleTooltip = tooltips['shared-link-toggle'];
        if (sharedLinkToggleTooltip) {
          return /*#__PURE__*/React.createElement(Tooltip, {
            className: "usm-ftux-tooltip",
            isShown: true,
            onDismiss: () => onDismissTooltip('shared-link-toggle'),
            position: "middle-left",
            showCloseButton: true,
            text: sharedLinkToggleTooltip,
            theme: "callout"
          }, toggleComponent);
        }
        return /*#__PURE__*/React.createElement(Tooltip, {
          targetWrapperClassName: "usm-ftux-toggle-tooltip-target",
          position: "top-right",
          text: intl.formatMessage(messages.sharedLinkDisabledTooltipCopy)
        }, toggleComponent);
      }
      if (!isToggleEnabled) {
        const tooltipDisabledMessage = isSharedLinkEnabled ? messages.removeLinkTooltip : messages.disabledCreateLinkTooltip;
        return /*#__PURE__*/React.createElement(Tooltip, {
          className: "usm-disabled-message-tooltip",
          position: "top-right",
          text: intl.formatMessage(tooltipDisabledMessage)
        }, toggleComponent);
      }
    }
    return toggleComponent;
  }
  render() {
    const {
      sharedLink,
      onSettingsClick
    } = this.props;
    const isSharedLinkEnabled = !!sharedLink.url;
    return /*#__PURE__*/React.createElement("div", {
      className: "be"
    }, /*#__PURE__*/React.createElement("hr", {
      className: "bdl-SharedLinkSection-separator"
    }), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
      className: "label bdl-Label"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.sharedLinkSectionLabel))), /*#__PURE__*/React.createElement("div", {
      className: "shared-link-toggle-row"
    }, this.renderToggle(), isSharedLinkEnabled && onSettingsClick && this.renderSharedLinkSettingsLink()), isSharedLinkEnabled && this.renderSharedLink());
  }
}
_defineProperty(SharedLinkSection, "defaultProps", {
  trackingProps: {},
  autoCreateSharedLink: false
});
export { SharedLinkSection as SharedLinkSectionBase };
export default injectIntl(SharedLinkSection);
//# sourceMappingURL=SharedLinkSection.js.map
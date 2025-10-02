function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '../../components/button';
import messages from './messages';
import PresenceAvatarList from './PresenceAvatarList';
import PresenceCollaboratorsList from './PresenceCollaboratorsList';
import { ARROW_DOWN, ENTER, SPACE } from '../../common/keyboard-events';
import { collaboratorsPropType, flyoutPositionPropType } from './propTypes';
import { Flyout, Overlay } from '../../components/flyout';
import { GROWTH_382_EXPERIMENT_BUCKET, GROWTH_382_AUTOFLY_CLASS, GROWTH_382_AUTOFLY_CLASS_FIRST_LOAD } from './constants';
import './Presence.scss';
class Presence extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isDropdownActive: false,
      showActivityPrompt: Boolean(this.props.collaborators.length && this.props.onClickViewCollaborators && this.props.experimentBucket === GROWTH_382_EXPERIMENT_BUCKET)
    });
    _defineProperty(this, "saveRefToContainer", el => {
      this.presenceContainerEl = el;
    });
    _defineProperty(this, "_handleOverlayOpen", event => {
      const {
        onFlyoutOpen
      } = this.props;
      this.setState({
        isDropdownActive: true
      });
      if (onFlyoutOpen) {
        onFlyoutOpen(event);
      }
    });
    _defineProperty(this, "_handleOverlayClose", event => {
      const {
        onFlyoutClose
      } = this.props;
      this.setState({
        isDropdownActive: false
      });
      if (onFlyoutClose) {
        onFlyoutClose(event);
      }
    });
    _defineProperty(this, "stopPropagationAndPreventDefault", event => {
      event.stopPropagation();
      event.preventDefault();
    });
    _defineProperty(this, "openDropDown", () => {
      if (this.presenceContainerEl) {
        this.presenceContainerEl.click();
      }
    });
    _defineProperty(this, "handleKeyDown", event => {
      switch (event.key) {
        case ARROW_DOWN:
        case ENTER:
        case SPACE:
          this.openDropDown();
          this.stopPropagationAndPreventDefault(event);
          break;
        default:
          break;
      }
    });
    // GROWTH-382 click through the first CTA, spawn the normal Presence dropdown
    _defineProperty(this, "_showRecentsFlyout", event => {
      const {
        onClickViewCollaborators
      } = this.props;
      onClickViewCollaborators();
      this.stopPropagationAndPreventDefault(event);
      this.setState({
        showActivityPrompt: false
      });
    });
  }
  render() {
    const {
      avatarAttributes,
      className,
      closeOnWindowBlur,
      collaborators,
      constrainToScrollParent,
      constrainToWindow,
      containerAttributes,
      flyoutPosition,
      getLinkCallback,
      intl,
      inviteCallback,
      maxAdditionalCollaboratorsNum,
      maxDisplayedAvatars,
      onAvatarMouseEnter,
      onAvatarMouseLeave,
      onFlyoutScroll
    } = this.props;
    const {
      isDropdownActive
    } = this.state;

    // GROWTH-382
    const {
      experimentBucket,
      onAccessStatsRequested
    } = this.props;
    const {
      showActivityPrompt
    } = this.state;
    let requestAccessStats = null;
    if (!showActivityPrompt && experimentBucket === GROWTH_382_EXPERIMENT_BUCKET) {
      requestAccessStats =
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      React.createElement("a", {
        className: "presence-overlay-request-stats",
        href: "#",
        onClick: onAccessStatsRequested
      }, /*#__PURE__*/React.createElement(FormattedMessage, messages.previewPresenceFlyoutAccessStatsLink));
    }
    const overlayClassNames = classNames('presence-overlay', {
      [GROWTH_382_AUTOFLY_CLASS]: experimentBucket && !showActivityPrompt,
      [GROWTH_382_AUTOFLY_CLASS_FIRST_LOAD]: experimentBucket && showActivityPrompt
    });
    const overlayContent = showActivityPrompt ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, messages.previewPresenceFlyoutCopy), /*#__PURE__*/React.createElement(Button, {
      className: "btn-primary",
      onClick: this._showRecentsFlyout
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.previewPresenceFlyoutActivityCTA))) : /*#__PURE__*/React.createElement(PresenceCollaboratorsList, {
      collaborators: collaborators,
      experimentBucket: experimentBucket,
      getLinkCallback: getLinkCallback,
      inviteCallback: inviteCallback,
      onScroll: onFlyoutScroll
    });
    return /*#__PURE__*/React.createElement(Flyout, {
      className: `presence ${className}`,
      closeOnWindowBlur: closeOnWindowBlur,
      constrainToScrollParent: constrainToScrollParent,
      constrainToWindow: constrainToWindow,
      isVisibleByDefault: showActivityPrompt,
      onClose: this._handleOverlayClose,
      onOpen: this._handleOverlayOpen,
      position: flyoutPosition
    }, /*#__PURE__*/React.createElement(PresenceAvatarList, _extends({
      ref: this.saveRefToContainer,
      "aria-label": intl.formatMessage(messages.toggleButtonLabel),
      avatarAttributes: avatarAttributes,
      className: classNames('presence-avatar-container', {
        'dropdown-active': isDropdownActive
      }),
      collaborators: collaborators,
      hideTooltips: isDropdownActive,
      maxAdditionalCollaborators: maxAdditionalCollaboratorsNum,
      maxDisplayedAvatars: maxDisplayedAvatars,
      onAvatarMouseEnter: onAvatarMouseEnter,
      onAvatarMouseLeave: onAvatarMouseLeave,
      onKeyDown: this.handleKeyDown
    }, containerAttributes)), /*#__PURE__*/React.createElement(Overlay, {
      className: overlayClassNames,
      shouldDefaultFocus: false
    }, overlayContent, requestAccessStats));
  }
}
/* eslint-disable no-underscore-dangle */
_defineProperty(Presence, "propTypes", {
  /** Addtional attributes for avatar container */
  avatarAttributes: PropTypes.object,
  className: PropTypes.string,
  collaborators: PropTypes.arrayOf(collaboratorsPropType).isRequired,
  /** Addtional attributes for presence container */
  containerAttributes: PropTypes.object,
  /** Get Link callback */
  getLinkCallback: PropTypes.func,
  /** Invite button callback */
  inviteCallback: PropTypes.func,
  /** Maximum number of avatars to display before showing a +{n} avatar */
  maxDisplayedAvatars: PropTypes.number,
  /** Maximum number of collaborators before displaying a {maxAdditionalCollaboratorsNum}+ avatar */
  maxAdditionalCollaboratorsNum: PropTypes.number,
  /** Callback funtion for avatar mouseEnter, argument: id of user */
  onAvatarMouseEnter: PropTypes.func,
  /** Callback function for avatar mouseLeave */
  onAvatarMouseLeave: PropTypes.func,
  /** Callback funtion for Flyout events, argument: SyntheticEvent */
  onFlyoutClose: PropTypes.func,
  onFlyoutOpen: PropTypes.func,
  onFlyoutScroll: PropTypes.func,
  /** GROWTH-382 bucketing */
  experimentBucket: PropTypes.string,
  /** GROWTH-382 broadcast that the user wants to view stats from the flyout */
  onAccessStatsRequested: PropTypes.func,
  /** GROWTH-382 log that the user wants to view collaborators from the flyout */
  onClickViewCollaborators: PropTypes.func,
  /** Option to change the orientation of the dropdown. MUST be: bottom-right, bottom-left, bottom-center etc. or in this specific format */
  flyoutPosition: flyoutPositionPropType,
  /** Sets the tether constraint to scrollParent for the flyout */
  constrainToScrollParent: PropTypes.bool,
  /** Sets the tether constraint to window for the flyout */
  constrainToWindow: PropTypes.bool,
  /** Closes the flyout when window loses focus */
  closeOnWindowBlur: PropTypes.bool,
  intl: PropTypes.any
});
_defineProperty(Presence, "defaultProps", {
  className: '',
  maxDisplayedAvatars: 3,
  maxAdditionalCollaboratorsNum: 99,
  experimentBucket: null,
  flyoutPosition: 'bottom-left',
  constrainToScrollParent: true,
  constrainToWindow: false,
  closeOnWindowBlur: false
});
export { Presence as PresenceComponent };
export default injectIntl(Presence);
//# sourceMappingURL=Presence.js.map
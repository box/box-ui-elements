function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '../../components/button';
import PresenceCollaborator from './PresenceCollaborator';
import messages from './messages';
import './PresenceCollaboratorsList.scss';
class PresenceCollaboratorsList extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isScrollableAbove: false,
      isScrollableBelow: false
    });
    _defineProperty(this, "calculateOverflow", elem => {
      const isScrollableAbove = elem.scrollTop > 0;
      const isScrollableBelow = elem.scrollTop < elem.scrollHeight - elem.clientHeight;
      return {
        isScrollableAbove,
        isScrollableBelow
      };
    });
    _defineProperty(this, "handleScroll", event => {
      const {
        onScroll
      } = this.props;
      if (this.elDropdownList) {
        this.setState(this.calculateOverflow(this.elDropdownList));
        if (onScroll) {
          onScroll(event);
        }
      }
    });
    _defineProperty(this, "throttledHandleScroll", throttle(this.handleScroll, 50, {
      leading: true,
      trailing: true
    }));
    _defineProperty(this, "renderTitle", () => /*#__PURE__*/React.createElement("div", {
      className: "bdl-PresenceCollaboratorsList-title"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.recentActivity)));
    _defineProperty(this, "renderActions", () => {
      const {
        getLinkCallback,
        inviteCallback
      } = this.props;
      return (getLinkCallback || inviteCallback) && /*#__PURE__*/React.createElement("div", {
        className: "bdl-PresenceCollaboratorsList-actions"
      }, /*#__PURE__*/React.createElement("div", null, getLinkCallback && /*#__PURE__*/React.createElement(Button, {
        onClick: getLinkCallback
      }, /*#__PURE__*/React.createElement(FormattedMessage, messages.getLinkButtonText)), inviteCallback && /*#__PURE__*/React.createElement(Button, {
        onClick: inviteCallback
      }, /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteButtonText))));
    });
  }
  componentDidMount() {
    const overflow = this.calculateOverflow(this.elDropdownList);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(overflow);
  }
  componentDidUpdate() {
    const overflow = this.calculateOverflow(this.elDropdownList);
    /**
     * recalculate overflow when dropdown is visible and new collabs are added
     * This will not go into an infinite loop because we check for changes in local component state
     */
    if (overflow.isScrollableAbove !== this.state.isScrollableAbove || overflow.isScrollableBelow !== this.state.isScrollableBelow) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(overflow);
    }
  }
  render() {
    const {
      isScrollableAbove,
      isScrollableBelow
    } = this.state;
    const {
      collaborators,
      getLinkCallback,
      inviteCallback
    } = this.props;
    const buttonsPresent = getLinkCallback || inviteCallback;
    const dropdownListClasses = classnames('bdl-PresenceCollaboratorsList-list', {
      'dropshadow-list': !buttonsPresent,
      'dropshadow-list-with-buttons': buttonsPresent,
      'is-scrollable-above': isScrollableAbove,
      'is-scrollable-below': isScrollableBelow
    });
    const title = this.renderTitle();
    const actions = this.renderActions();
    return /*#__PURE__*/React.createElement("div", {
      className: "bdl-PresenceCollaboratorsList"
    }, title, /*#__PURE__*/React.createElement("div", {
      ref: list => {
        this.elDropdownList = list;
      },
      className: dropdownListClasses,
      onScroll: this.throttledHandleScroll,
      role: "list"
    }, collaborators.map(collaborator => /*#__PURE__*/React.createElement(PresenceCollaborator, {
      collaborator: collaborator,
      key: collaborator.id,
      role: "listitem"
    }))), actions);
  }
}
_defineProperty(PresenceCollaboratorsList, "propTypes", {
  collaborators: PropTypes.arrayOf(PropTypes.shape({
    /** Url to avatar image. If passed in, component will render the avatar image instead of the initials */
    avatarUrl: PropTypes.string,
    /** Users id */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isActive: PropTypes.bool,
    /** Unix timestamp of when the user last interacted with the document */
    interactedAt: PropTypes.number,
    /** The type of interaction by the user */
    interactionType: PropTypes.string,
    /** User's full name */
    name: PropTypes.string.isRequired,
    /** Custom Profile URL */
    profileUrl: PropTypes.string
  })).isRequired,
  /* Get Link button callback. also controls visibility of button */
  getLinkCallback: PropTypes.func,
  /* Show Invite button callback. also controls visibility of button */
  inviteCallback: PropTypes.func,
  /* Callback for Dropdown onScroll event */
  onScroll: PropTypes.func,
  /* Intl object */
  intl: PropTypes.any
});
export { PresenceCollaboratorsList as PresenceCollaboratorsListComponent };
export default injectIntl(PresenceCollaboratorsList);
//# sourceMappingURL=PresenceCollaboratorsList.js.map
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ModalActions } from '../../components/modal';
import Button from '../../components/button';
import { Link } from '../../components/link';
import CollaborationBadge from '../../icons/badges/CollaborationBadge';
import commonMessages from '../../common/messages';
import CollaboratorListItem from './CollaboratorListItem';
import messages from './messages';
import './CollaboratorList.scss';
const MAX_COLLABORATOR_LIST_SIZE = 90;
class CollaboratorList extends React.Component {
  createCollaboratorPageLink(children, trackingProp) {
    const {
      item
    } = this.props;
    const {
      type,
      id
    } = item;
    const collaboratorsPageLink = `/${type}/${id}/collaborators/`;
    return /*#__PURE__*/React.createElement(Link, _extends({
      href: collaboratorsPageLink,
      rel: "noopener",
      target: "_blank"
    }, trackingProp), children);
  }
  render() {
    const {
      canRemoveCollaborators,
      collaborators,
      onDoneClick,
      maxCollaboratorListSize,
      onRemoveCollaboratorClick,
      trackingProps
    } = this.props;
    const {
      usernameProps,
      emailProps,
      manageLinkProps,
      viewAdditionalProps,
      doneButtonProps
    } = trackingProps;
    const manageAllBtn = /*#__PURE__*/React.createElement("span", {
      className: "manage-all-btn"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.manageAllLinkText));
    const maxListSizeToRender = Math.min(maxCollaboratorListSize, MAX_COLLABORATOR_LIST_SIZE);
    return /*#__PURE__*/React.createElement("div", {
      className: "usm-collaborator-list"
    }, /*#__PURE__*/React.createElement("div", {
      className: "manage-all-btn-container"
    }, this.createCollaboratorPageLink(manageAllBtn, manageLinkProps)), /*#__PURE__*/React.createElement("ul", {
      className: "be collaborator-list"
    }, collaborators.slice(0, maxListSizeToRender).map((collaborator, index) => {
      const {
        collabID,
        type
      } = collaborator;
      return /*#__PURE__*/React.createElement(CollaboratorListItem, {
        key: `${collabID}-${type}`,
        collaborator: collaborator,
        index: index,
        trackingProps: {
          usernameProps,
          emailProps
        },
        canRemoveCollaborators: canRemoveCollaborators,
        onRemoveCollaborator: onRemoveCollaboratorClick
      });
    }), collaborators.length > maxListSizeToRender && /*#__PURE__*/React.createElement("li", {
      className: "collaborator-list-item more"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CollaborationBadge, {
      height: 32,
      width: 32
    })), /*#__PURE__*/React.createElement("div", null, this.createCollaboratorPageLink(/*#__PURE__*/React.createElement(FormattedMessage, messages.viewAdditionalPeopleText), viewAdditionalProps)))), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, _extends({
      className: "btn-done",
      onClick: onDoneClick,
      type: "button"
    }, doneButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.done))));
  }
}
_defineProperty(CollaboratorList, "defaultProps", {
  maxCollaboratorListSize: MAX_COLLABORATOR_LIST_SIZE
});
export default CollaboratorList;
//# sourceMappingURL=CollaboratorList.js.map
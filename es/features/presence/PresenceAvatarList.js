const _excluded = ["avatarAttributes", "className", "collaborators", "hideAdditionalCount", "hideTooltips", "maxAdditionalCollaborators", "maxDisplayedAvatars", "onAvatarMouseEnter", "onAvatarMouseLeave"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
// @ts-ignore flow import
import PresenceAvatar from './PresenceAvatar';
import PresenceAvatarTooltipContent from './PresenceAvatarTooltipContent';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
import './PresenceAvatarList.scss';
function PresenceAvatarList(props, ref) {
  const {
      avatarAttributes,
      className,
      collaborators,
      hideAdditionalCount,
      hideTooltips,
      maxAdditionalCollaborators = 99,
      maxDisplayedAvatars = 3,
      onAvatarMouseEnter = noop,
      onAvatarMouseLeave = noop
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  const [activeTooltip, setActiveTooltip] = React.useState(null);
  const hideTooltip = () => {
    setActiveTooltip(null);
    if (onAvatarMouseLeave) {
      onAvatarMouseLeave();
    }
  };
  const showTooltip = id => {
    setActiveTooltip(id);
    if (onAvatarMouseEnter) {
      onAvatarMouseEnter(id);
    }
  };
  if (!collaborators.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: classNames('bdl-PresenceAvatarList', className)
  }, rest), collaborators.slice(0, maxDisplayedAvatars).map(collaborator => {
    const {
      id,
      avatarUrl,
      name,
      isActive,
      interactedAt,
      interactionType
    } = collaborator;
    return /*#__PURE__*/React.createElement(Tooltip, {
      key: id,
      isShown: !hideTooltips && activeTooltip === id,
      position: TooltipPosition.BOTTOM_CENTER,
      text: /*#__PURE__*/React.createElement(PresenceAvatarTooltipContent, {
        name: name,
        interactedAt: interactedAt,
        interactionType: interactionType,
        isActive: isActive
      })
    }, /*#__PURE__*/React.createElement(PresenceAvatar, _extends({
      "aria-hidden": "true",
      avatarUrl: avatarUrl,
      id: id,
      isActive: isActive,
      name: name,
      onBlur: hideTooltip,
      onFocus: () => showTooltip(id),
      onMouseEnter: () => showTooltip(id),
      onMouseLeave: hideTooltip
    }, avatarAttributes)));
  }), !hideAdditionalCount && collaborators.length > maxDisplayedAvatars && /*#__PURE__*/React.createElement("div", _extends({
    className: classNames('bdl-PresenceAvatarList-count', 'avatar')
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    ,
    tabIndex: 0
  }, avatarAttributes), collaborators.length - maxDisplayedAvatars > maxAdditionalCollaborators ? `${maxAdditionalCollaborators}+` : `+${collaborators.length - maxDisplayedAvatars}`));
}
export { PresenceAvatarList as PresenceAvatarListComponent };
export default /*#__PURE__*/React.forwardRef(PresenceAvatarList);
//# sourceMappingURL=PresenceAvatarList.js.map
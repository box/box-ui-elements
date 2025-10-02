/**
 * @file Share Access Select component
 * @author Box
 */

import * as React from 'react';
import { useIntl } from 'react-intl';
import { ACCESS_NONE, ACCESS_OPEN, ACCESS_COLLAB, ACCESS_COMPANY } from '../../../constants';
import './ShareAccessSelect.scss';
import messages from '../messages';
const ShareAccessSelect = ({
  className,
  canSetShareAccess,
  onChange,
  item
}) => {
  const {
    formatMessage
  } = useIntl();
  const {
    allowed_shared_link_access_levels: allowedSharedAccessLevels,
    permissions,
    shared_link: sharedLink
  } = item;
  if (!allowedSharedAccessLevels) {
    return /*#__PURE__*/React.createElement("span", null);
  }
  const {
    access = ACCESS_NONE
  } = sharedLink || {};
  const {
    can_set_share_access: allowShareAccessChange
  } = permissions || {};
  const changeHandler = ({
    target
  }) => onChange(target.value, item);
  const allowOpen = allowedSharedAccessLevels.indexOf(ACCESS_OPEN) > -1;
  const allowCollab = allowedSharedAccessLevels.indexOf(ACCESS_COLLAB) > -1;
  const allowCompany = allowedSharedAccessLevels.indexOf(ACCESS_COMPANY) > -1;
  const allowed = canSetShareAccess && allowShareAccessChange && (allowOpen || allowCompany || allowCollab);
  if (!allowed) {
    return /*#__PURE__*/React.createElement("span", null);
  }

  /* eslint-disable jsx-a11y/no-onchange */
  return /*#__PURE__*/React.createElement("select", {
    className: `be-share-access-select ${className}`,
    onChange: changeHandler,
    value: access
  }, allowOpen ? /*#__PURE__*/React.createElement("option", {
    value: ACCESS_OPEN
  }, formatMessage(messages.shareAccessOpen)) : null, allowCollab ? /*#__PURE__*/React.createElement("option", {
    value: ACCESS_COLLAB
  }, formatMessage(messages.shareAccessCollab)) : null, allowCompany ? /*#__PURE__*/React.createElement("option", {
    value: ACCESS_COMPANY
  }, formatMessage(messages.shareAccessCompany)) : null, /*#__PURE__*/React.createElement("option", {
    value: ACCESS_NONE
  }, access === ACCESS_NONE ? formatMessage(messages.shareAccessNone) : formatMessage(messages.shareAccessRemove)));
};
export default ShareAccessSelect;
//# sourceMappingURL=ShareAccessSelect.js.map
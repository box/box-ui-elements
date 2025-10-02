import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { ANONYMOUS_USER_ID } from './constants';
const formatUser = ({
  email,
  id,
  name
}, intl, isComponent = false) => {
  const {
    anonymousUser,
    unknownUser
  } = messages;
  let targetUser = isComponent || !intl ? /*#__PURE__*/React.createElement(FormattedMessage, unknownUser) : intl.formatMessage(unknownUser);
  let targetUserInfo = `(${email || id})`;
  if (id === ANONYMOUS_USER_ID) {
    targetUser = isComponent || !intl ? /*#__PURE__*/React.createElement(FormattedMessage, anonymousUser) : intl.formatMessage(anonymousUser);
    targetUserInfo = '';
  } else if (name) {
    targetUser = name;
    targetUserInfo = `(${email || id})`;
  } else if (email) {
    targetUser = id;
    targetUserInfo = `(${email || id})`;
  }
  const formattedUser = isComponent ? /*#__PURE__*/React.createElement(React.Fragment, null, targetUser, targetUserInfo ? ` ${targetUserInfo}` : '') : `${String(targetUser)} ${targetUserInfo}`.trim();
  return formattedUser;
};
const FormattedUser = props => formatUser(props, undefined, true);
export { formatUser };
export default FormattedUser;
//# sourceMappingURL=FormattedUser.js.map
import * as React from 'react';
import classNames from 'classnames';
import './styles/MessageFooter.scss';
import MessageFormattedDate from './MessageFormattedDate';
const renderActionItem = (actionItem, name) => {
  if (!actionItem) {
    return null;
  }
  const {
    label,
    actions
  } = actionItem;
  const openURLAction = actions.find(action => {
    return action.type === 'openURL';
  });
  if (openURLAction && openURLAction.url && openURLAction.target) {
    return /*#__PURE__*/React.createElement("a", {
      className: "MessageFooter-action",
      "data-resin-target": `messageCenterAction|${name}`,
      href: openURLAction.url,
      target: openURLAction.target
    }, label, " \u2192");
  }
  return null;
};
function MessageFooter({
  actionItem,
  className = '',
  date,
  name
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('MessageFooter', className)
  }, /*#__PURE__*/React.createElement("span", {
    className: "MessageFooter-date"
  }, /*#__PURE__*/React.createElement(MessageFormattedDate, {
    date: date
  })), renderActionItem(actionItem, name));
}
export default MessageFooter;
//# sourceMappingURL=MessageFooter.js.map
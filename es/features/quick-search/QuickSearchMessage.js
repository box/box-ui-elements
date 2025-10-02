import * as React from 'react';
import classNames from 'classnames';
import './QuickSearchMessage.scss';
const QuickSearchMessage = ({
  children,
  isShown
}) => {
  const className = classNames('overlay-wrapper', {
    'is-visible': isShown
  }, 'quick-search-message');
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("p", {
    className: "overlay"
  }, children));
};
QuickSearchMessage.defaultProps = {
  isShown: false
};
export default QuickSearchMessage;
//# sourceMappingURL=QuickSearchMessage.js.map
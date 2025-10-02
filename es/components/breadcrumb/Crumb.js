import * as React from 'react';
import classNames from 'classnames';
const Crumb = ({
  children,
  className,
  isLastCrumb
}) => {
  const classes = classNames('breadcrumb-item', className, {
    'breadcrumb-item-last': isLastCrumb
  });
  return /*#__PURE__*/React.createElement("li", {
    className: classes
  }, children);
};
export default Crumb;
//# sourceMappingURL=Crumb.js.map
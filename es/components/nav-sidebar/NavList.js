import * as React from 'react';
import classNames from 'classnames';
const NavList = ({
  children,
  className = '',
  collapsed = false,
  heading,
  placeholder,
  ulProps = {}
}) => {
  const classes = classNames(`nav-list`, className, {
    'is-collapsed': collapsed
  });
  return /*#__PURE__*/React.createElement("nav", {
    className: classes
  }, heading ? /*#__PURE__*/React.createElement("h2", null, heading) : null, placeholder, /*#__PURE__*/React.createElement("ul", ulProps, React.Children.map(children, link => link ? /*#__PURE__*/React.createElement("li", null, link) : null)));
};
export default NavList;
//# sourceMappingURL=NavList.js.map
const _excluded = ["href", "children"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';
import Link from '../Link';
import notes from './Link.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(Link, {
  href: "https://www.box.com/platform"
}, "A link");
export const withCustomComponent = () => {
  // You can pass a custom component to be used instead of the default "a" tag, like a React Router link:
  // import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

  const CustomRouterLink = _ref => {
    let {
        href,
        children
      } = _ref,
      rest = _objectWithoutProperties(_ref, _excluded);
    return (
      /*#__PURE__*/
      // @ts-ignore TODO: figure out why this is giving a TS error
      React.createElement(RouterLink, _extends({
        to: href
      }, rest), children)
    );
  };
  return (
    /*#__PURE__*/
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    React.createElement(Router, null, /*#__PURE__*/React.createElement(Link, {
      component: CustomRouterLink,
      href: "/"
    }, "A link"))
  );
};
export default {
  title: 'Components/Links/Link',
  component: Link,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Link.stories.js.map
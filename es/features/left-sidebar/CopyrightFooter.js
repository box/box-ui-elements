function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import LinkBase from '../../components/link/LinkBase';
import './styles/CopyrightFooter.scss';
const CopyrightLink = props => {
  const {
    linkProps = {},
    date = new Date()
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    className: "copyright-footer"
  }, /*#__PURE__*/React.createElement("small", {
    className: "copyright"
  }, /*#__PURE__*/React.createElement(LinkBase, _extends({
    href: "/about-us"
  }, linkProps), "\xA9 ", date.getFullYear(), " Box Inc.")));
};
export default CopyrightLink;
//# sourceMappingURL=CopyrightFooter.js.map
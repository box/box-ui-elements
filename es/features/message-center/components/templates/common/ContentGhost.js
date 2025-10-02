import * as React from 'react';
import Ghost from '../../../../../components/ghost/Ghost';
import './styles/ContentGhost.scss';
function ContentGhost() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ContentGhost"
  }, /*#__PURE__*/React.createElement(Ghost, {
    className: "ContentGhost-title",
    height: 24,
    width: 280
  }), /*#__PURE__*/React.createElement(Ghost, {
    className: "ContentGhost-body",
    height: 80
  }), /*#__PURE__*/React.createElement("div", {
    className: "ContentGhost-footer"
  }, /*#__PURE__*/React.createElement(Ghost, {
    className: "ContentGhost-dateGhost",
    height: 20,
    width: 96
  }), /*#__PURE__*/React.createElement(Ghost, {
    className: "ContentGhost-linkGhost",
    height: 20,
    width: 96
  })));
}
export default ContentGhost;
//# sourceMappingURL=ContentGhost.js.map
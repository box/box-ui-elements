import * as React from 'react';
import ProgressBar from './ProgressBar';
import './ItemProgress.scss';
const ItemProgress = ({
  progress
}) => /*#__PURE__*/React.createElement("div", {
  className: "bcu-ItemProgress"
}, /*#__PURE__*/React.createElement(ProgressBar, {
  percent: progress
}), /*#__PURE__*/React.createElement("div", {
  className: "bcu-ItemProgress-label"
}, progress, "%"));
export default ItemProgress;
//# sourceMappingURL=ItemProgress.js.map
/**
 * 
 * @file Read only transcript row component
 * @author Box
 */

import * as React from 'react';
import PlainButton from '../../../../components/plain-button/PlainButton';
const ReadOnlyTranscriptRow = ({
  time,
  text = '',
  onClick,
  interactionTarget
}) => /*#__PURE__*/React.createElement(PlainButton, {
  className: "be-transcript-row",
  "data-resin-target": interactionTarget,
  onClick: onClick,
  type: "button"
}, time && /*#__PURE__*/React.createElement("div", {
  className: "be-transcript-time"
}, time), /*#__PURE__*/React.createElement("div", {
  className: "be-transcript-text"
}, text));
export default ReadOnlyTranscriptRow;
//# sourceMappingURL=ReadOnlyTranscriptRow.js.map
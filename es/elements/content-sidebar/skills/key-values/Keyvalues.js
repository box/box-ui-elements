/**
 * 
 * @file File Key Values Skill Data component
 * @author Box
 */

import * as React from 'react';
import './Keyvalues.scss';
const Keyvalues = ({
  card: {
    entries
  }
}) => /*#__PURE__*/React.createElement("div", {
  className: "be-keyvalues"
}, Array.isArray(entries) && entries.map(({
  label,
  text
}, index) => !!label && !!text &&
/*#__PURE__*/
/* eslint-disable react/no-array-index-key */
React.createElement("dl", {
  key: index,
  className: "be-keyvalue"
}, /*#__PURE__*/React.createElement("dt", null, label), /*#__PURE__*/React.createElement("dd", null, text))
/* eslint-enable react/no-array-index-key */));
export default Keyvalues;
//# sourceMappingURL=Keyvalues.js.map
/**
 * 
 * @file Preview sidebar additional tab placeholder component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
const AdditionalTabPlaceholder = ({
  isLoading = false
}) => {
  const classes = classNames('bdl-AdditionalTabPlaceholder-icon', {
    'bdl-AdditionalTabPlaceholder-icon--loading': isLoading
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-AdditionalTabPlaceholder",
    "data-testid": "additionaltabplaceholder"
  }, /*#__PURE__*/React.createElement("div", {
    className: classes
  }));
};
export default AdditionalTabPlaceholder;
//# sourceMappingURL=AdditionalTabPlaceholder.js.map
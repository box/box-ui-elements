import * as React from 'react';
import noop from 'lodash/noop';
import PaginationControls from './PaginationControls';
const MarkerBasedPagination = ({
  hasNextMarker = false,
  hasPrevMarker = false,
  isSmall,
  onMarkerBasedPageChange = noop
}) => {
  if (!hasNextMarker && !hasPrevMarker) {
    return null;
  }
  const handleNextClick = () => {
    onMarkerBasedPageChange(1);
  };
  const handlePreviousClick = () => {
    onMarkerBasedPageChange(-1);
  };
  return /*#__PURE__*/React.createElement(PaginationControls, {
    handleNextClick: handleNextClick,
    handlePreviousClick: handlePreviousClick,
    hasNextPage: hasNextMarker,
    hasPageEntryStatus: false,
    hasPreviousPage: hasPrevMarker,
    isSmall: isSmall
  });
};
export default MarkerBasedPagination;
//# sourceMappingURL=MarkerBasedPagination.js.map
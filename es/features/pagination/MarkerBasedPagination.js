/**
 * 
 * @file Offset Based Pagination component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import PaginationControls from './PaginationControls';
const MarkerBasedPagination = ({
  hasNextMarker = false,
  hasPrevMarker = false,
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
    hasPreviousPage: hasPrevMarker,
    isOffsetBasedPagination: false
  });
};
export default MarkerBasedPagination;
//# sourceMappingURL=MarkerBasedPagination.js.map
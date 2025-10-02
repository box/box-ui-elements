import * as React from 'react';
export interface MarkerBasedPaginationProps {
    hasNextMarker?: boolean;
    hasPrevMarker?: boolean;
    isSmall: boolean;
    onMarkerBasedPageChange?: (offset: number) => void;
}
declare const MarkerBasedPagination: ({ hasNextMarker, hasPrevMarker, isSmall, onMarkerBasedPageChange, }: MarkerBasedPaginationProps) => React.JSX.Element;
export default MarkerBasedPagination;

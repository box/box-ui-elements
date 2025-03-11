import * as React from 'react';
import noop from 'lodash/noop';
import PaginationControls from './PaginationControls';

export interface MarkerBasedPaginationProps {
    hasNextMarker?: boolean;
    hasPrevMarker?: boolean;
    isSmall: boolean;
    onMarkerBasedPageChange?: (offset: number) => void;
}

const MarkerBasedPagination = ({
    hasNextMarker = false,
    hasPrevMarker = false,
    isSmall,
    onMarkerBasedPageChange = noop,
}: MarkerBasedPaginationProps) => {
    if (!hasNextMarker && !hasPrevMarker) {
        return null;
    }
    const handleNextClick = () => {
        onMarkerBasedPageChange(1);
    };

    const handlePreviousClick = () => {
        onMarkerBasedPageChange(-1);
    };

    return (
        <PaginationControls
            handleNextClick={handleNextClick}
            handlePreviousClick={handlePreviousClick}
            hasNextPage={hasNextMarker}
            hasPageEntryStatus={false}
            hasPreviousPage={hasPrevMarker}
            isSmall={isSmall}
        />
    );
};

export default MarkerBasedPagination;

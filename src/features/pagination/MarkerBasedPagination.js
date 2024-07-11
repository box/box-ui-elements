/**
 * @flow
 * @file Offset Based Pagination component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import PaginationControls from './PaginationControls';

type Props = {
    hasNextMarker?: boolean,
    hasPrevMarker?: boolean,
    onMarkerBasedPageChange?: Function,
};

const MarkerBasedPagination = ({
    hasNextMarker = false,
    hasPrevMarker = false,
    onMarkerBasedPageChange = noop,
}: Props) => {
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
            hasPreviousPage={hasPrevMarker}
            isOffsetBasedPagination={false}
        />
    );
};

export default MarkerBasedPagination;

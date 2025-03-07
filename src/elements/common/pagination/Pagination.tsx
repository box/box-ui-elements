import * as React from 'react';
import MarkerBasedPagination from './MarkerBasedPagination';
import OffsetBasedPagination from './OffsetBasedPagination';
import './Pagination.scss';

export interface PaginationProps {
    hasNextMarker?: boolean;
    hasPrevMarker?: boolean;
    isSmall: boolean;
    offset?: number;
    onMarkerBasedPageChange?: (offset: number) => void;
    onOffsetChange?: (offset: number) => void;
    pageSize?: number;
    totalCount?: number;
}

const Pagination = ({ hasNextMarker, hasPrevMarker, isSmall, onMarkerBasedPageChange, ...rest }: PaginationProps) => {
    if (hasNextMarker || hasPrevMarker) {
        return (
            <MarkerBasedPagination
                hasNextMarker={hasNextMarker}
                hasPrevMarker={hasPrevMarker}
                isSmall={isSmall}
                onMarkerBasedPageChange={onMarkerBasedPageChange}
            />
        );
    }

    return <OffsetBasedPagination isSmall={isSmall} {...rest} />;
};

export default Pagination;

import * as React from 'react';
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
declare const Pagination: ({ hasNextMarker, hasPrevMarker, isSmall, onMarkerBasedPageChange, ...rest }: PaginationProps) => React.JSX.Element;
export default Pagination;

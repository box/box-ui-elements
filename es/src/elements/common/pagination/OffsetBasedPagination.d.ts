import * as React from 'react';
export interface OffsetBasedPaginationProps {
    isSmall: boolean;
    offset?: number;
    onOffsetChange?: (offset: number) => void;
    pageSize?: number;
    totalCount?: number;
}
declare const OffsetBasedPagination: ({ isSmall, offset, onOffsetChange, pageSize, totalCount, }: OffsetBasedPaginationProps) => React.JSX.Element;
export default OffsetBasedPagination;

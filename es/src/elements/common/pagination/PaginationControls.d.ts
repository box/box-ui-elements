import * as React from 'react';
import './Pagination.scss';
export interface PaginationControlsProps {
    handleNextClick: () => void;
    handlePreviousClick: () => void;
    hasNextPage: boolean;
    hasPageEntryStatus?: boolean;
    hasPreviousPage: boolean;
    isSmall: boolean;
    offset?: number;
    pageSize?: number;
    totalCount?: number;
}
declare const PaginationControls: ({ handleNextClick, handlePreviousClick, hasNextPage, hasPageEntryStatus, hasPreviousPage, isSmall, offset, pageSize, totalCount, }: PaginationControlsProps) => React.JSX.Element;
export default PaginationControls;

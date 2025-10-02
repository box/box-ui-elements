import * as React from 'react';
import type { SortBy, SortDirection } from '../../../common/types/core';
export interface SortProps {
    onSortChange: (sortBy: SortBy, sortDirection: SortDirection) => void;
    portalElement?: HTMLElement;
}
declare const Sort: ({ onSortChange, portalElement }: SortProps) => React.JSX.Element;
export default Sort;

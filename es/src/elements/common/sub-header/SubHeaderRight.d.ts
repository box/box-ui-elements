import * as React from 'react';
import type { Selection } from 'react-aria-components';
import { type BulkItemAction } from './BulkItemActionMenu';
import type { ViewMode } from '../flowTypes';
import type { SortBy, SortDirection, View, Collection } from '../../../common/types/core';
import './SubHeaderRight.scss';
export interface SubHeaderRightProps {
    bulkItemActions?: BulkItemAction[];
    canCreateNewFolder: boolean;
    canUpload: boolean;
    currentCollection: Collection;
    gridColumnCount: number;
    gridMaxColumns: number;
    gridMinColumns: number;
    maxGridColumnCountForWidth: number;
    onCreate: () => void;
    onGridViewSliderChange: (newSliderValue: number) => void;
    onSortChange: (sortBy: SortBy, sortDirection: SortDirection) => void;
    onMetadataSidePanelToggle?: () => void;
    onUpload: () => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    portalElement?: HTMLElement;
    selectedItemIds?: Selection;
    view: View;
    viewMode: ViewMode;
}
declare const SubHeaderRight: ({ bulkItemActions, canCreateNewFolder, canUpload, currentCollection, gridColumnCount, gridMaxColumns, gridMinColumns, maxGridColumnCountForWidth, onCreate, onGridViewSliderChange, onSortChange, onMetadataSidePanelToggle, onUpload, onViewModeChange, portalElement, selectedItemIds, view, viewMode, }: SubHeaderRightProps) => React.JSX.Element;
export default SubHeaderRight;

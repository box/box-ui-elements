/**
 * @file Content sub header component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { PageHeader } from '@box/blueprint-web';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';
import { View, Collection, SortBy, SortDirection } from '../../../common/types/core';

import './SubHeader.scss';

interface SubHeaderProps {
    canCreateNewFolder: boolean;
    canUpload: boolean;
    className?: string;
    currentCollection: Collection;
    isSmall: boolean;
    onCreate?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onItemClick: (id: string) => void;
    onSortChange: (sortBy: SortBy, sortDirection: SortDirection) => void;
    onUpload?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onViewModeChange?: (viewMode: string) => void;
    rootId: string;
    rootName?: string;
    sortBy: SortBy;
    sortDirection: SortDirection;
    view: View;
    viewMode?: string;
}

const SubHeader = ({
    canCreateNewFolder,
    canUpload,
    className,
    currentCollection,
    isSmall,
    onCreate,
    onItemClick,
    onSortChange,
    onUpload,
    onViewModeChange,
    rootId,
    rootName,
    view,
    viewMode,
}: SubHeaderProps) => {
    const hasViewModeChangeCallback = typeof onViewModeChange === 'function';
    const hasItems = currentCollection.items instanceof Array && currentCollection.items.length > 0;
    const hasGridView = hasViewModeChangeCallback && hasItems;

    const SubHeaderLeftSection = (
        <SubHeaderLeft
            currentCollection={currentCollection}
            isSmall={isSmall}
            onItemClick={onItemClick}
            rootId={rootId}
            rootName={rootName}
            view={view}
        />
    );

    const SubHeaderRightSection = hasGridView ? (
        <SubHeaderRight
            canCreateNewFolder={canCreateNewFolder}
            canUpload={canUpload}
            currentCollection={currentCollection}
            gridColumnCount={0}
            gridMaxColumns={0}
            gridMinColumns={0}
            maxGridColumnCountForWidth={0}
            onCreate={onCreate}
            onGridViewSliderChange={() => {
                /* No-op */
            }}
            onSortChange={onSortChange}
            onUpload={onUpload}
            onViewModeChange={onViewModeChange}
            view={view}
            viewMode={viewMode || ''}
        />
    ) : null;

    return (
        <PageHeader.Root className={classNames('be-sub-header', className)} variant="default">
            <PageHeader.StartElements>{SubHeaderLeftSection}</PageHeader.StartElements>
            <PageHeader.EndElements>{SubHeaderRightSection}</PageHeader.EndElements>
        </PageHeader.Root>
    );
};

export default SubHeader;

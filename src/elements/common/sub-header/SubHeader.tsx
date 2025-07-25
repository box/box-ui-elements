import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { PageHeader } from '@box/blueprint-web';
import { Selection } from 'react-aria-components';
import SubHeaderLeft from './SubHeaderLeft';
import SubheaderLeftMetadataViewV2 from './SubHeaderLeftMetadataViewV2';
import SubHeaderRight from './SubHeaderRight';
import type { ViewMode } from '../flowTypes';
import type { View, Collection } from '../../../common/types/core';
import { VIEW_MODE_LIST, VIEW_METADATA } from '../../../constants';
import { useFeatureEnabled } from '../feature-checking';

import './SubHeader.scss';

export interface SubHeaderProps {
    canCreateNewFolder: boolean;
    canUpload: boolean;
    currentCollection: Collection;
    gridColumnCount?: number;
    gridMaxColumns?: number;
    gridMinColumns?: number;
    isSmall: boolean;
    maxGridColumnCountForWidth?: number;
    onCreate: () => void;
    onGridViewSliderChange?: (newSliderValue: number) => void;
    onItemClick: (id: string | null, triggerNavigationEvent: boolean | null) => void;
    onSortChange: (sortBy: string, sortDirection: string) => void;
    onUpload: () => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    portalElement?: HTMLElement;
    rootId: string;
    rootName?: string;
    view: View;
    viewMode?: ViewMode;
    selectedKeys: Selection;
    onClearSelectedKeys: () => void;
}

const SubHeader = ({
    canCreateNewFolder,
    canUpload,
    currentCollection,
    gridColumnCount = 0,
    gridMaxColumns = 0,
    gridMinColumns = 0,
    maxGridColumnCountForWidth = 0,
    onGridViewSliderChange = noop,
    isSmall,
    onCreate,
    onItemClick,
    onSortChange,
    onUpload,
    onViewModeChange,
    portalElement,
    rootId,
    rootName,
    view,
    viewMode = VIEW_MODE_LIST,
    selectedKeys,
    onClearSelectedKeys,
}: SubHeaderProps) => {
    const isMetadataViewV2Feature = useFeatureEnabled('contentExplorer.metadataViewV2');

    if (view === VIEW_METADATA && !isMetadataViewV2Feature) {
        return null;
    }

    return (
        <PageHeader.Root
            className={classNames('be-sub-header', { 'be-sub-header--metadata-view': isMetadataViewV2Feature })}
            data-testid="be-sub-header"
            variant="inline"
        >
            <PageHeader.StartElements>
                {view !== VIEW_METADATA && !isMetadataViewV2Feature && (
                    <SubHeaderLeft
                        currentCollection={currentCollection}
                        isSmall={isSmall}
                        onItemClick={onItemClick}
                        portalElement={portalElement}
                        rootId={rootId}
                        rootName={rootName}
                        view={view}
                    />
                )}
                {isMetadataViewV2Feature && (
                    <SubheaderLeftMetadataViewV2
                        title="My Custom Title dude"
                        currentCollection={currentCollection}
                        selectedKeys={selectedKeys}
                        onClearSelectedKeys={onClearSelectedKeys}
                    />
                )}
            </PageHeader.StartElements>
            <PageHeader.EndElements>
                <SubHeaderRight
                    canCreateNewFolder={canCreateNewFolder}
                    canUpload={canUpload}
                    currentCollection={currentCollection}
                    gridColumnCount={gridColumnCount}
                    gridMaxColumns={gridMaxColumns}
                    gridMinColumns={gridMinColumns}
                    maxGridColumnCountForWidth={maxGridColumnCountForWidth}
                    onCreate={onCreate}
                    onGridViewSliderChange={onGridViewSliderChange}
                    onSortChange={onSortChange}
                    onUpload={onUpload}
                    onViewModeChange={onViewModeChange}
                    portalElement={portalElement}
                    view={view}
                    viewMode={viewMode}
                />
            </PageHeader.EndElements>
        </PageHeader.Root>
    );
};

export default SubHeader;

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { PageHeader } from '@box/blueprint-web';
import type { Selection } from 'react-aria-components';

import SubHeaderLeft from './SubHeaderLeft';
import SubheaderLeftMetadataViewV2 from './SubHeaderLeftMetadataViewV2';
import SubHeaderRight from './SubHeaderRight';
import type { ViewMode } from '../flowTypes';
import type API from '../../../api';
import type { View, Collection } from '../../../common/types/core';
import { VIEW_MODE_LIST, VIEW_METADATA } from '../../../constants';
import { useFeatureEnabled } from '../feature-checking';

import './SubHeader.scss';

export interface SubHeaderProps {
    api?: API;
    canCreateNewFolder: boolean;
    canUpload: boolean;
    currentCollection: Collection;
    gridColumnCount?: number;
    gridMaxColumns?: number;
    gridMinColumns?: number;
    isSmall: boolean;
    maxGridColumnCountForWidth?: number;
    metadataAncestorFolderName?: string | null;
    metadataViewTitle?: string;
    onClearSelectedKeys: () => void;
    onCreate: () => void;
    onGridViewSliderChange?: (newSliderValue: number) => void;
    onItemClick: (id: string | null, triggerNavigationEvent: boolean | null) => void;
    onSortChange: (sortBy: string, sortDirection: string) => void;
    onUpload: () => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    portalElement?: HTMLElement;
    rootId: string;
    rootName?: string;
    selectedKeys: Selection;
    view: View;
    viewMode?: ViewMode;
}

const SubHeader = ({
    api,
    canCreateNewFolder,
    canUpload,
    currentCollection,
    gridColumnCount = 0,
    gridMaxColumns = 0,
    gridMinColumns = 0,
    maxGridColumnCountForWidth = 0,
    metadataAncestorFolderName,
    metadataViewTitle,
    onGridViewSliderChange = noop,
    isSmall,
    onClearSelectedKeys,
    onCreate,
    onItemClick,
    onSortChange,
    onUpload,
    onViewModeChange,
    portalElement,
    rootId,
    rootName,
    selectedKeys,
    view,
    viewMode = VIEW_MODE_LIST,
}: SubHeaderProps) => {
    const isMetadataViewV2Feature = useFeatureEnabled('contentExplorer.metadataViewV2');

    if (view === VIEW_METADATA && !isMetadataViewV2Feature) {
        return null;
    }

    return (
        <PageHeader.Root
            className={classNames('be-sub-header', { 'SubHeader--metadataView': isMetadataViewV2Feature })}
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
                        api={api}
                        currentCollection={currentCollection}
                        metadataAncestorFolderName={metadataAncestorFolderName}
                        metadataViewTitle={metadataViewTitle}
                        onClearSelectedKeys={onClearSelectedKeys}
                        selectedKeys={selectedKeys}
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

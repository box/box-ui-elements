// @flow
import * as React from 'react';
import type { UseTargetingApi } from '../../features/targeting/types';

type ClassificationInfo = {
    definition?: string,
    name: string,
};

type ContentInsights = {
    error?: Object,
    graphData: Array<Object>,
    isLoading: boolean,
    previousPeriodCount: number,
    totalCount: number,
};

type NavigateOptions = {
    isToggle?: boolean,
};

type AdditionalSidebarTabFtuxData = {
    targetingApi: UseTargetingApi,
    text: string,
};

type AdditionalSidebarTab = {
    callback: (callbackData: Object) => void,
    ftuxTooltipData?: AdditionalSidebarTabFtuxData,
    iconUrl?: string,
    id: number,
    title: ?string,
    icon?: React.Node,
};

type Translations = {
    onTranslate?: Function,
    translationEnabled?: boolean,
};

type FileAccessStats = {
    comment_count?: number,
    download_count?: number,
    edit_count?: number,
    has_count_overflowed: boolean,
    preview_count?: number,
};

export type CustomPanel = {
    id: string, // Unique identifier for the panel
    title: string | React.Node, // Panel title
    component: React.ComponentType<any>, // The component to render
    index?: number, // Position to insert in the panel order (default: 0)
    icon?: React.ComponentType<any>, // Optional icon for the nav button
    navButtonProps?: Object, // Additional props for the nav button
};

export type {
    ClassificationInfo,
    ContentInsights,
    NavigateOptions,
    AdditionalSidebarTab,
    AdditionalSidebarTabFtuxData,
    Translations,
    FileAccessStats,
};

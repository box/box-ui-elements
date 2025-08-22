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

type CustomSidebarPanel = {
    id: string, // Unique identifier for the panel
    path: string, // routh path for the panel
    component: React.ComponentType<any>, // The component to render
    title: string, // Panel title
    isDisabled?: boolean, // Whether the panel is disabled (default: false)
    icon?: React.ComponentType<any> | React.Element<any>, // Optional icon for the nav button
    navButtonProps?: Object, // Additional props for the nav button
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

export type {
    ClassificationInfo,
    ContentInsights,
    CustomSidebarPanel,
    NavigateOptions,
    AdditionalSidebarTab,
    AdditionalSidebarTabFtuxData,
    Translations,
    FileAccessStats,
};

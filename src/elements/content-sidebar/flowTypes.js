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

type NavButtonOverrideProps = {
    'aria-label'?: string,
    'aria-describedby'?: string,
};

type CustomSidebarPanel = {
    id: string,
    path: string,
    component: React.ComponentType<any>,
    title: string,
    isDisabled?: boolean,
    icon: React.ComponentType<any> | React.Element<any>,
    navButtonProps?: NavButtonOverrideProps,
};

type CustomSidebarPanels = Array<CustomSidebarPanel>;

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
    CustomSidebarPanels,
    NavigateOptions,
    AdditionalSidebarTab,
    AdditionalSidebarTabFtuxData,
    Translations,
    FileAccessStats,
};

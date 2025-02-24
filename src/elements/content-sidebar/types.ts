import * as React from 'react';
import { UseTargetingApi } from '../../features/targeting/types';

interface ClassificationInfo {
    definition?: string;
    name: string;
}

interface ContentInsights {
    error?: Record<string, unknown>;
    graphData: Record<string, unknown>[];
    isLoading: boolean;
    previousPeriodCount: number;
    totalCount: number;
}

interface NavigateOptions {
    isToggle?: boolean;
}

interface AdditionalSidebarTabFtuxData {
    targetingApi: UseTargetingApi;
    text: string;
}

interface AdditionalSidebarTab {
    callback: (callbackData: Record<string, unknown>) => void;
    ftuxTooltipData?: AdditionalSidebarTabFtuxData;
    iconUrl?: string;
    id: number;
    title: string | null;
    icon?: React.ReactNode;
}

interface Translations {
    onTranslate?: (data: unknown) => void;
    translationEnabled?: boolean;
}

interface FileAccessStats {
    comment_count?: number;
    download_count?: number;
    edit_count?: number;
    has_count_overflowed: boolean;
    preview_count?: number;
}

export type {
    ClassificationInfo,
    ContentInsights,
    NavigateOptions,
    AdditionalSidebarTab,
    AdditionalSidebarTabFtuxData,
    Translations,
    FileAccessStats,
};

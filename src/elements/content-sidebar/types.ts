import type { ElementsXhrError } from '../../common/types/types';
import type { GraphData } from '../../features/content-insights/types';

export interface ClassificationInfo {
    definition?: string;
    name: string;
}

export interface ContentInsights {
    error?: ElementsXhrError;
    graphData: GraphData;
    isLoading: boolean;
    previousPeriodCount: number;
    totalCount: number;
}

export interface FileAccessStats {
    comment_count?: number;
    download_count?: number;
    edit_count?: number;
    has_count_overflowed: boolean;
    preview_count?: number;
}

export interface NavigateOptions {
    isToggle?: boolean;
}

export interface AdditionalSidebarTabFtuxData {
    targetingApi: UseTargetingApi;
    text: string;
}

export interface AdditionalSidebarTab {
    callback: (callbackData: Record<string, unknown>) => void;
    ftuxTooltipData?: AdditionalSidebarTabFtuxData;
    iconUrl?: string;
    id: number;
    title: string | null;
    icon?: React.ReactNode;
}

export interface Translations {
    onTranslate?: () => void;
    translationEnabled?: boolean;
}

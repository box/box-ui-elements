import * as React from 'react';
import type { UseTargetingApi } from '../../../features/targeting/types';

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

export interface AdditionalTabProps extends AdditionalSidebarTab {
    ftuxTooltipData?: AdditionalSidebarTabFtuxData;
    isLoading: boolean;
    onImageLoad: () => void;
    status?: string;
}

export interface AdditionalTabsProps {
    tabs?: Array<AdditionalSidebarTab>;
}

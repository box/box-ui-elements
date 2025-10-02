import * as React from 'react';
import { RecordActionType as AgentSelectorRecordActionType } from '@box/box-ai-agent-selector';
import { RecordActionType as ContentAnswersRecordActionType } from '@box/box-ai-content-answers';
import type { FeedbackFormData, ItemType } from '@box/box-ai-content-answers';
import type { BoxAISidebarCache, BoxAISidebarCacheSetter } from '../types/BoxAISidebarTypes';
type BoxAISidebarRecordActionType = AgentSelectorRecordActionType | ContentAnswersRecordActionType | (Omit<ContentAnswersRecordActionType, 'data'> & {
    data: {
        items: Array<Pick<ItemType, 'fileType' | 'status'>>;
    };
});
export interface BoxAISidebarContextValues {
    cache: BoxAISidebarCache;
    contentName: string;
    elementId: string;
    fileExtension: string;
    isFeedbackEnabled: boolean;
    isFeedbackFormEnabled: boolean;
    isStopResponseEnabled: boolean;
    items: Array<ItemType>;
    itemSize?: string;
    onFeedbackFormSubmit?: (data: FeedbackFormData, onSuccess: () => void) => void;
    onUserInteraction?: () => void;
    recordAction: (params: BoxAISidebarRecordActionType) => void;
    setCacheValue: BoxAISidebarCacheSetter;
    shouldFeedbackFormIncludeFeedbackText?: boolean;
    shouldPreinitSession: boolean;
}
export declare const BoxAISidebarContext: React.Context<BoxAISidebarContextValues>;
export {};

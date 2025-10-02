/**
 * @file Box AI Sidebar Container
 * @author Box
 */
import * as React from 'react';
import { type FeedbackFormData, type ItemType } from '@box/box-ai-content-answers';
import { RecordActionType } from '@box/box-ai-agent-selector';
import type { BoxAISidebarCache, BoxAISidebarCacheSetter } from './types/BoxAISidebarTypes';
export interface BoxAISidebarProps {
    contentName: string;
    cache: BoxAISidebarCache;
    createSessionRequest: (payload: Record<string, unknown>, itemID: string) => Promise<unknown>;
    elementId: string;
    fetchTimeout: Record<string, unknown>;
    fileExtension: string;
    fileID: string;
    getAgentConfig: (payload: Record<string, unknown>) => Promise<unknown>;
    getAIStudioAgents: () => Promise<unknown>;
    getAnswer: (payload: Record<string, unknown>, itemID?: string, itemIDs?: Array<string>, state?: Record<string, unknown>) => Promise<unknown>;
    getAnswerStreaming: (payload: Record<string, unknown>, itemID?: string, itemIDs?: Array<string>, abortController?: AbortController, state?: Record<string, unknown>) => Promise<unknown>;
    getSuggestedQuestions: (itemID: string) => Promise<unknown> | null;
    hostAppName: string;
    isAgentSelectorEnabled: boolean;
    isAIStudioAgentSelectorEnabled: boolean;
    isCitationsEnabled: boolean;
    isDebugModeEnabled: boolean;
    isFeedbackEnabled: boolean;
    isFeedbackFormEnabled: boolean;
    isIntelligentQueryMode: boolean;
    isMarkdownEnabled: boolean;
    isStopResponseEnabled?: boolean;
    isStreamingEnabled: boolean;
    items: Array<ItemType>;
    itemSize?: string;
    localizedQuestions: Array<{
        id: string;
        label: string;
        prompt: string;
    }>;
    onFeedbackFormSubmit?: (data: FeedbackFormData, onSuccess: () => void) => void;
    onUserInteraction?: () => void;
    recordAction: (params: RecordActionType) => void;
    setCacheValue: BoxAISidebarCacheSetter;
    shouldFeedbackFormIncludeFeedbackText?: boolean;
    renderRemoteModule?: (elementId: string) => React.ReactNode;
    shouldPreinitSession?: boolean;
    setHasQuestions: (hasQuestions: boolean) => void;
}
declare const BoxAISidebar: (props: BoxAISidebarProps) => string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element;
export default BoxAISidebar;

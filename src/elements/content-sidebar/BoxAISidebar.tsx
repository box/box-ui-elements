/**
 * @file Box AI Sidebar Container
 * @author Box
 */
import * as React from 'react';
import { useIntl } from 'react-intl';
import { type ItemType } from '@box/box-ai-content-answers';
import { AgentsProvider , RecordActionType } from '@box/box-ai-agent-selector';
import BoxAISidebarContent from './BoxAISidebarContent';
import { BoxAISidebarContext } from './context/BoxAISidebarContext';
import { DOCUMENT_SUGGESTED_QUESTIONS, SPREADSHEET_FILE_EXTENSIONS } from '../common/content-answers/constants';
import type { BoxAISidebarCache, BoxAISidebarCacheSetter } from './types/BoxAISidebarTypes';

import messages from '../common/content-answers/messages';

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
    getAnswer: (
        payload: Record<string, unknown>,
        itemID?: string,
        itemIDs?: Array<string>,
        state?: Record<string, unknown>,
    ) => Promise<unknown>;
    getAnswerStreaming: (
        payload: Record<string, unknown>,
        itemID?: string,
        itemIDs?: Array<string>,
        abortController?: AbortController,
        state?: Record<string, unknown>,
    ) => Promise<unknown>;
    getSuggestedQuestions: (itemID: string) => Promise<unknown> | null;
    hostAppName: string;
    isAgentSelectorEnabled: boolean;
    isAIStudioAgentSelectorEnabled: boolean;
    isCitationsEnabled: boolean;
    isDebugModeEnabled: boolean;
    isFeedbackEnabled: boolean;
    isIntelligentQueryMode: boolean;
    isMarkdownEnabled: boolean;
    isResetChatEnabled: boolean;
    isStopResponseEnabled?: boolean;
    isStreamingEnabled: boolean;
    items: Array<ItemType>;
    itemSize?: string;
    userInfo: { name: string; avatarURL: string };
    recordAction: (params: RecordActionType) => void;
    setCacheValue: BoxAISidebarCacheSetter;
}

const BoxAISidebar = (props: BoxAISidebarProps) => {
    const {
        cache,
        contentName,
        elementId,
        fileExtension,
        fileID,
        getSuggestedQuestions,
        isIntelligentQueryMode,
        isFeedbackEnabled,
        isStopResponseEnabled,
        items,
        itemSize,
        recordAction,
        setCacheValue,
        userInfo,
        ...rest
    } = props;
    const { questions } = cache;
    const { formatMessage } = useIntl();
    const contextValue = React.useMemo(
        () => ({
            cache,
            contentName,
            elementId,
            fileExtension,
            isFeedbackEnabled,
            isStopResponseEnabled,
            items,
            itemSize,
            setCacheValue,
            recordAction,
            userInfo,
        }),
        [
            cache,
            contentName,
            elementId,
            fileExtension,
            isFeedbackEnabled,
            isStopResponseEnabled,
            items,
            itemSize,
            setCacheValue,
            recordAction,
            userInfo,
        ],
    );

    let questionsWithoutInProgress = questions;
    if (questions.length > 0 && !questions[questions.length - 1].isCompleted) {
        // pass only fully completed questions to not show loading indicator of question where we canceled API request
        questionsWithoutInProgress = questionsWithoutInProgress.slice(0, -1);
    }

    const localizedQuestions = DOCUMENT_SUGGESTED_QUESTIONS.map(question => ({
        id: question.id,
        label: formatMessage(messages[question.labelId]),
        prompt: formatMessage(messages[question.promptId]),
    }));

    const isSpreadsheet = SPREADSHEET_FILE_EXTENSIONS.includes(fileExtension);

    let spreadsheetNotice = isSpreadsheet ? formatMessage(messages.welcomeMessageSpreadsheetNotice) : '';
    if (isIntelligentQueryMode) {
        spreadsheetNotice = formatMessage(messages.welcomeMessageIntelligentQueryNotice);
    } else if (isSpreadsheet) {
        spreadsheetNotice = formatMessage(messages.welcomeMessageSpreadsheetNotice);
    }

    return (
        // BoxAISidebarContent is using withApiWrapper that is not passing all provided props,
        // that's why we need to use provider to pass other props
        <AgentsProvider value={cache.agents}>
            <BoxAISidebarContext.Provider value={contextValue}>
                <BoxAISidebarContent
                    getSuggestedQuestions={getSuggestedQuestions}
                    isOpen
                    isStopResponseEnabled={isStopResponseEnabled}
                    itemID={fileID}
                    itemIDs={[fileID]}
                    restoredQuestions={questionsWithoutInProgress}
                    restoredSession={cache.encodedSession}
                    suggestedQuestions={getSuggestedQuestions === null ? localizedQuestions : []}
                    warningNotice={spreadsheetNotice}
                    warningNoticeAriaLabel={formatMessage(messages.welcomeMessageSpreadsheetNoticeAriaLabel)}
                    {...rest}
                />
            </BoxAISidebarContext.Provider>
        </AgentsProvider>
    );
};

export default BoxAISidebar;

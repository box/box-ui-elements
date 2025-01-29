/**
 * @file Box AI Sidebar Container
 * @author Box
 */
import * as React from 'react';
import noop from 'lodash/noop';
import { useIntl } from 'react-intl';
import { type QuestionType } from '@box/box-ai-content-answers';
import { RecordActionType } from '@box/box-ai-agent-selector';
import BoxAISidebarContent from './BoxAISidebarContent';
import { DOCUMENT_SUGGESTED_QUESTIONS, SPREADSHEET_FILE_EXTENSIONS } from '../common/content-answers/constants';

import messages from '../common/content-answers/messages';

export interface BoxAISidebarContextValues {
    cache: { encodedSession?: string | null; questions?: QuestionType[] };
    contentName: string;
    elementId: string;
    fileExtension: string;
    isStopResponseEnabled: boolean;
    itemSize?: string;
    recordAction: (params: RecordActionType) => void;
    setCacheValue: (key: 'encodedSession' | 'questions', value: string | null | QuestionType[]) => void;
    userInfo: { name: string; avatarURL: string };
}

export const BoxAISidebarContext = React.createContext<BoxAISidebarContextValues>({
    cache: null,
    contentName: '',
    elementId: '',
    fileExtension: '',
    isStopResponseEnabled: false,
    recordAction: noop,
    setCacheValue: noop,
    userInfo: { name: '', avatarURL: '' },
});

export interface BoxAISidebarProps {
    contentName: string;
    cache: { encodedSession?: string | null; questions?: QuestionType[] };
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
    isIntelligentQueryMode: boolean;
    isMarkdownEnabled: boolean;
    isResetChatEnabled: boolean;
    isStopResponseEnabled?: boolean;
    isStreamingEnabled: boolean;
    itemSize?: string;
    userInfo: { name: string; avatarURL: string };
    recordAction: (params: RecordActionType) => void;
    setCacheValue: (key: 'encodedSession' | 'questions', value: string | null | QuestionType[]) => void;
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
        isStopResponseEnabled,
        itemSize,
        recordAction,
        setCacheValue,
        userInfo,
        ...rest
    } = props;
    const { questions } = cache;
    const { formatMessage } = useIntl();
    let questionsWithoutInProgress = questions;
    if (questions.length > 0 && !questions[questions.length - 1].isCompleted) {
        // pass only fully completed questions to not show loading indicator of question where we canceled API request
        questionsWithoutInProgress = questionsWithoutInProgress.slice(0, -1);
    }

    const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
        }
    }, []);

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyPress,{ capture: true });
        return () => {
            document.removeEventListener('keydown', handleKeyPress, { capture: true });
        };
    }, [handleKeyPress]);

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
        <BoxAISidebarContext.Provider
            value={{
                cache,
                contentName,
                elementId,
                fileExtension,
                isStopResponseEnabled,
                itemSize,
                setCacheValue,
                recordAction,
                userInfo,
            }}
        >
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
    );
};

export default BoxAISidebar;

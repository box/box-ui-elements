import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import getProp from 'lodash/get';
import { AxiosResponse } from 'axios';

import {
    AgentType,
    ANSWER_ERROR,
    IntelligenceModal,
    QuestionType,
    SuggestedQuestionType,
} from '@box/box-ai-content-answers';

import { DOCUMENT_SUGGESTED_QUESTIONS, SPREADSHEET_FILE_EXTENSIONS } from './constants';
import withCurrentUser from '../current-user';

// @ts-ignore: no ts definition
import { BoxItem, User } from '../../../common/types/core';
// @ts-ignore: no ts definition
import APIFactory from '../../../api';
// @ts-ignore: no ts definition
import { ElementsXhrError } from '../../common/types/api';

import messages from './messages';

export interface ExternalProps {
    isCitationsEnabled?: boolean;
    isMarkdownEnabled?: boolean;
    isResetChatEnabled?: boolean;
    onAsk?: () => void;
    onClearConversation?: () => void;
    onRequestClose?: () => void;
    suggestedQuestions?: SuggestedQuestionType[];
}

export interface ContentAnswersModalProps extends ExternalProps {
    api: APIFactory;
    currentUser?: User;
    file: BoxItem;
    isOpen: boolean;
}

const ContentAnswersModal = ({
    api,
    file,
    isOpen,
    onAsk,
    onClearConversation,
    onRequestClose,
    suggestedQuestions,
    isCitationsEnabled = true,
    isMarkdownEnabled = true,
    isResetChatEnabled = true,
}: ContentAnswersModalProps) => {
    const { formatMessage } = useIntl();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    let localizedQuestions: SuggestedQuestionType[] = [];

    if (!suggestedQuestions || suggestedQuestions.length === 0) {
        localizedQuestions = DOCUMENT_SUGGESTED_QUESTIONS.map(question => ({
            id: question.id,
            label: formatMessage(messages[question.labelId]),
            prompt: formatMessage(messages[question.promptId]),
        }));
    }

    const handleSuccessCallback = useCallback((response: AxiosResponse): void => {
        const question = {
            answer: response.data.answer,
            created_at: response.data.created_at,
            citations: response.data.citations,
            error: null,
            isCompleted: true,
            isLoading: false,
        };

        setQuestions(prevState => {
            const lastQuestion = prevState[prevState.length - 1];
            const updatedLastQuestion = { ...lastQuestion, ...question };
            return [...prevState.slice(0, -1), updatedLastQuestion];
        });
    }, []);

    const handleErrorCallback = useCallback((error: ElementsXhrError, question: QuestionType): void => {
        const rateLimitingRegex = /Too Many Requests/i;

        const errorMessage = error?.message || '';
        const isRateLimitingError = error?.response?.status === 429 || rateLimitingRegex.test(errorMessage);

        const errorQuestion = {
            ...question,
            error: isRateLimitingError ? ANSWER_ERROR.RATE_LIMITING : ANSWER_ERROR.GENERAL,
            isCompleted: true,
            isLoading: false,
        };

        setQuestions(prevState => {
            return [...prevState.slice(0, -1), errorQuestion];
        });
    }, []);

    const handleAsk = useCallback(
        async (question: QuestionType, aiAgent: AgentType, isRetry = false) => {
            if (onAsk) {
                onAsk();
            }
            const { id } = file;
            const items = [
                {
                    id,
                    type: 'file',
                },
            ];
            question.isCompleted = false;
            question.isLoading = true;

            const dialogueHistory = questions.map(q => ({
                prompt: q.prompt,
                answer: q.answer,
                created_at: q.created_at,
            }));

            setQuestions(prevQuestions => {
                return [...(isRetry ? prevQuestions.slice(0, -1) : prevQuestions), question];
            });
            setIsLoading(true);

            try {
                const response = await api
                    .getIntelligenceAPI(true)
                    .ask(question, items, dialogueHistory, { include_citations: isCitationsEnabled });
                handleSuccessCallback(response);
            } catch (e) {
                handleErrorCallback(e, question);
            }
            setIsLoading(false);
        },
        [api, file, handleErrorCallback, handleSuccessCallback, isCitationsEnabled, onAsk, questions],
    );

    const handleRetry = useCallback(
        (question: QuestionType) => {
            setQuestions(prevState => {
                delete question.error;
                return [...prevState.slice(0, -1), question];
            });
            handleAsk(question, null, true);
        },
        [handleAsk],
    );

    const handleClearConversation = useCallback(() => {
        if (onClearConversation) {
            onClearConversation();
        }
        setQuestions([]);
    }, [onClearConversation]);

    const handleOnRequestClose = useCallback(() => {
        if (onRequestClose) {
            onRequestClose();
        }
    }, [onRequestClose]);

    const fileName = getProp(file, 'name');
    const fileExtension = getProp(file, 'extension');

    const isSpreadsheet = SPREADSHEET_FILE_EXTENSIONS.includes(fileExtension);
    const spreadsheetNotice = isSpreadsheet ? formatMessage(messages.welcomeMessageSpreadsheetNotice) : '';

    return (
        <IntelligenceModal
            contentName={fileName}
            contentType={fileExtension}
            hasRequestInProgress={isLoading}
            isCitationsEnabled={isCitationsEnabled}
            isMarkdownEnabled={isMarkdownEnabled}
            isResetChatEnabled={isResetChatEnabled}
            onClearAction={handleClearConversation}
            onOpenChange={handleOnRequestClose}
            open={isOpen}
            questions={questions}
            retryQuestion={handleRetry}
            setAnswerFeedback={undefined}
            submitQuestion={handleAsk}
            suggestedQuestions={suggestedQuestions || localizedQuestions}
            warningNotice={spreadsheetNotice}
            warningNoticeAriaLabel={formatMessage(messages.welcomeMessageSpreadsheetNoticeAriaLabel)}
        />
    );
};

export default withCurrentUser(ContentAnswersModal);

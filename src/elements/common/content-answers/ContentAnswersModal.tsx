import React, { useState, useCallback } from 'react';

import {
    AgentType,
    ANSWER_ERROR,
    IntelligenceModal,
    QuestionType,
    SuggestedQuestionType,
} from '@box/box-ai-content-answers';
import { useIntl } from 'react-intl';
import getProp from 'lodash/get';
import { DOCUMENT_SUGGESTED_QUESTIONS } from './constants';
import withCurrentUser from '../current-user';

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { BoxItem, User } from '../../../common/types/core';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withAPIContext } from '../api-context';
// @ts-ignore: no ts definition
import APIFactory from '../../../api';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ElementsXhrError } from '../../common/types/api';

import messages from './messages';

interface ContentAnswersModalProps {
    api: APIFactory;
    currentUser?: User;
    file: BoxItem;
    isCitationsEnabled?: boolean;
    isMarkdownEnabled?: boolean;
    isOpen: boolean;
    onAsk: () => void;
    onRequestClose: () => void;
    suggestedQuestions?: SuggestedQuestionType[];
}

const ContentAnswersModal = ({
    api,
    currentUser,
    file,
    isOpen,
    onAsk,
    onRequestClose,
    suggestedQuestions,
    isCitationsEnabled = true,
    isMarkdownEnabled = true,
}: ContentAnswersModalProps) => {
    const { formatMessage } = useIntl();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<QuestionType[]>([]);

    const localizedQuestions: SuggestedQuestionType[] = DOCUMENT_SUGGESTED_QUESTIONS.map(question => ({
        id: question.id,
        label: formatMessage(messages[question.labelId]),
        prompt: formatMessage(messages[question.promptId]),
    }));

    const handleSuccessCallback = useCallback((response): void => {
        const question = {
            answer: response.data.answer,
            createdAt: response.data.created_at,
            citations: response.data.citations,
            error: null,
            isCompleted: true,
            isLoading: false,
        };

        setQuestions(prevState => {
            const lastQuestion = prevState[prevState.length - 1];
            return [...prevState.slice(0, -1), { ...lastQuestion, ...question }];
        });
    }, []);

    const handleErrorCallback = useCallback((error: ElementsXhrError, question: QuestionType): void => {
        const rateLimitingRegex = /Too Many Requests/i;
        const errorMessage = error ? error.message || '' : '';
        const isRateLimitingError =
            (error && error.response && error.response.status === 429) || rateLimitingRegex.test(errorMessage);

        const errorQuestion = {
            ...question,
            error: isRateLimitingError ? ANSWER_ERROR.RATE_LIMITING : ANSWER_ERROR.GENERAL,
            isCompleted: true,
            isLoading: false,
        };
        setIsLoading(false);
        setQuestions(prevState => {
            return [...prevState.slice(0, -1), errorQuestion];
        });
    }, []);

    const handleAsk = useCallback(
        async (question: QuestionType, aiAgent: AgentType, isRetry = false) => {
            onAsk();
            const id = file && file.id;
            const items = [
                {
                    id,
                    type: 'file',
                },
            ];
            question.isCompleted = false;
            question.isLoading = true;
            const nextQuestions = [...(isRetry ? questions.slice(0, -1) : questions)];
            setQuestions([...nextQuestions, question]);

            setIsLoading(true);
            try {
                const response = await api.getIntelligenceAPI(true).ask(question, items);
                handleSuccessCallback(response);
            } catch (e) {
                handleErrorCallback(e, question);
            }
            setIsLoading(false);
        },
        [api, file, handleErrorCallback, handleSuccessCallback, onAsk, questions],
    );

    const handleRetry = useCallback(
        (question: QuestionType) => {
            handleAsk(question, null, true);
        },
        [handleAsk],
    );

    const fileName = getProp(file, 'name');
    const currentFileExtension = getProp(file, 'extension');
    const userInfo = { name: getProp(currentUser, 'name') || '', avatarURL: getProp(currentUser, 'avatarURL') || '' };

    return (
        <IntelligenceModal
            contentName={fileName}
            contentType={currentFileExtension}
            hasRequestInProgress={isLoading}
            isCitationsEnabled={isCitationsEnabled}
            isMarkdownEnabled={isMarkdownEnabled}
            onModalClose={onRequestClose}
            open={isOpen}
            onOpenChange={onRequestClose}
            questions={questions}
            retryQuestion={handleRetry}
            submitQuestion={handleAsk}
            suggestedQuestions={suggestedQuestions || localizedQuestions}
            userInfo={userInfo}
        />
    );
};

export default withAPIContext(withCurrentUser(ContentAnswersModal));

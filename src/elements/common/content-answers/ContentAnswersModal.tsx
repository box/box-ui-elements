import React, { useState, useCallback } from 'react';

import { IntelligenceModal, QuestionType, SuggestedQuestionType } from '@box/box-ai-content-answers';
import { useIntl } from 'react-intl';
import { DOCUMENT_SUGGESTED_QUESTIONS } from './constants';
import withCurrentUser from '../current-user';

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { BoxItem, User } from '../../../common/types/core';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withAPIContext } from '../api-context';
// @ts-ignore: no ts definition
import APIFactory from '../../api';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ElementsXhrError } from '../../common/types/api';
import messages from './messages';

interface ContentAnswersModalProps {
    api: APIFactory;
    currentUser?: User;
    file: BoxItem;
    isOpen: boolean;
    onAsk: () => void;
    onRequestClose: () => void;
}

const ContentAnswersModal = ({ api, currentUser, file, isOpen, onAsk, onRequestClose }: ContentAnswersModalProps) => {
    const { formatMessage } = useIntl();
    const fileName = file && file.name;
    const [hasError, setHasError] = useState<boolean>(false);
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
        };

        setQuestions(prevState => {
            const lastQuestion = prevState[prevState.length - 1];
            return [...prevState.slice(0, -1), { ...lastQuestion, ...question }];
        });
    }, []);

    const handleErrorCallback = useCallback((error: ElementsXhrError): void => {
        setHasError(true);
        setQuestions(prevState => {
            const lastQuestion = prevState[prevState.length - 1];
            return [...prevState.slice(0, -1), { ...lastQuestion, error }];
        });
    }, []);

    const handleAsk = useCallback(
        async (question: QuestionType, isRetry = false) => {
            setHasError(false);
            onAsk();
            const id = file && file.id;
            const items = [
                {
                    id,
                    type: 'file',
                },
            ];

            const nextQuestions = [...(isRetry ? questions.slice(0, -1) : questions)];
            setQuestions([...nextQuestions, question]);

            setIsLoading(true);
            try {
                const response = await api.getIntelligenceAPI(true).ask(question.prompt, items);
                handleSuccessCallback(response);
            } catch (e) {
                handleErrorCallback(e);
            }
            setIsLoading(false);
        },
        [api, file, handleErrorCallback, handleSuccessCallback, onAsk, questions],
    );

    const handleRetry = useCallback(() => {
        handleAsk(questions[questions.length - 1], true);
    }, [handleAsk, questions]);

    const currentFileExtension = file && file.extension;
    const userInfo = { name: currentUser?.name || '', avatarURL: currentUser?.avatarUrl || '' };
    return (
        <IntelligenceModal
            contentName={fileName}
            contentType={currentFileExtension}
            userInfo={userInfo}
            submitQuestion={handleAsk}
            retryQuestion={handleRetry}
            questions={questions}
            onModalClose={onRequestClose}
            showLoadingIndicator={isLoading}
            open={isOpen}
            onOpenChange={onRequestClose}
            suggestedQuestions={localizedQuestions}
        />
    );
};

export default withAPIContext(withCurrentUser(ContentAnswersModal));

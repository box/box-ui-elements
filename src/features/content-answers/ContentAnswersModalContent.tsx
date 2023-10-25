import React, { useCallback, useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';

import Answer from './Answer';
import Question from './Question';
import WelcomeMessage from './WelcomeMessage';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';

import './ContentAnswersModalContent.scss';

export type QuestionType = {
    prompt: string;
    answer?: string;
    createdAt?: string;
};

type Props = {
    currentUser?: User;
    fileName: string;
    isLoading: boolean;
    questions: QuestionType[];
};

const ContentAnswersModalContent = ({ currentUser, fileName, isLoading, questions }: Props) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToBottom = useCallback(behavior => {
        if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
            messagesEndRef.current.scrollIntoView({ behavior });
        }
    }, []);

    const throttledScrollToBottom = throttle(handleScrollToBottom, 1000);

    // Scroll to the bottom when modal opened
    useEffect(() => {
        setTimeout(() => {
            handleScrollToBottom('instant');
        }, 0);
    }, [handleScrollToBottom]);

    // Scroll to the bottom if a new answer is loading
    useEffect(() => {
        if (isLoading) {
            handleScrollToBottom('smooth');
        }
    }, [handleScrollToBottom, isLoading]);

    return (
        <div className="bdl-ContentAnswersModalContent" data-testid="content-answers-modal-content">
            <WelcomeMessage fileName={fileName} />
            <ul>
                {questions?.map(({ prompt, answer = '' }, index) => (
                    <li key={index}>
                        <Question currentUser={currentUser} prompt={prompt} />
                        <Answer answer={answer} handleScrollToBottom={throttledScrollToBottom} isLoading={isLoading} />
                    </li>
                ))}
            </ul>
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ContentAnswersModalContent;

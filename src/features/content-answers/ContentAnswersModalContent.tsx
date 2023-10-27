import React, { useCallback, useEffect, useRef } from 'react';

import Answer from './Answer';
import InlineError from './InlineError';
import Question from './Question';
import WelcomeMessage from './WelcomeMessage';
import { QuestionType } from './ContentAnswersModal';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';

import './ContentAnswersModalContent.scss';

type Props = {
    currentUser?: User;
    fileName: string;
    isLoading: boolean;
    questions: QuestionType[];
};

const ContentAnswersModalContent = ({ currentUser, fileName, isLoading, questions }: Props) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToBottom = useCallback(
        behavior => {
            if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
                messagesEndRef.current.scrollIntoView({ behavior });
            }
        },
        [messagesEndRef],
    );

    // scroll to bottom instantly when modal opens
    useEffect(() => {
        setTimeout(() => {
            handleScrollToBottom('instant');
        }, 0);
    }, [handleScrollToBottom]);

    // scroll to bottom for both cases that answer is loading and answer has been generated
    useEffect(() => {
        handleScrollToBottom('smooth');
    }, [handleScrollToBottom, isLoading]);

    return (
        <div className="bdl-ContentAnswersModalContent" data-testid="content-answers-modal-content">
            <WelcomeMessage fileName={fileName} />
            <ul>
                {questions.map(({ prompt, error, answer = '' }, index) => {
                    const hasError = !!error;
                    return (
                        <li key={index}>
                            <Question currentUser={currentUser} prompt={prompt} />
                            {hasError ? <InlineError /> : <Answer answer={answer} isLoading={isLoading} />}
                        </li>
                    );
                })}
            </ul>
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ContentAnswersModalContent;

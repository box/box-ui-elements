import React, { useCallback, useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';

import Answer from './Answer';
import Question from './Question';
import WelcomeMessage from './WelcomeMessage';
// @ts-ignore flow import
import { scrollIntoView } from '../../utils/dom';
import { QuestionType } from './ContentAnswersModal';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';

import './ContentAnswersModalContent.scss';

type Props = {
    currentUser: User;
    fileName: string;
    isLoading: boolean;
    questions: QuestionType[];
};

const ContentAnswersModalContent = ({ currentUser, fileName, isLoading, questions }: Props) => {
    const messagesEndRef = useRef(null);

    const handleScrollToBottom = useCallback(behavior => {
        if (messagesEndRef.current) {
            scrollIntoView(messagesEndRef.current, { behavior });
        }
    }, []);

    const throttledScrollToBottom = throttle(handleScrollToBottom, 200);

    useEffect(() => {
        if (isLoading) {
            handleScrollToBottom('smooth');
        }
    }, [handleScrollToBottom, isLoading]);

    return (
        <div className="bdl-ContentAnswersModalContent">
            <WelcomeMessage fileName={fileName} />
            <ul>
                {questions &&
                    questions.map(({ prompt, answer = '' }, index) => {
                        return (
                            <li key={index}>
                                <Question currentUser={currentUser} prompt={prompt} />
                                <Answer
                                    answer={answer}
                                    handleScrollToBottom={throttledScrollToBottom}
                                    isLoading={isLoading}
                                />
                            </li>
                        );
                    })}
            </ul>
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ContentAnswersModalContent;

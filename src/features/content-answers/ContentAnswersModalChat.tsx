import React from 'react';
import throttle from 'lodash/throttle';

import Answer from './Answer';
import Question from './Question';
import WelcomeMessage from './WelcomeMessage';
import { QuestionType } from './ContentAnswersModal';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';

import './ContentAnswersModalChat.scss';

type Props = {
    currentUser: User;
    fileName: string;
    handleScrollToBottom: (behavior: string) => void;
    isLoading: boolean;
    questions: QuestionType[];
};

const ContentAnswersModalChat = ({ currentUser, fileName, handleScrollToBottom, isLoading, questions }: Props) => {
    const throttledScrollToBottom = throttle(handleScrollToBottom, 200);

    return (
        <div className="bdl-ContentAnswersModalChat">
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
        </div>
    );
};

export default ContentAnswersModalChat;

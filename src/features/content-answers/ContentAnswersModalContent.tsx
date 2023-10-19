import React from 'react';

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
    currentUser: User;
    fileName: string;
    isLoading: boolean;
    questions: QuestionType[];
};

const ContentAnswersModalContent = ({ currentUser, fileName, isLoading, questions }: Props) => {
    return (
        <div className="bdl-ContentAnswersModalContent">
            <WelcomeMessage fileName={fileName} />
            <ul>
                {questions &&
                    questions.map(({ prompt, error, answer = '' }, index) => {
                        const hasError = !!error;
                        return (
                            <li key={index}>
                                <Question currentUser={currentUser} prompt={prompt} />
                                {!hasError && <Answer answer={answer} isLoading={isLoading} />}
                                {hasError && !isLoading && <InlineError />}
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default ContentAnswersModalContent;

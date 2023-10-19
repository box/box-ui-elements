import React from 'react';

import ContentAnswersModalChat from './ContentAnswersModalChat';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';

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
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
    const userScrolled = React.useRef(false);

    const handleScrollToBottom = React.useCallback(behavior => {
        if (messagesEndRef.current && messagesEndRef.current.scrollIntoView && contentRef.current) {
            // Only scroll if the content is at bottom
            if (!userScrolled.current) {
                messagesEndRef.current.scrollIntoView({ behavior });
            }
        }
    }, []);

    // Handle user scrolling
    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = contentRef.current;
            const threshold = scrollHeight - (scrollTop + clientHeight);
            userScrolled.current = threshold > 5;
        }
    };

    // Scroll to the bottom on chat load
    React.useEffect(() => {
        setTimeout(() => {
            handleScrollToBottom('instant');
        }, 0);
    }, [handleScrollToBottom]);

    // Scroll to the bottom if a new answer is loading
    React.useEffect(() => {
        if (isLoading) {
            userScrolled.current = false;
            handleScrollToBottom('smooth');
        }
    }, [handleScrollToBottom, isLoading]);

    return (
        <div
            className="bdl-ContentAnswersModalContent"
            data-testid="content-answers-modal-content"
            onScroll={handleScroll}
            ref={contentRef}
        >
            <ContentAnswersModalChat
                currentUser={currentUser}
                data-testid="content-answers-modal-content"
                fileName={fileName}
                handleScrollToBottom={handleScrollToBottom}
                isLoading={isLoading}
                questions={questions}
            />
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ContentAnswersModalContent;

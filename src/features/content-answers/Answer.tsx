import React, { useEffect } from 'react';

import ContentAnswersGridCard from './ContentAnswersGridCard';
import LoadingElement from './LoadingElement';

import './Answer.scss';

type Props = {
    answer?: string;
    handleScrollToBottom: Function;
    isLoading: boolean;
};

const Answer = ({ answer, handleScrollToBottom, isLoading }: Props) => {
    useEffect(() => {
        if (answer) {
            handleScrollToBottom('smooth');
        }
    }, [answer, handleScrollToBottom]);

    return (
        <div className="bdl-Answer">
            {answer && <ContentAnswersGridCard>{answer}</ContentAnswersGridCard>}
            {!answer && isLoading && <LoadingElement />}
        </div>
    );
};

export default Answer;

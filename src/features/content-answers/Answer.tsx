import * as React from 'react';

import ContentAnswersGridCard from './ContentAnswersGridCard';
import LoadingElement from './LoadingElement';

import './Answer.scss';

type Props = {
    answer?: string;
    isLoading: boolean;
};

const Answer = ({ answer, isLoading }: Props) => {
    return (
        <div className="bdl-Answer" data-testid="Answer">
            {answer && <ContentAnswersGridCard>{answer}</ContentAnswersGridCard>}
            {!answer && isLoading && <LoadingElement />}
        </div>
    );
};

export default Answer;

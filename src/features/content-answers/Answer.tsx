import * as React from 'react';

import ContentAnswersGridCard from './ContentAnswersGridCard';
import InlineError from './InlineError';
import LoadingElement from './LoadingElement';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ElementsXhrError } from '../../../common/types/api';

import './Answer.scss';

type Props = {
    answer?: string;
    error?: ElementsXhrError;
    isLoading: boolean;
};

const Answer = ({ answer, error, isLoading }: Props) => {
    return (
        <div className="bdl-Answer">
            {answer && <ContentAnswersGridCard>{answer}</ContentAnswersGridCard>}
            {!answer && !error && isLoading && <LoadingElement />}
            {error && <InlineError />}
        </div>
    );
};

export default Answer;

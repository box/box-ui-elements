import * as React from 'react';
import LoadingIndicator, { LoadingIndicatorSize } from '../../components/loading-indicator';
import ContentAnswersGridCard from './ContentAnswersGridCard';

import './LoadingElement.scss';

const LoadingElement = () => {
    return (
        <div className="bdl-LoadingElement" data-testid="LoadingElement">
            <ContentAnswersGridCard>
                <LoadingIndicator className="bdl-LoadingElement-LoadingIndicator" size={LoadingIndicatorSize.MEDIUM} />
            </ContentAnswersGridCard>
        </div>
    );
};

export default LoadingElement;

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import MetricsReview56 from '../../illustration/MetricsReview56';
import messages from './messages';
import { ResponseError } from './types';

import './ContentAnalyticsErrorState.scss';

interface Props {
    error?: ResponseError;
}

const ContentAnalyticsErrorState = ({ error }: Props) => {
    const renderErrorMessage = (responseError?: ResponseError) => {
        const isPermissionError = !!responseError && responseError.status === 403;

        if (isPermissionError) {
            return (
                <div
                    className="ContentAnalyticsErrorState-text--permission"
                    data-testid="ContentAnalyticsErrorState-text--permission"
                >
                    <FormattedMessage {...messages.contentAnalyticsPermissionError} />
                </div>
            );
        }

        return (
            <div className="ContentAnalyticsErrorState-text" data-testid="ContentAnalyticsErrorState-text">
                <FormattedMessage {...messages.contentAnalyticsErrorText} />
            </div>
        );
    };

    return (
        <div className="ContentAnalyticsErrorState" data-testid="ContentAnalyticsErrorState">
            <MetricsReview56 data-testid="ContentAnalyticsErrorState-image" />
            {renderErrorMessage(error)}
        </div>
    );
};

export default ContentAnalyticsErrorState;

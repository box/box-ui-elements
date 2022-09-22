import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import MetricsReview56 from '../../illustration/MetricsReview56';
import messages from './messages';
import { ResponseError } from './types';

import './ContentAnalyticsErrorState.scss';

const SIZE_MAP = {
    small: 56,
    medium: 80,
    large: 95,
};
interface Props {
    error: ResponseError;
    size?: 'small' | 'medium' | 'large';
}

const ContentAnalyticsErrorState = ({ error, size = 'small' }: Props) => {
    const renderErrorMessage = () => {
        const isPermissionError = error.status === 403;

        if (isPermissionError) {
            return (
                <div
                    className="ContentAnalyticsPermissionError-text"
                    data-testid="ContentAnalyticsPermissionError-text"
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
            <MetricsReview56
                height={SIZE_MAP[size]}
                width={SIZE_MAP[size]}
                data-testid="ContentAnalyticsErrorState-image"
            />
            {renderErrorMessage()}
        </div>
    );
};

ContentAnalyticsErrorState.propTypes = {
    error: PropTypes.object,
};

export default ContentAnalyticsErrorState;

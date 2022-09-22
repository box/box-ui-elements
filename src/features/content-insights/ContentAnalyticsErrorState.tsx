import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import HatWand140 from '../../illustration/HatWand140';
import MetricsReview56 from '../../illustration/MetricsReview56';
import messages from './messages';
import { ResponseError } from './types';

import './ContentAnalyticsErrorState.scss';

interface Props {
    error: ResponseError;
}

const ContentAnalyticsErrorState = ({ error }: Props) => {
    const renderErrorContent = () => {
        const isPermissionError = error.status === 403;

        if (isPermissionError) {
            return (
                <>
                    <MetricsReview56 data-testid="ContentAnalyticsPermissionError-image" />
                    <div className="ContentAnalyticsErrorState-text">
                        <FormattedMessage {...messages.contentAnalyticsPermissionError} />
                    </div>
                </>
            );
        }

        return (
            <>
                <HatWand140 data-testid="ContentAnalyticsErrorState-image" />
                <div className="ContentAnalyticsErrorState-text">
                    <FormattedMessage {...messages.contentAnalyticsErrorText} />
                </div>
            </>
        );
    };

    return (
        <div className="ContentAnalyticsErrorState" data-testid="ContentAnalyticsErrorState">
            {renderErrorContent()}
        </div>
    );
};

ContentAnalyticsErrorState.propTypes = {
    error: PropTypes.object,
};

export default ContentAnalyticsErrorState;

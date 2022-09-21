import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import HatWand140 from '../../illustration/HatWand140';
import MetricsReview56 from '../../illustration/MetricsReview56';
import messages from './messages';

import './ContentAnalyticsErrorState.scss';

interface Props {
    isPermissionError?: boolean;
}

const ContentAnalyticsErrorState = ({ isPermissionError = false }: Props) => {
    const renderErrorContent = () => {
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

export default ContentAnalyticsErrorState;

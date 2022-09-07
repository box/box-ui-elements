// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import HatWand140 from '../../illustration/HatWand140';
import messages from './messages';

import './ContentAnalyticsErrorState.scss';

const ContentAnalyticsErrorState = () => (
    <div className="ContentAnalyticsErrorState" data-testid="ContentAnalyticsErrorState">
        <HatWand140 data-testid="ContentAnalyticsErrorState-image" />
        <div className="ContentAnalyticsErrorState-text">
            <FormattedMessage {...messages.contentAnalyticsErrorText} />
        </div>
    </div>
);

export default ContentAnalyticsErrorState;

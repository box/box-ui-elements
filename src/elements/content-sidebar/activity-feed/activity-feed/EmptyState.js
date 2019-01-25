/**
 * @flow
 * @file Component for Activity feed empty state
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import LoadingIndicator from 'components/loading-indicator/LoadingIndicator';
import messages from 'elements/common/messages';
import IconActivityFeedEmptyState from '../icons';

type Props = {
    isLoading?: boolean,
    showCommentMessage?: boolean,
};

const EmptyState = ({ isLoading, showCommentMessage }: Props): React.Node => (
    <div className="bcs-activity-feed-empty-state">
        <IconActivityFeedEmptyState />
        {isLoading ? (
            <LoadingIndicator />
        ) : (
            <div className="bcs-empty-state-cta">
                <FormattedMessage {...messages.noActivity} />
                {showCommentMessage ? (
                    <aside>
                        <FormattedMessage {...messages.noActivityCommentPrompt} />
                    </aside>
                ) : null}
            </div>
        )}
    </div>
);

export default EmptyState;

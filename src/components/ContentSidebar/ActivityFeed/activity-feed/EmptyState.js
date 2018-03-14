/**
 * @flow
 * @file Component for Activity feed empty state
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import { IconActivityFeedEmptyState } from '../icons';

import messages from '../messages';

type Props = {
    isLoading?: boolean,
    showCommentMessage?: boolean
};

const EmptyState = ({ isLoading, showCommentMessage }: Props) => (
    <div className='box-ui-activity-feed-empty-state'>
        <IconActivityFeedEmptyState />
        {isLoading ? (
            <LoadingIndicator />
        ) : (
            <div className='empty-state-cta'>
                <b>
                    <FormattedMessage {...messages.noActivity} />
                </b>
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

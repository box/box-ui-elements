/**
 * @flow
 * @file Component for Activity feed empty state
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../../../common/messages';
import IconActivityFeedEmptyState from '../icons';

type Props = {
    showCommentMessage?: boolean,
};

const EmptyState = ({ showCommentMessage }: Props): React.Node => (
    <div className="bcs-activity-feed-empty-state">
        <IconActivityFeedEmptyState />
        <div className="bcs-empty-state-cta">
            <FormattedMessage {...messages.noActivity} />
            {showCommentMessage ? (
                <aside>
                    <FormattedMessage {...messages.noActivityCommentPrompt} />
                </aside>
            ) : null}
        </div>
    </div>
);

export default EmptyState;

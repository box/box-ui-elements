/**
 * @flow
 * @file Component for Activity feed empty state
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../../../common/messages';
import { ActivityFeedEmptyStateFallbackIllustration, ActivityFeedEmptyStateIllustration } from '../illustrations';

type Props = {
    showAnnotationMessage?: boolean,
    showCommentMessage?: boolean,
};

const EmptyState = ({ showAnnotationMessage, showCommentMessage }: Props): React.Node => {
    const showActionMessage = showAnnotationMessage || showCommentMessage;
    const actionMessage = showAnnotationMessage
        ? messages.noActivityAnnotationPrompt
        : messages.noActivityCommentPrompt;

    return (
        <div className="bcs-activity-feed-empty-state">
            {showAnnotationMessage ? (
                <ActivityFeedEmptyStateIllustration />
            ) : (
                <ActivityFeedEmptyStateFallbackIllustration />
            )}
            <div className="bcs-empty-state-cta">
                <FormattedMessage {...messages.noActivity}>
                    {(text: string) => <span className="bcs-empty-state-detail">{text}</span>}
                </FormattedMessage>
                {showActionMessage && (
                    <aside>
                        <FormattedMessage {...actionMessage} />
                    </aside>
                )}
            </div>
        </div>
    );
};

export default EmptyState;

/**
 * @flow
 * @file Component for Activity feed empty state
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../../../common/messages';
import { ActivityFeedEmptyStateFallbackIllustration, ActivityFeedEmptyStateIllustration } from '../illustrations';
import './EmptyState.scss';

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
        <div className="bcs-EmptyState">
            <div className="bcs-EmptyState-illustration">
                {showAnnotationMessage ? (
                    <ActivityFeedEmptyStateIllustration />
                ) : (
                    <ActivityFeedEmptyStateFallbackIllustration />
                )}
            </div>
            <div className="bcs-EmptyState-cta">
                <FormattedMessage {...messages.noActivity}>
                    {(text: string) => <span className="bcs-EmptyState-cta-detail">{text}</span>}
                </FormattedMessage>
                {showActionMessage && (
                    <aside className="bcs-EmptyState-cta-message">
                        <FormattedMessage {...actionMessage} />
                    </aside>
                )}
            </div>
        </div>
    );
};

export default EmptyState;

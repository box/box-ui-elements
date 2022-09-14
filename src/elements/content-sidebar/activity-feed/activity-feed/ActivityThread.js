// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import LoadingIndicator from '../../../../components/loading-indicator';
import PlainButton from '../../../../components/plain-button';
import ActivityThreadReplies from './ActivityThreadReplies';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { Comment as CommentType } from '../../../../common/types/feed';

import messages from './messages';
import './ActivityThread.scss';

type Props = {
    children: React.Node,
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onGetReplies?: () => void,
    onReplyDelete?: Function,
    onReplyEdit?: Function,
    replies?: Array<CommentType>,
    repliesLoading?: boolean,
    totalReplyCount?: number,
    translations?: Translations,
};

const ActivityThread = ({
    children,
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasReplies,
    mentionSelectorContacts,
    onGetReplies = noop,
    onReplyDelete = noop,
    onReplyEdit = noop,
    replies = [],
    repliesLoading,
    totalReplyCount = 0,
    translations,
}: Props) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleButtonLabel = isExpanded ? messages.hideReplies : messages.showReplies;
    const repliesToLoadCount = Math.max(totalReplyCount - 1, 0);

    const toggleReplies = () => {
        if (!isExpanded) {
            onGetReplies();
        }
        setIsExpanded(previousState => !previousState);
    };

    if (!hasReplies) {
        return children;
    }
    return (
        <div className="bcs-ActivityThread" data-testid="activity-thread">
            {children}

            {repliesLoading && (
                <div className="bcs-ActivityThread-loading" data-testid="activity-thread-loading">
                    <LoadingIndicator />
                </div>
            )}
            {!repliesLoading && totalReplyCount > 1 && (
                <PlainButton
                    className="bcs-ActivityThread-toggle"
                    onClick={toggleReplies}
                    type="button"
                    data-testid="activity-thread-button"
                >
                    <FormattedMessage values={{ repliesToLoadCount }} {...toggleButtonLabel} />
                </PlainButton>
            )}

            {!repliesLoading && totalReplyCount > 0 && replies.length && (
                <ActivityThreadReplies
                    currentUser={currentUser}
                    data-testid="activity-thread-replies"
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    isExpanded={isExpanded}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onReplyDelete}
                    onEdit={onReplyEdit}
                    replies={replies}
                    translations={translations}
                />
            )}
        </div>
    );
};

export default ActivityThread;

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
import type { Comment as CommentType, CommentFeedItemType } from '../../../../common/types/feed';

import messages from './messages';
import './ActivityThread.scss';

type Props = {
    children: React.Node,
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies: boolean,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onGetReplies?: () => void,
    onReplyCreate?: (parentId: string, parentType: CommentFeedItemType, text: string, hasMention: boolean) => void,
    onReplyDelete?: Function,
    onReplyEdit?: Function,
    replies?: Array<CommentType>,
    repliesTotalCount?: number,
    translations?: Translations,
};

const ActivityThread = ({
    children,
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasReplies,
    isRepliesLoading,
    mentionSelectorContacts,
    onGetReplies = noop,
    onReplyDelete = noop,
    onReplyEdit = noop,
    replies = [],
    repliesTotalCount = 0,
    translations,
}: Props) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleButtonLabel = isExpanded ? messages.hideReplies : messages.showReplies;
    const repliesToLoadCount = Math.max(repliesTotalCount - 1, 0);

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

            {isRepliesLoading && (
                <div className="bcs-ActivityThread-loading" data-testid="activity-thread-loading">
                    <LoadingIndicator />
                </div>
            )}
            {!isRepliesLoading && repliesTotalCount > 1 && (
                <PlainButton
                    className="bcs-ActivityThread-toggle"
                    onClick={toggleReplies}
                    type="button"
                    data-testid="activity-thread-button"
                >
                    <FormattedMessage values={{ repliesToLoadCount }} {...toggleButtonLabel} />
                </PlainButton>
            )}

            {!isRepliesLoading && repliesTotalCount > 0 && replies.length && (
                <ActivityThreadReplies
                    currentUser={currentUser}
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

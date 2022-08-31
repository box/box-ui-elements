// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Comment from '../comment';
import ActivityItem from './ActivityItem';
import PlainButton from '../../../../components/plain-button';

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
    id: string,
    mentionSelectorContacts?: SelectorItems<>,
    onGetReplies?: (id: string) => void,
    onReplyDelete?: Function,
    onReplyEdit?: Function,
    replies?: Array<CommentType>,
    total_reply_count?: number,
    translations?: Translations,
};

const ActivityThread = ({
    children,
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasReplies,
    id,
    mentionSelectorContacts,
    onGetReplies,
    onReplyDelete,
    onReplyEdit,
    replies = [],
    total_reply_count = 0,
    translations,
}: Props) => {
    const [repliesExpanded, setRepliesExpanded] = React.useState(false);

    const toggleReplyMessage = repliesExpanded ? messages.hideReplies : messages.getMoreReplies;
    const repliesToLoad = total_reply_count - 1;

    const toggleReplies = () => {
        !repliesExpanded && onGetReplies && onGetReplies(id);
        setRepliesExpanded(previousState => !previousState);
    };

    const renderReply = (reply: CommentType) => (
        <ActivityItem key={reply.type + reply.id} className="bcs-ActivityThread-reply" data-testid="reply">
            <Comment
                {...reply}
                currentUser={currentUser}
                getAvatarUrl={getAvatarUrl}
                getMentionWithQuery={getMentionWithQuery}
                getUserProfileUrl={getUserProfileUrl}
                mentionSelectorContacts={mentionSelectorContacts}
                onDelete={onReplyDelete}
                onEdit={onReplyEdit}
                permissions={{
                    can_delete: getProp(reply.permissions, 'can_delete', false),
                    can_edit: getProp(reply.permissions, 'can_edit', false),
                    can_resolve: getProp(reply.permissions, 'can_resolve', false),
                }}
                translations={translations}
            />
        </ActivityItem>
    );

    if (hasReplies) {
        return (
            <div className="bcs-ActivityThread">
                {children}

                {total_reply_count > 1 && (
                    <PlainButton
                        className={classNames('bcs-ActivityThread-button')}
                        data-testid="bcs-ActivityThread-button"
                        onClick={toggleReplies}
                        title={toggleReplyMessage.defaultMessage}
                        type="button"
                    >
                        <FormattedMessage values={{ repliesToLoad }} {...toggleReplyMessage} />
                    </PlainButton>
                )}

                {total_reply_count > 0 && (
                    <div className="bcs-ActivityThread-replies">
                        {!repliesExpanded
                            ? renderReply(replies[replies.length - 1])
                            : replies.map((reply: CommentType) => renderReply(reply))}
                    </div>
                )}
            </div>
        );
    }

    return children;
};

export default ActivityThread;

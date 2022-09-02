// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

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
    onGetReplies = noop,
    onReplyDelete = noop,
    onReplyEdit = noop,
    replies = [],
    total_reply_count = 0,
    translations,
}: Props) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleButtonLabel = isExpanded ? messages.hideReplies : messages.getMoreReplies;
    const repliesToLoadCount = total_reply_count - 1;

    const toggleReplies = () => {
        !isExpanded && onGetReplies(id);
        setIsExpanded(previousState => !previousState);
    };

    if (!hasReplies) {
        return children;
    }
    return (
        <div className="bcs-ActivityThread">
            {children}

            {total_reply_count > 1 && (
                <PlainButton className="bcs-ActivityThread-button" onClick={toggleReplies} type="button">
                    <FormattedMessage values={{ repliesToLoadCount }} {...toggleButtonLabel} />
                </PlainButton>
            )}

            {total_reply_count > 0 && replies.length && (
                <ActivityThreadReplies
                    isExpanded={isExpanded}
                    replies={replies}
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onReplyDelete}
                    onEdit={onReplyEdit}
                    translations={translations}
                />
            )}
        </div>
    );
};

export default ActivityThread;

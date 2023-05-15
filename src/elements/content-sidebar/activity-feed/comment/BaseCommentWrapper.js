// @flow
import * as React from 'react';
import BaseCommentContainer from './BaseCommentContainer';
import { type BaseCommentContainerProps, type BaseCommentWrapperType } from './types';

import Replies from './Replies';

const BaseCommentWrapper: BaseCommentWrapperType = (props: BaseCommentContainerProps) => {
    const {
        annotationActivityLink,
        children,
        hasReplies,
        currentUser,
        getAvatarUrl,
        getUserProfileUrl,
        getMentionWithQuery,
        mentionSelectorContacts,
        translations,
        isPending,
        isRepliesLoading,
        onHideReplies,
        onReplyCreate,
        onSelect,
        onShowReplies,
        replies,
        repliesTotalCount,
        ...rest
    } = props;

    return (
        // Seems like Flow doesn't understand rest operator here?
        // $FlowFixMe
        <BaseCommentContainer
            annotationActivityLink={annotationActivityLink}
            onSelect={onSelect}
            currentUser={currentUser}
            getUserProfileUrl={getUserProfileUrl}
            getAvatarUrl={getAvatarUrl}
            getMentionWithQuery={getMentionWithQuery}
            mentionSelectorContacts={mentionSelectorContacts}
            translations={translations}
            {...rest}
        >
            {hasReplies && replies ? (
                <Replies
                    currentUser={currentUser}
                    // Just flow nonsense. The type for the BaseCommentWrapper prop is typeof BaseCommentWrapper, so...
                    // $FlowFixMe
                    BaseCommentWrapper={BaseCommentWrapper}
                    getUserProfileUrl={getUserProfileUrl}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    mentionSelectorContacts={mentionSelectorContacts}
                    translations={translations}
                    isParentPending={isPending}
                    isRepliesLoading={isRepliesLoading}
                    onHideReplies={onHideReplies}
                    onReplyCreate={onReplyCreate}
                    onReplySelect={onSelect}
                    onShowReplies={onShowReplies}
                    replies={replies}
                    repliesTotalCount={repliesTotalCount}
                />
            ) : (
                undefined
            )}
        </BaseCommentContainer>
    );
};

export default BaseCommentWrapper;

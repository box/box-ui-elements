// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    Comment as CommentType,
} from '../../../../common/types/feed';
import type { SelectorItems, User } from '../../../../common/types/core';
import AnnotationActivity from '../annotations/AnnotationActivity';
import Comment from '../comment/Comment';
import ActivityCard from '../ActivityCard';

type Props = {
    currentFileVersionId: string,
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: (searchStr: string) => void,
    getUserProfileUrl?: GetProfileUrlCallback,
    isCurrentVersion: boolean,
    item: Annotation | CommentType,
    mentionSelectorContacts?: SelectorItems<User>,
    onAnnotationDelete?: ({ id: string, permissions: AnnotationPermission }) => any,
    onAnnotationEdit?: (id: string, text: string, permissions: AnnotationPermission) => any,
    onAnnotationReplyCreate?: ({ annotationId: string, message: string }) => any,
    onAnnotationSelect?: (annotation: Annotation) => void,
    onCommentDelete?: ({ id: string, permissions?: BoxCommentPermission }) => any,
    onCommentEdit?: (id: string, text: string, hasMention: boolean, permissions?: BoxCommentPermission) => any,
    onCommentReplyCreate?: ({ commentId: string, message: string }) => any,
    onGetAnnotationReplies?: ({ annotationId: string }) => void,
    onGetCommentReplies?: ({ commentId: string }) => void,
    translations?: Translations,
};

const ActivityThread = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isCurrentVersion,
    item,
    mentionSelectorContacts,
    // eslint-disable-next-line no-unused-vars
    onAnnotationReplyCreate = noop,
    // eslint-disable-next-line no-unused-vars
    onCommentReplyCreate = noop,
    onCommentDelete = noop,
    onCommentEdit = noop,
    onAnnotationSelect = noop,
    onAnnotationDelete = noop,
    onAnnotationEdit = noop,
    // eslint-disable-next-line no-unused-vars
    onGetAnnotationReplies = noop,
    // eslint-disable-next-line no-unused-vars
    onGetCommentReplies = noop,
    translations,
}: Props) => {
    return (
        <ActivityCard className="bcs-ActivityThread">
            {item.type === 'comment' && (
                <Comment
                    {...item}
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onCommentDelete}
                    onEdit={onCommentEdit}
                    permissions={{
                        can_delete: getProp(item.permissions, 'can_delete', false),
                        can_edit: getProp(item.permissions, 'can_edit', false),
                        can_resolve: getProp(item.permissions, 'can_resolve', false),
                    }}
                    translations={translations}
                />
            )}

            {item.type === 'annotation' && (
                <AnnotationActivity
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getUserProfileUrl={getUserProfileUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    isCurrentVersion={isCurrentVersion}
                    item={item}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onEdit={onAnnotationEdit}
                    onDelete={onAnnotationDelete}
                    onSelect={onAnnotationSelect}
                />
            )}
        </ActivityCard>
    );
};

export default ActivityThread;

// @flow
import classNames from 'classnames';
import noop from 'lodash/noop';
import React, { useState } from 'react';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityTimestamp from '../common/activity-timestamp';
import AnnotationActivityLink from './AnnotationActivityLink';
import AnnotationActivityMenu from './AnnotationActivityMenu';
import Avatar from '../Avatar';
import CommentForm from '../comment-form';
import Media from '../../../../components/media';
import messages from './messages';
import type { AnnotationReply, AnnotationFileVersion, Target } from './types';
import type { ActionItemError, BoxCommentPermission } from '../../../../common/types/feed';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import UserLink from '../common/user-link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { PLACEHOLDER_USER } from '../../../../constants';

import './AnnotationActivity.scss';

type Props = {
    created_at: string | number,
    created_by: User,
    currentUser?: User,
    description?: AnnotationReply,
    error?: ActionItemError,
    file_version: AnnotationFileVersion,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    isActive?: boolean,
    isDisabled?: boolean,
    isPending?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    modified_at?: string | number,
    onDelete?: ({ id: string, permissions?: BoxCommentPermission }) => any,
    onEdit?: ({ hasMention: boolean, id: string, permissions?: BoxCommentPermission, text: string }) => any,
    onSelect?: (id: string) => any,
    permissions?: BoxCommentPermission,
    target: Target,
};

const AnnotationActivity = (props: Props) => {
    const {
        created_at,
        created_by,
        currentUser,
        description,
        error,
        getAvatarUrl,
        getMentionWithQuery,
        getUserProfileUrl,
        id,
        isActive = false,
        isDisabled,
        isPending,
        mentionSelectorContacts,
        onDelete = noop,
        onEdit = noop,
        onSelect = noop,
        permissions = {},
        target,
    } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [isInputOpen, setIsInputOpen] = useState(false);

    const handleDeleteConfirm = (): void => {
        if (!onDelete) {
            return;
        }
        onDelete({ id, permissions });
    };

    const handleOnSelect = () => {
        if (!onSelect) {
            return;
        }
        onSelect(id);
    };

    const handleEditClick = (): void => {
        setIsEditing(true);
        setIsInputOpen(true);
    };

    const commentFormFocusHandler = (): void => setIsInputOpen(true);

    const commentFormCancelHandler = (): void => {
        setIsInputOpen(false);
        setIsEditing(false);
    };

    const commentFormSubmitHandler = (): void => {
        setIsInputOpen(false);
        setIsEditing(false);
    };

    const handleUpdate = ({ text, hasMention }: { hasMention: boolean, id: string, text: string }): void => {
        if (onEdit) {
            onEdit({ id, hasMention, text });
        }

        commentFormSubmitHandler();
    };

    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const canEdit = onEdit !== noop && permissions.can_edit;
    const canDelete = permissions.can_delete;
    const isMenuVisible = (canDelete || canEdit) && !isPending;
    const message = (description && description.message) || '';

    return (
        <div className={`bcs-AnnotationActivity ${classNames({ 'is-active': isActive })}`}>
            <Media
                className={classNames('bcs-AnnotationActivity-media', {
                    'bcs-is-pending': isPending || error,
                })}
            >
                <Media.Figure>
                    <Avatar getAvatarUrl={getAvatarUrl} user={createdByUser} />
                </Media.Figure>
                <Media.Body>
                    {isMenuVisible && (
                        <AnnotationActivityMenu
                            canDelete={canDelete}
                            canEdit={canEdit}
                            handleDeleteConfirm={handleDeleteConfirm}
                            handleEditClick={handleEditClick}
                        />
                    )}
                    <div className="bcs-AnnotationActivity-headline">
                        <UserLink
                            data-resin-target={ACTIVITY_TARGETS.PROFILE}
                            getUserProfileUrl={getUserProfileUrl}
                            id={createdByUser.id}
                            name={createdByUser.name}
                        />
                    </div>
                    <div>
                        <ActivityTimestamp date={createdAtTimestamp} />
                    </div>
                    {isEditing ? (
                        <CommentForm
                            className={classNames('bcs-AnnotationActivity-editor', {
                                'bcs-is-disabled': isDisabled,
                            })}
                            entityId={id}
                            getAvatarUrl={getAvatarUrl}
                            getMentionWithQuery={getMentionWithQuery}
                            isDisabled={isDisabled}
                            isEditing={isEditing}
                            isOpen={isInputOpen}
                            mentionSelectorContacts={mentionSelectorContacts}
                            onCancel={commentFormCancelHandler}
                            onFocus={commentFormFocusHandler}
                            showTip={false}
                            tagged_message={message}
                            updateComment={handleUpdate}
                            // $FlowFixMe
                            user={currentUser}
                        />
                    ) : (
                        <ActivityMessage id={id} tagged_message={message} getUserProfileUrl={getUserProfileUrl} />
                    )}
                    <AnnotationActivityLink
                        id={id}
                        message={{
                            ...messages.annotationActivityPageItem,
                            values: { number: target.location.value },
                        }}
                        onClick={handleOnSelect}
                    />
                </Media.Body>
            </Media>
            {/* $FlowFixMe */}
            {error ? <ActivityError {...error} /> : null}
        </div>
    );
};

export default AnnotationActivity;

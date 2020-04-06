// @flow
import React, { useState } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import TetherComponent from 'react-tether';
import Avatar from '../Avatar';
import Media from '../../../../components/media';
import { MenuItem } from '../../../../components/menu';
import IconTrash from '../../../../icons/general/IconTrash';
import IconPencil from '../../../../icons/general/IconPencil';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import DeleteConfirmation from '../common/delete-confirmation';
import ActivityTimestamp from '../common/activity-timestamp';
import UserLink from '../common/user-link';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import AnnotationActivityItem from './AnnotationActivityItem';
import CommentForm from '../comment-form';
import { bdlGray } from '../../../../styles/variables';
import { PLACEHOLDER_USER } from '../../../../constants';
import messages from './messages';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { BoxCommentPermission, ActionItemError } from '../../../../common/types/feed';

import './AnnotationActivity.scss';

type Props = {
    created_at: string | number,
    created_by: User,
    currentUser?: User,
    error?: ActionItemError,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    isActive?: boolean,
    isDisabled?: boolean,
    isPending?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    modified_at?: string | number,
    onDelete: ({ id: string, permissions: BoxCommentPermission }) => void,
    onEdit: (id: string, text: string, hasMention: boolean, permissions?: BoxCommentPermission) => any,
    onSelect: (id: string) => void,
    permissions?: BoxCommentPermission,
    tagged_message: string,
    target?: object,
    translatedTaggedMessage?: string,
    translations?: Translations,
};

const AnnotationActivity = (props: Props) => {
    const {
        created_at,
        created_by,
        currentUser,
        error,
        getAvatarUrl,
        getMentionWithQuery,
        getUserProfileUrl,
        id,
        isActive = false,
        isDisabled,
        isPending,
        mentionSelectorContacts,
        onDelete,
        onEdit,
        onSelect,
        permissions = {},
        tagged_message = '',
        translatedTaggedMessage,
        translations,
    } = props;
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isInputOpen, setIsInputOpen] = useState(false);

    const handleDeleteConfirm = (): void => {
        onDelete({ id, permissions });
    };

    const handleDeleteCancel = (): void => {
        setIsConfirmingDelete(false);
    };

    const handleDeleteClick = () => {
        setIsConfirmingDelete(true);
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
        onEdit(id, text, hasMention, permissions);
        commentFormSubmitHandler();
    };

    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const canEdit = onEdit !== noop && permissions.can_edit;
    const canDelete = permissions.can_delete;
    const isMenuVisible = (canDelete || canEdit) && !isPending;

    return (
        <div className={`bcs-AnnotationActivity ${isActive ? 'is-active' : ''}`}>
            <Media
                className={classNames('bcs-Comment-media', {
                    'bcs-is-pending': isPending || error,
                })}
            >
                <Media.Figure>
                    <Avatar getAvatarUrl={getAvatarUrl} user={createdByUser} />
                </Media.Figure>
                <Media.Body>
                    {isMenuVisible && (
                        <TetherComponent
                            attachment="top right"
                            className="bcs-Comment-deleteConfirmationModal"
                            constraints={[{ to: 'scrollParent', attachment: 'together' }]}
                            targetAttachment="bottom right"
                        >
                            <Media.Menu
                                isDisabled={isConfirmingDelete}
                                data-testid="comment-actions-menu"
                                menuProps={{
                                    'data-resin-component': ACTIVITY_TARGETS.COMMENT_OPTIONS,
                                }}
                            >
                                {canEdit && (
                                    <MenuItem
                                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                                        data-testid="edit-comment"
                                        onClick={handleEditClick}
                                    >
                                        <IconPencil color={bdlGray} />
                                        <FormattedMessage {...messages.annotationActivityEditMenuItem} />
                                    </MenuItem>
                                )}
                                {canDelete && (
                                    <MenuItem
                                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_DELETE}
                                        data-testid="delete-comment"
                                        onClick={handleDeleteClick}
                                    >
                                        <IconTrash color={bdlGray} />
                                        <FormattedMessage {...messages.annotationActivityDeleteMenuItem} />
                                    </MenuItem>
                                )}
                            </Media.Menu>
                            {isConfirmingDelete && (
                                <DeleteConfirmation
                                    data-resin-component={ACTIVITY_TARGETS.COMMENT_OPTIONS}
                                    isOpen={isConfirmingDelete}
                                    message={messages.annotationActivityDeletePrompt}
                                    onDeleteCancel={handleDeleteCancel}
                                    onDeleteConfirm={handleDeleteConfirm}
                                />
                            )}
                        </TetherComponent>
                    )}
                    <div className="bcs-AnnotationActivity-headline">
                        <UserLink
                            data-resin-target={ACTIVITY_TARGETS.PROFILE}
                            id={createdByUser.id}
                            name={createdByUser.name}
                            getUserProfileUrl={getUserProfileUrl}
                        />
                    </div>
                    <div>
                        <ActivityTimestamp date={createdAtTimestamp} />
                    </div>
                    {isEditing ? (
                        <CommentForm
                            isDisabled={isDisabled}
                            className={classNames('bcs-AnnotationActivity-editor', {
                                'bcs-is-disabled': isDisabled,
                            })}
                            updateComment={handleUpdate}
                            isOpen={isInputOpen}
                            user={currentUser}
                            onCancel={commentFormCancelHandler}
                            onFocus={commentFormFocusHandler}
                            isEditing={isEditing}
                            entityId={id}
                            showTip={false}
                            tagged_message={tagged_message}
                            getAvatarUrl={getAvatarUrl}
                            mentionSelectorContacts={mentionSelectorContacts}
                            getMentionWithQuery={getMentionWithQuery}
                        />
                    ) : (
                        <ActivityMessage
                            id={id}
                            tagged_message={tagged_message}
                            translatedTaggedMessage={translatedTaggedMessage}
                            {...translations}
                            translationFailed={error ? true : null}
                            getUserProfileUrl={getUserProfileUrl}
                        />
                    )}
                    <AnnotationActivityItem
                        href={`/activity/annotations/${id}`}
                        id={id}
                        message={{ ...messages.annotationActivityPageItem, values: { number: 1 } }}
                        onClick={onSelect}
                    />
                </Media.Body>
            </Media>
            {error ? <ActivityError {...error} /> : null}
        </div>
    );
};

export default AnnotationActivity;

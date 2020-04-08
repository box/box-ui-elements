// @flow
import classNames from 'classnames';
import noop from 'lodash/noop';
import React, { useState } from 'react';
import TetherComponent from 'react-tether';
import { FormattedMessage } from 'react-intl';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityTimestamp from '../common/activity-timestamp';
import AnnotationActivityLink from './AnnotationActivityLink';
import Avatar from '../Avatar';
import CommentForm from '../comment-form';
import DeleteConfirmation from '../common/delete-confirmation';
import IconPencil from '../../../../icons/general/IconPencil';
import IconTrash from '../../../../icons/general/IconTrash';
import Media from '../../../../components/media';
import messages from './messages';
import type {
    ActionItemError,
    AnnotationReply,
    AnnotationRegionTarget,
    BoxCommentPermission,
} from '../../../../common/types/feed';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import UserLink from '../common/user-link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { bdlGray } from '../../../../styles/variables';
import { MenuItem } from '../../../../components/menu';
import { PLACEHOLDER_USER } from '../../../../constants';

import './AnnotationActivity.scss';

type Props = {
    created_at: string | number,
    created_by: User,
    currentUser?: User,
    description?: AnnotationReply,
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
    onDelete?: ({ id: string, permissions?: BoxCommentPermission }) => any,
    onEdit?: (id: string, text: string, hasMention: boolean, permissions?: BoxCommentPermission) => any,
    onSelect?: (id: string) => any,
    permissions?: BoxCommentPermission,
    target?: AnnotationRegionTarget,
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
        onDelete,
        onEdit,
        onSelect,
        permissions = {},
    } = props;
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
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
        if (onEdit) {
            onEdit(id, text, hasMention, permissions);
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
                        <TetherComponent
                            attachment="top right"
                            className="bcs-AnnotationActivity-deleteConfirmationModal"
                            constraints={[{ to: 'scrollParent', attachment: 'together' }]}
                            targetAttachment="bottom right"
                        >
                            <Media.Menu
                                isDisabled={isConfirmingDelete}
                                data-testid="annotationActivity-actions-menu"
                                menuProps={{
                                    'data-resin-component': ACTIVITY_TARGETS.ANNOTATION_OPTIONS,
                                }}
                            >
                                {canEdit && (
                                    <MenuItem
                                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_EDIT}
                                        data-testid="edit-annotation-activity"
                                        onClick={handleEditClick}
                                    >
                                        <IconPencil color={bdlGray} />
                                        <FormattedMessage {...messages.annotationActivityEditMenuItem} />
                                    </MenuItem>
                                )}
                                {canDelete && (
                                    <MenuItem
                                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_DELETE}
                                        data-testid="delete-annotation-activity"
                                        onClick={handleDeleteClick}
                                    >
                                        <IconTrash color={bdlGray} />
                                        <FormattedMessage {...messages.annotationActivityDeleteMenuItem} />
                                    </MenuItem>
                                )}
                            </Media.Menu>
                            {isConfirmingDelete && (
                                <DeleteConfirmation
                                    data-resin-component={ACTIVITY_TARGETS.ANNOTATION_OPTIONS}
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
                        href={`/activity/annotations/${id}`}
                        id={id}
                        message={{ ...messages.annotationActivityPageItem, values: { number: 1 } }}
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

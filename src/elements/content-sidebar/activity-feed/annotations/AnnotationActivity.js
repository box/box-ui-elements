// @flow
import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import TetherComponent from 'react-tether';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityStatus from '../common/activity-status';
import ActivityTimestamp from '../common/activity-timestamp';
import AnnotationActivityLink from './AnnotationActivityLink';
import AnnotationActivityMenu from './AnnotationActivityMenu';
import Avatar from '../Avatar';
import CommentForm from '../comment-form/CommentForm';
import DeleteConfirmation from '../common/delete-confirmation';
import Media from '../../../../components/media';
import messages from './messages';
import SelectableActivityCard from '../SelectableActivityCard';
import UserLink from '../common/user-link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { COMMENT_STATUS_RESOLVED, PLACEHOLDER_USER } from '../../../../constants';
import type { Annotation, AnnotationPermission, FeedItemStatus } from '../../../../common/types/feed';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User, BoxItem } from '../../../../common/types/core';

import IconAnnotation from '../../../../icons/two-toned/IconAnnotation';
import { convertMillisecondsToHMMSS } from '../../../../utils/timestamp';

import './AnnotationActivity.scss';

import type { OnAnnotationEdit, OnAnnotationStatusChange } from '../comment/types';

type Props = {
    currentUser?: User,
    file?: BoxItem,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: (searchStr: string) => void,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasVersions?: boolean,
    isCurrentVersion: boolean,
    item: Annotation,
    mentionSelectorContacts?: SelectorItems<User>,
    onDelete?: ({ id: string, permissions: AnnotationPermission }) => any,
    onEdit?: OnAnnotationEdit,
    onSelect?: (annotation: Annotation) => any,
    onStatusChange?: OnAnnotationStatusChange,
};

const AnnotationActivity = ({
    currentUser,
    item,
    file,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasVersions,
    isCurrentVersion,
    mentionSelectorContacts,
    onDelete = noop,
    onEdit = noop,
    onSelect = noop,
    onStatusChange = noop,
}: Props) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const {
        created_at,
        created_by,
        description,
        error,
        file_version,
        id,
        isPending,
        modified_at,
        permissions = {},
        status,
        target,
    } = item;
    const { can_delete: canDelete, can_edit: canEdit, can_resolve: canResolve } = permissions;
    const isEdited = modified_at !== undefined && modified_at !== created_at;
    const isFileVersionUnavailable = file_version === null;
    const isCardDisabled = !!error || isConfirmingDelete || isMenuOpen || isEditing || isFileVersionUnavailable;
    const isMenuVisible = (canDelete || canEdit || canResolve) && !isPending;
    const isResolved = status === COMMENT_STATUS_RESOLVED;

    const handleDelete = (): void => setIsConfirmingDelete(true);
    const handleDeleteCancel = (): void => setIsConfirmingDelete(false);
    const handleDeleteConfirm = (): void => {
        setIsConfirmingDelete(false);
        onDelete({ id, permissions });
    };

    const handleEdit = (): void => setIsEditing(true);
    const handleFormCancel = (): void => setIsEditing(false);
    const handleFormSubmit = ({ text }): void => {
        setIsEditing(false);
        onEdit({ id, text, permissions });
    };
    const handleMenuClose = (): void => setIsMenuOpen(false);
    const handleMenuOpen = (): void => setIsMenuOpen(true);
    const handleMouseDown = (event: MouseEvent) => {
        if (isCardDisabled) {
            return;
        }

        // Prevents document event handlers from executing because box-annotations relies on
        // detecting mouse events on the document outside of annotation targets to determine when to
        // deselect annotations
        event.stopPropagation();
    };
    const handleSelect = () => onSelect(item);

    const handleStatusChange = (newStatus: FeedItemStatus) => onStatusChange({ id, status: newStatus, permissions });

    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const linkMessage = isCurrentVersion ? messages.annotationActivityPageItem : messages.annotationActivityVersionLink;
    const linkValue = isCurrentVersion ? target.location.value : getProp(file_version, 'version_number');
    const message = (description && description.message) || '';
    const activityLinkMessage = isFileVersionUnavailable
        ? messages.annotationActivityVersionUnavailable
        : { ...linkMessage, values: { number: linkValue } };
    const tetherProps = {
        attachment: 'top right',
        className: 'bcs-AnnotationActivity-deleteConfirmationModal',
        constraints: [{ to: 'scrollParent', attachment: 'together' }],
        targetAttachment: 'bottom right',
    };

    const isVideoAnnotation = target?.location?.type === 'frame';
    const annotationsMillisecondTimestampInHMMSS = isVideoAnnotation
        ? convertMillisecondsToHMMSS(target.location.value)
        : null;

    return (
        <>
            <SelectableActivityCard
                className="bcs-AnnotationActivity"
                data-resin-feature="annotations"
                data-resin-iscurrent={isCurrentVersion}
                data-resin-itemid={id}
                data-resin-target="annotationButton"
                isDisabled={isCardDisabled}
                onMouseDown={handleMouseDown}
                onSelect={handleSelect}
            >
                <Media
                    className={classNames('bcs-AnnotationActivity-media', {
                        'bcs-is-pending': isPending || error,
                    })}
                >
                    <Media.Figure className="bcs-AnnotationActivity-avatar">
                        <Avatar getAvatarUrl={getAvatarUrl} user={createdByUser} badgeIcon={<IconAnnotation />} />
                    </Media.Figure>
                    <Media.Body>
                        <div className="bcs-AnnotationActivity-headline">
                            <UserLink
                                data-resin-target={ACTIVITY_TARGETS.PROFILE}
                                getUserProfileUrl={getUserProfileUrl}
                                id={createdByUser.id}
                                name={createdByUser.name}
                            />
                        </div>
                        <div className="bcs-AnnotationActivity-timestamp">
                            <ActivityTimestamp date={createdAtTimestamp} />
                            {hasVersions && !isVideoAnnotation && (
                                <AnnotationActivityLink
                                    className="bcs-AnnotationActivity-link"
                                    data-resin-target="annotationLink"
                                    id={id}
                                    isDisabled={isFileVersionUnavailable}
                                    message={activityLinkMessage}
                                    onClick={handleSelect}
                                />
                            )}
                        </div>
                        <ActivityStatus status={status} />
                        {isEditing && currentUser ? (
                            <CommentForm
                                className="bcs-AnnotationActivity-editor"
                                entityId={id}
                                file={file}
                                getAvatarUrl={getAvatarUrl}
                                getMentionWithQuery={getMentionWithQuery}
                                isEditing={isEditing}
                                isOpen={isEditing}
                                mentionSelectorContacts={mentionSelectorContacts}
                                onCancel={handleFormCancel}
                                updateComment={handleFormSubmit}
                                user={currentUser}
                                tagged_message={message}
                            />
                        ) : (
                            <ActivityMessage
                                getUserProfileUrl={getUserProfileUrl}
                                id={id}
                                annotationsMillisecondTimestamp={annotationsMillisecondTimestampInHMMSS}
                                onClick={handleSelect}
                                isEdited={isEdited && !isResolved}
                                tagged_message={message}
                            />
                        )}
                    </Media.Body>
                </Media>
                {/* $FlowFixMe */}
                {error ? <ActivityError {...error} /> : null}
            </SelectableActivityCard>
            <TetherComponent {...tetherProps}>
                {isMenuVisible && (
                    <AnnotationActivityMenu
                        canDelete={canDelete}
                        canEdit={canEdit}
                        canResolve={canResolve}
                        className="bcs-AnnotationActivity-menu"
                        id={id}
                        isDisabled={isConfirmingDelete}
                        status={status}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onMenuClose={handleMenuClose}
                        onMenuOpen={handleMenuOpen}
                        onStatusChange={handleStatusChange}
                    />
                )}
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
        </>
    );
};

export default AnnotationActivity;

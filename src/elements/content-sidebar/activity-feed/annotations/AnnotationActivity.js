// @flow
import classNames from 'classnames';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import * as React from 'react';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import AnnotationActivityMenu from './AnnotationActivityMenu';
import AnnotationActivityTimestamp from './AnnotationActivityTimestamp';
import Avatar from '../Avatar';
import CommentForm from '../comment-form/CommentForm';
import Media from '../../../../components/media';
import messages from './messages';
import SelectableActivityCard from '../SelectableActivityCard';
import UserLink from '../common/user-link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { PLACEHOLDER_USER } from '../../../../constants';
import type { Annotation, AnnotationPermission } from '../../../../common/types/feed';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';

import './AnnotationActivity.scss';

type Props = {
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: (searchStr: string) => void,
    getUserProfileUrl?: GetProfileUrlCallback,
    isCurrentVersion: boolean,
    item: Annotation,
    mentionSelectorContacts?: SelectorItems<User>,
    onDelete?: ({ id: string, permissions: AnnotationPermission }) => any,
    onEdit?: (id: string, text: string, permissions: AnnotationPermission) => void,
    onSelect?: (annotation: Annotation) => any,
};

const AnnotationActivity = ({
    currentUser,
    item,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isCurrentVersion,
    mentionSelectorContacts,
    onDelete = noop,
    onEdit = noop,
    onSelect = noop,
}: Props) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { created_at, created_by, description, error, file_version, id, isPending, permissions = {}, target } = item;
    const isFileVersionUnavailable = file_version === null;
    const isCardDisabled = error || isMenuOpen || isEditing || isFileVersionUnavailable;

    const handleDeleteConfirm = (): void => {
        onDelete({ id, permissions });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleOnSelect = () => {
        onSelect(item);
    };

    const handleFormCancel = (): void => {
        setIsEditing(false);
    };

    const handleFormSubmit = ({ text }): void => {
        setIsEditing(false);
        onEdit(id, text, permissions);
    };

    const handleMenuClose = (): void => {
        setIsMenuOpen(false);
    };

    const handleMenuOpen = (): void => {
        setIsMenuOpen(true);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isCardDisabled) {
            return;
        }

        // Prevents document event handlers from executing because box-annotations relies on
        // detecting mouse events on the document outside of annotation targets to determine when to
        // deselect annotations
        event.stopPropagation();
    };

    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const { can_delete: canDelete, can_edit: canEdit } = permissions;
    const isMenuVisible = (canDelete || canEdit) && !isPending;
    const message = (description && description.message) || '';
    const linkMessage = isCurrentVersion ? messages.annotationActivityPageItem : messages.annotationActivityVersionLink;
    const linkValue = isCurrentVersion ? target.location.value : getProp(file_version, 'version_number');
    const activityLinkMessage = isFileVersionUnavailable
        ? messages.annotationActivityVersionUnavailable
        : { ...linkMessage, values: { number: linkValue } };

    return (
        <>
            <SelectableActivityCard
                data-resin-iscurrent={isCurrentVersion}
                data-resin-target="annotationButton"
                data-resin-itemid={id}
                className="bcs-AnnotationActivity"
                data-resin-feature="annotations"
                isDisabled={isCardDisabled}
                onMouseDown={handleMouseDown}
                onSelect={handleOnSelect}
            >
                <Media
                    className={classNames('bcs-AnnotationActivity-media', {
                        'bcs-is-pending': isPending || error,
                    })}
                >
                    <Media.Figure>
                        <Avatar getAvatarUrl={getAvatarUrl} user={createdByUser} />
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
                        <AnnotationActivityTimestamp
                            data-resin-target="annotationLink"
                            date={createdAtTimestamp}
                            id={id}
                            isDisabled={isFileVersionUnavailable}
                            message={activityLinkMessage}
                            onAnnotationSelect={handleOnSelect}
                        />
                        {isEditing && currentUser ? (
                            <CommentForm
                                className="bcs-AnnotationActivity-editor"
                                entityId={id}
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
                            <ActivityMessage id={id} tagged_message={message} getUserProfileUrl={getUserProfileUrl} />
                        )}
                    </Media.Body>
                </Media>
                {/* $FlowFixMe */}
                {error ? <ActivityError {...error} /> : null}
            </SelectableActivityCard>
            {isMenuVisible && (
                <AnnotationActivityMenu
                    canDelete={canDelete}
                    canEdit={canEdit}
                    id={id}
                    onDeleteConfirm={handleDeleteConfirm}
                    onEdit={handleEdit}
                    onMenuClose={handleMenuClose}
                    onMenuOpen={handleMenuOpen}
                />
            )}
        </>
    );
};

export default AnnotationActivity;

// @flow
import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityTimestamp from '../common/activity-timestamp';
import AnnotationActivityLink from './AnnotationActivityLink';
import AnnotationActivityMenu from './AnnotationActivityMenu';
import Avatar from '../Avatar';
import CommentForm from '../comment-form/CommentForm';
import Media from '../../../../components/media';
import messages from './messages';
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
    const [isInteractive, setIsInteractive] = React.useState(true);
    const { created_at, created_by, description, error, file_version, id, isPending, permissions = {}, target } = item;

    const handleDeleteConfirm = (): void => {
        onDelete({ id, permissions });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleOnSelect = () => {
        if (!isInteractive) {
            return;
        }

        onSelect(item);
    };

    const handleFormCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();
        event.stopPropagation();

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

    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const { can_delete: canDelete, can_edit: canEdit } = permissions;
    const isFileVersionUnavailable = file_version === null;
    const isMenuVisible = (canDelete || canEdit) && !isPending;
    const message = (description && description.message) || '';
    const linkMessage = isCurrentVersion ? messages.annotationActivityPageItem : messages.annotationActivityVersionLink;
    const linkValue = isCurrentVersion ? target.location.value : getProp(file_version, 'version_number');
    const activityLinkMessage = isFileVersionUnavailable
        ? messages.annotationActivityVersionUnavailable
        : { ...linkMessage, values: { number: linkValue } };

    React.useEffect(() => {
        setIsInteractive(!(isMenuOpen || isEditing || isFileVersionUnavailable));
    }, [isEditing, isFileVersionUnavailable, isMenuOpen]);

    return (
        <div
            className={classNames('bcs-AnnotationActivity', { 'is-interactive': isInteractive })}
            data-resin-feature="annotations"
            data-resin-iscurrent={isCurrentVersion}
            data-resin-itemid={id}
            data-resin-target="annotationButton"
            id={id}
            onClick={handleOnSelect}
            role="button"
            tabIndex="0"
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
                        <FormattedMessage {...messages.annotationActivityInfo}>
                            {msg => <small className="bcs-AnnotationActivity-info">{msg}</small>}
                        </FormattedMessage>
                        <AnnotationActivityLink
                            data-resin-iscurrent={isCurrentVersion}
                            data-resin-itemid={id}
                            data-resin-target="annotationLink"
                            id={id}
                            isDisabled={isFileVersionUnavailable}
                            message={activityLinkMessage}
                            onClick={handleOnSelect}
                        />
                    </div>
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
        </div>
    );
};

export default AnnotationActivity;

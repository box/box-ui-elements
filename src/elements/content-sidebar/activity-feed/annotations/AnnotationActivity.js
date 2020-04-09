// @flow
import classNames from 'classnames';
import noop from 'lodash/noop';
import * as React from 'react';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityTimestamp from '../common/activity-timestamp';
import AnnotationActivityLink from './AnnotationActivityLink';
import AnnotationActivityMenu from './AnnotationActivityMenu';
import Avatar from '../Avatar';
import Media from '../../../../components/media';
import messages from './messages';
import type {
    ActionItemError,
    BoxAnnotationPermission,
    Reply,
    BoxItemVersionMini,
    Target,
} from '../../../../common/types/feed';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { User } from '../../../../common/types/core';
import UserLink from '../common/user-link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { PLACEHOLDER_USER } from '../../../../constants';

import './AnnotationActivity.scss';

type Props = {
    created_at: string | number,
    created_by: User,
    currentUser?: User,
    description?: Reply,
    error?: ActionItemError,
    file_version: BoxItemVersionMini,
    getAvatarUrl: GetAvatarUrlCallback,
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    isActive?: boolean,
    isDisabled?: boolean,
    isPending?: boolean,
    modified_at?: string | number,
    onDelete?: ({ id: string, permissions?: BoxAnnotationPermission }) => any,
    onSelect?: (id: string) => any,
    permissions?: BoxAnnotationPermission,
    target: Target,
};

const AnnotationActivity = (props: Props) => {
    const {
        created_at,
        created_by,
        description,
        error,
        getAvatarUrl,
        getUserProfileUrl,
        id,
        isActive = false,
        isPending,
        onDelete = noop,
        onSelect = noop,
        permissions = {},
        target,
    } = props;

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

    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const canDelete = permissions.can_delete;
    const isMenuVisible = canDelete && !isPending;
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
                        <AnnotationActivityMenu canDelete={canDelete} handleDeleteConfirm={handleDeleteConfirm} />
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
                    <ActivityMessage id={id} tagged_message={message} getUserProfileUrl={getUserProfileUrl} />
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

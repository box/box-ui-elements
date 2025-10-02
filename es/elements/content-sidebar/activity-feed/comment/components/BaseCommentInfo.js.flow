// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import { PLACEHOLDER_USER } from '../../../../../constants';
import ActivityTimestamp from '../../common/activity-timestamp';
import Avatar from '../../Avatar';
import IconAnnotation from '../../../../../icons/two-toned/IconAnnotation';
import UserLink from '../../common/user-link';

import type { FeedItemStatus } from '../../../../../common/types/feed';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../../common/flowTypes';
import type { User } from '../../../../../common/types/core';

import messages from '../messages';

import './BaseCommentInfo.scss';

export interface BaseCommentInfoProps {
    annotationActivityLink?: React.Element<any> | typeof undefined;
    created_at: string | number;
    created_by: User;
    getAvatarUrl: GetAvatarUrlCallback;
    getUserProfileUrl?: GetProfileUrlCallback | typeof undefined;
    status?: FeedItemStatus | typeof undefined;
}

export const BaseCommentInfo = ({
    annotationActivityLink,
    created_at,
    created_by,
    getAvatarUrl,
    getUserProfileUrl,
}: BaseCommentInfoProps) => {
    const createdByUser = created_by || PLACEHOLDER_USER;
    const createdAtTimestamp = new Date(created_at).getTime();

    return (
        <div className="bcs-BaseCommentInfo">
            <div className="bcs-BaseCommentInfo-avatar">
                <Avatar
                    badgeIcon={
                        annotationActivityLink && (
                            <IconAnnotation
                                title={<FormattedMessage {...messages.inlineCommentAnnotationIconTitle} />}
                            />
                        )
                    }
                    getAvatarUrl={getAvatarUrl}
                    user={createdByUser}
                />
            </div>
            <div className="bcs-BaseCommentInfo-data">
                <div className="bcs-Comment-headline">
                    <UserLink
                        data-resin-target={ACTIVITY_TARGETS.PROFILE}
                        getUserProfileUrl={getUserProfileUrl}
                        id={createdByUser.id}
                        name={createdByUser.name}
                    />
                </div>
                <div className="bcs-BaseCommentInfo-data-timestamp">
                    <ActivityTimestamp date={createdAtTimestamp} />
                    {annotationActivityLink && (
                        <div className="bcs-BaseComment-AnnotationActivityLink">{annotationActivityLink}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

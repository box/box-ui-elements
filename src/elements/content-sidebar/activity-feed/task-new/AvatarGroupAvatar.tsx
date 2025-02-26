import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import camelCase from 'lodash/camelCase';
import IconComplete from '../../../../icons/general/IconVerified';
import IconReject from '../../../../icons/general/IconRejected';
import Avatar from '../Avatar';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';
import messages from './messages';
import type { TaskCollabStatus } from '../../../../common/types/tasks';
import type { UserMini } from '../../../../common/types/core';
import type { GetAvatarUrlCallback } from '../../../common/flowTypes';

import './AvatarGroupAvatar.scss';

interface AvatarGroupAvatarProps {
    className?: string;
    getAvatarUrl?: GetAvatarUrlCallback;
    status: TaskCollabStatus;
    user: UserMini;
}

interface IconProps {
    className?: string;
    title?: string | React.ReactElement;
}

interface StatusIconProps {
    status: TaskCollabStatus;
    className?: string;
    title?: string | React.ReactElement;
}

const StatusIcon = ({ status, className, title }: StatusIconProps): JSX.Element | null => {
    const iconProps: IconProps = { className, title };
    switch (status) {
        case TASK_NEW_APPROVED:
        case TASK_NEW_COMPLETED:
            return <IconComplete {...iconProps} />;
        case TASK_NEW_REJECTED:
            return <IconReject {...iconProps} />;
        case TASK_NEW_NOT_STARTED:
        default:
            return null;
    }
};

const AvatarGroupAvatar = React.memo<AvatarGroupAvatarProps>(
    ({ user, status, getAvatarUrl, className, ...rest }: AvatarGroupAvatarProps): JSX.Element => (
        <div
            className={classNames('bcs-AvatarGroupAvatar', className)}
            data-testid="avatar-group-avatar-container"
            {...rest}
        >
            <Avatar
                badgeIcon={
                    <StatusIcon
                        className={`${camelCase(status)}`}
                        status={status}
                        title={<FormattedMessage {...messages.taskAssignmentCompleted} />}
                    />
                }
                className="bcs-AvatarGroupAvatar-avatar"
                getAvatarUrl={getAvatarUrl}
                user={user}
            />
        </div>
    ),
);

export default AvatarGroupAvatar;

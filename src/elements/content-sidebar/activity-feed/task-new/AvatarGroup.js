// @flow strict
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import { Flyout, Overlay } from '../../../../components/flyout';
import Tooltip from '../../../../components/tooltip';
import PlainButton from '../../../../components/plain-button';
import ReadableTime from '../../../../components/time/ReadableTime';
import messages from '../../../common/messages';
import AvatarGroupAvatar from './AvatarGroupAvatar';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';
import type { TaskAssigneeCollection } from '../../../../common/types/tasks';
import type { ISODate } from '../../../../common/types/core';

import './AvatarGroup.scss';

const MAX_AVATARS = 3;

type Props = {|
    getAvatarUrl: GetAvatarUrlCallback,
    maxAvatars: number,
    users: TaskAssigneeCollection,
|} & InjectIntlProvidedProps;

const statusMessages = {
    [TASK_NEW_APPROVED]: messages.tasksFeedStatusApproved,
    [TASK_NEW_REJECTED]: messages.tasksFeedStatusRejected,
    [TASK_NEW_COMPLETED]: messages.tasksFeedStatusCompleted,
    [TASK_NEW_NOT_STARTED]: null,
};

const Datestamp = ({ date }: { date: ISODate | Date }) => {
    return <ReadableTime timestamp={new Date(date).getTime()} alwaysShowTime relativeThreshold={0} />;
};

const AvatarDetails = React.memo(({ user, status, completedAt, className }) => {
    const statusMessage = statusMessages[status] || null;
    return (
        <div className={className}>
            <div className="bcs-AvatarGroup-detailsName">{user.name}</div>
            {statusMessage && completedAt && (
                <div className="bcs-AvatarGroup-detailsStatus">
                    <FormattedMessage {...statusMessage} values={{ dateTime: <Datestamp date={completedAt} /> }} />
                </div>
            )}
        </div>
    );
});

class AvatarGroup extends React.Component<Props> {
    static defaultProps = {
        maxAvatars: MAX_AVATARS,
        users: {},
    };

    listTitleId = uniqueId('avatar-group-list-title-');

    render() {
        const { maxAvatars, users, getAvatarUrl, intl } = this.props;
        const { entries = [], next_marker } = users;
        const entryCount = entries.length;
        const hiddenAvatarCount = Math.max(0, entryCount - maxAvatars);
        const areThereMoreEntries = !!next_marker; // there are more entries in another page of results
        const visibleAvatars = entries.slice(0, maxAvatars).map(({ id, target, status, completed_at: completedAt }) => {
            return (
                <Tooltip
                    key={id}
                    text={
                        <AvatarDetails
                            className="bcs-AvatarGroup-tooltip"
                            user={target}
                            status={status}
                            completedAt={completedAt}
                        />
                    }
                >
                    <AvatarGroupAvatar status={status} user={target} getAvatarUrl={getAvatarUrl} />
                </Tooltip>
            );
        });
        const allUsers = entries.map(({ id, target, status, completed_at: completedAt }) => {
            return (
                <li key={id} className="bcs-AvatarGroup-listItem">
                    <AvatarGroupAvatar
                        status={status}
                        className="bcs-AvatarGroup-listItemAvatar"
                        user={target}
                        getAvatarUrl={getAvatarUrl}
                    />
                    <AvatarDetails
                        className="bcs-AvatarGroup-listItemDetails"
                        user={target}
                        status={status}
                        completedAt={completedAt}
                    />
                </li>
            );
        });
        return (
            <div className="bcs-AvatarGroup">
                {visibleAvatars}
                {hiddenAvatarCount > 0 && (
                    <Flyout position="top-left" shouldDefaultFocus>
                        <PlainButton type="button" className="bcs-AvatarGroup-overflowCountContainer">
                            <Tooltip text={intl.formatMessage(messages.tasksFeedMoreAssigneesLabel)}>
                                <span
                                    className="bcs-AvatarGroup-overflowCount bcs-AvatarGroup-avatar"
                                    data-testid="avatar-group-overflow-count"
                                >
                                    {areThereMoreEntries ? `${hiddenAvatarCount}+` : `+${hiddenAvatarCount}`}
                                </span>
                            </Tooltip>
                        </PlainButton>
                        <Overlay className="bcs-AvatarGroup-listFlyout">
                            <p className="bcs-AvatarGroup-listTitle" id={this.listTitleId}>
                                <FormattedMessage {...messages.tasksFeedAssigneeListTitle} />
                            </p>
                            <ul className="bcs-AvatarGroup-list" arial-labelledby={this.listTitleId}>
                                {allUsers}
                            </ul>
                        </Overlay>
                    </Flyout>
                )}
            </div>
        );
    }
}

export default injectIntl(AvatarGroup);

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
import AssigneeAvatar from './AssigneeAvatar';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';

import './AvatarGroup.scss';

const MAX_AVATARS = 3;

type Props = {|
    assignees: TaskAssigneeCollection,
    getAvatarUrl: GetAvatarUrlCallback,
    maxAvatars: number,
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
            <div className="bcs-avatar-group-details-name">{user.name}</div>
            {statusMessage && completedAt && (
                <div className="bcs-avatar-group-details-status">
                    <FormattedMessage {...statusMessage} values={{ dateTime: <Datestamp date={completedAt} /> }} />
                </div>
            )}
        </div>
    );
});

class AvatarGroup extends React.Component<Props> {
    static defaultProps = {
        maxAvatars: MAX_AVATARS,
    };

    listTitleId = `avatar-group-list-title-${uniqueId()}`;

    render() {
        const { maxAvatars, assignees = {}, getAvatarUrl, intl } = this.props;
        const { entries = [], next_marker } = assignees;
        const entryCount = entries.length;
        const hiddenAvatarCount = Math.max(0, entryCount - maxAvatars);
        const areThereMoreEntries = !!next_marker; // there are more entries in another page of results
        const visibleAvatars = entries.slice(0, maxAvatars).map(({ id, target, status, completed_at: completedAt }) => {
            return (
                <Tooltip
                    key={id}
                    text={
                        <AvatarDetails
                            className="bcs-avatar-group-tooltip"
                            user={target}
                            status={status}
                            completedAt={completedAt}
                        />
                    }
                >
                    <AssigneeAvatar status={status} user={target} getAvatarUrl={getAvatarUrl} />
                </Tooltip>
            );
        });
        const allAssignees = entries.map(({ id, target, status, completed_at: completedAt }) => {
            return (
                <li key={id} className="bcs-avatar-group-list-item">
                    <AssigneeAvatar
                        status={status}
                        className="bcs-avatar-group-list-item-avatar"
                        user={target}
                        getAvatarUrl={getAvatarUrl}
                    />
                    <AvatarDetails
                        className="bcs-avatar-group-list-item-details"
                        user={target}
                        status={status}
                        completedAt={completedAt}
                    />
                </li>
            );
        });
        return (
            <div className="bcs-avatar-group">
                {visibleAvatars}
                {hiddenAvatarCount > 0 && (
                    <Flyout position="top-left" shouldDefaultFocus>
                        <PlainButton type="button" className="bcs-avatar-group-overflow-count-container">
                            <Tooltip text={intl.formatMessage(messages.tasksFeedMoreAssigneesLabel)}>
                                <span
                                    className="bcs-avatar-group-overflow-count bcs-avatar-group-avatar"
                                    data-testid="task-assignment-overflow"
                                >
                                    {areThereMoreEntries ? `${hiddenAvatarCount}+` : `+${hiddenAvatarCount}`}
                                </span>
                            </Tooltip>
                        </PlainButton>
                        <Overlay className="bcs-avatar-group-list-flyout">
                            <p className="bcs-avatar-group-list-title" id={this.listTitleId}>
                                <FormattedMessage {...messages.tasksFeedAssigneeListTitle} />
                            </p>
                            <ul className="bcs-avatar-group-list" arial-labelledby={this.listTitleId}>
                                {allAssignees}
                            </ul>
                        </Overlay>
                    </Flyout>
                )}
            </div>
        );
    }
}

export default injectIntl(AvatarGroup);

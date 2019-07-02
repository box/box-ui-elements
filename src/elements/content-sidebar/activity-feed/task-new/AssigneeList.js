// @flow strict
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import ReadableTime from '../../../../components/time/ReadableTime';
import messages from '../../../common/messages';
import taskMessages from './messages';
import AvatarGroupAvatar from './AvatarGroupAvatar';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';
import type { TaskAssigneeCollection } from '../../../../common/types/tasks';
import type { ISODate } from '../../../../common/types/core';

import './AssigneeList.scss';

const DEFAULT_ASSIGNEES_SHOWN = 3;
const TASKS_PAGE_SIZE = 20; // service does not return the page size to the client at the moment

type Props = {|
    getAvatarUrl: GetAvatarUrlCallback,
    initialAssigneeCount: number,
    isOpen: boolean,
    onCollapse: Function,
    onExpand: Function,
    users: TaskAssigneeCollection,
|};

const statusMessages = {
    [TASK_NEW_APPROVED]: taskMessages.tasksFeedStatusApproved,
    [TASK_NEW_REJECTED]: taskMessages.tasksFeedStatusRejected,
    [TASK_NEW_COMPLETED]: taskMessages.tasksFeedStatusCompleted,
    [TASK_NEW_NOT_STARTED]: null,
};

const Datestamp = ({ date }: { date: ISODate | Date }) => {
    return <ReadableTime timestamp={new Date(date).getTime()} alwaysShowTime relativeThreshold={0} />;
};

const AvatarDetails = React.memo(({ user, status, completedAt, className }) => {
    const statusMessage = statusMessages[status] || null;
    return (
        <div className={className}>
            <div className="bcs-AssigneeList-detailsName">
                {user.name ? user.name : <FormattedMessage {...messages.priorCollaborator} />}
            </div>
            {statusMessage && completedAt && (
                <div className="bcs-AssigneeList-detailsStatus">
                    <FormattedMessage {...statusMessage} values={{ dateTime: <Datestamp date={completedAt} /> }} />
                </div>
            )}
        </div>
    );
});

function AssigneeList(props: Props) {
    const {
        initialAssigneeCount = DEFAULT_ASSIGNEES_SHOWN,
        users = {},
        getAvatarUrl,
        isOpen,
        onCollapse,
        onExpand,
    } = props;
    const { entries = [], next_marker } = users;
    const entryCount = entries.length;
    const numVisibleAssignees = isOpen ? entryCount : initialAssigneeCount;
    const visibleUsers = entries
        .slice(0, numVisibleAssignees)
        .map(({ id, target, status, completed_at: completedAt }) => {
            return (
                <li key={id} className="bcs-AssigneeList-listItem" data-testid="assignee-list-item">
                    <AvatarGroupAvatar
                        status={status}
                        className="bcs-AssigneeList-listItemAvatar"
                        user={target}
                        getAvatarUrl={getAvatarUrl}
                    />
                    <AvatarDetails
                        className="bcs-AssigneeList-listItemDetails"
                        user={target}
                        status={status}
                        completedAt={completedAt}
                    />
                </li>
            );
        });

    const hiddenAssigneeCount = Math.max(0, entryCount - initialAssigneeCount);
    const maxAdditionalAssignees = TASKS_PAGE_SIZE - initialAssigneeCount;
    const hasMoreAssigneesThanPageSize = hiddenAssigneeCount > maxAdditionalAssignees || next_marker;
    const additionalAssigneeMessage = hasMoreAssigneesThanPageSize
        ? taskMessages.taskShowMoreAssigneesOverflow
        : taskMessages.taskShowMoreAssignees;

    return (
        <div className="bcs-AssigneeList">
            <ul className="bcs-AssigneeList-list" data-testid="task-assignee-list">
                {visibleUsers}
            </ul>
            {!isOpen && hiddenAssigneeCount > 0 && (
                <div className="bcs-AssigneeList-toggleBtn">
                    <PlainButton
                        data-resin-target="showmorebtn"
                        data-testid="show-more-assignees"
                        onClick={onExpand}
                        className="lnk"
                    >
                        <FormattedMessage
                            {...additionalAssigneeMessage}
                            values={{
                                additionalAssigneeCount: hasMoreAssigneesThanPageSize
                                    ? maxAdditionalAssignees
                                    : hiddenAssigneeCount,
                            }}
                        />
                    </PlainButton>
                </div>
            )}
            {isOpen && (
                <div className="bcs-AssigneeList-toggleBtn">
                    <PlainButton
                        data-resin-target="showlessbtn"
                        data-testid="show-less-assignees"
                        onClick={onCollapse}
                        className="lnk"
                    >
                        <FormattedMessage {...taskMessages.taskShowLessAssignees} />
                    </PlainButton>
                </div>
            )}
        </div>
    );
}

export default AssigneeList;

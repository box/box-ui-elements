import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import messages from './messages';
import AvatarGroupAvatar from './AvatarGroupAvatar';
import AssigneeDetails from './AssigneeDetails';
import type { TaskAssigneeCollection } from '../../../../common/types/tasks';
import type { GetAvatarUrlCallback } from '../../../common/flowTypes';

import './AssigneeList.scss';

const DEFAULT_ASSIGNEES_SHOWN = 3;
const TASKS_PAGE_SIZE = 20; // service does not return the page size to the client at the moment

interface AssigneeListProps {
    getAvatarUrl: GetAvatarUrlCallback;
    initialAssigneeCount: number;
    isOpen: boolean;
    onCollapse: () => void | Promise<void>;
    onExpand: () => void | Promise<void>;
    users: TaskAssigneeCollection;
}

function AssigneeList(props: AssigneeListProps): JSX.Element {
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
                    <AssigneeDetails user={target} status={status} completedAt={completedAt} />
                </li>
            );
        });

    const hiddenAssigneeCount = Math.max(0, entryCount - initialAssigneeCount);
    const maxAdditionalAssignees = TASKS_PAGE_SIZE - initialAssigneeCount;
    const hasMoreAssigneesThanPageSize = hiddenAssigneeCount > maxAdditionalAssignees || next_marker;
    const additionalAssigneeMessage = hasMoreAssigneesThanPageSize
        ? messages.taskShowMoreAssigneesOverflow
        : messages.taskShowMoreAssignees;

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
                        <FormattedMessage {...messages.taskShowLessAssignees} />
                    </PlainButton>
                </div>
            )}
        </div>
    );
}

export default AssigneeList;

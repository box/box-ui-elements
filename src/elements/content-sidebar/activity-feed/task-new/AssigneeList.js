// @flow strict
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import PlainButton from '../../../../components/plain-button';
import ReadableTime from '../../../../components/time/ReadableTime';
import messages from '../../../common/messages';
import AvatarGroupAvatar from './AvatarGroupAvatar';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';

import './AssigneeList.scss';

const DEFAULT_ASSIGNEES_SHOWN = 3;
const TASKS_PAGE_SIZE = 20; // service does not return the page size to the client at the moment

type Props = {|
    getAvatarUrl: GetAvatarUrlCallback,
    initialAssigneeCount: number,
    onExpand: Function,
    users: TaskAssigneeCollection,
|} & InjectIntlProvidedProps;

type State = {
    isCollapsed: boolean,
};

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
            <div className="bcs-AssigneeList-detailsName">{user.name}</div>
            {statusMessage && completedAt && (
                <div className="bcs-AssigneeList-detailsStatus">
                    <FormattedMessage {...statusMessage} values={{ dateTime: <Datestamp date={completedAt} /> }} />
                </div>
            )}
        </div>
    );
});

class AssigneeList extends React.Component<Props, State> {
    state = {
        isCollapsed: true,
    };

    static defaultProps = {
        initialAssigneeCount: DEFAULT_ASSIGNEES_SHOWN,
        users: {},
    };

    listTitleId = uniqueId('assignee-list-title-');

    showLessAssignees = () => {
        this.setState({
            isCollapsed: true,
        });
    };

    showMoreAssignees = async () => {
        const { users, onExpand } = this.props;

        if (users.next_marker) {
            try {
                await onExpand();
            } catch (err) {
                // do nothing
            }
        }

        this.setState({
            isCollapsed: false,
        });
    };

    render() {
        const { initialAssigneeCount, users, getAvatarUrl } = this.props;
        const { isCollapsed } = this.state;
        const { entries = [], next_marker } = users;
        const entryCount = entries.length;
        const hiddenAssigneeCount = Math.max(0, entryCount - initialAssigneeCount);
        const numVisibleAssignees = isCollapsed ? initialAssigneeCount : entryCount;
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

        const maxAdditionalAssignees = TASKS_PAGE_SIZE - initialAssigneeCount;
        const hasMoreAssigneesThanPageSize = hiddenAssigneeCount > maxAdditionalAssignees || next_marker;
        const additionalAssigneeCount = hasMoreAssigneesThanPageSize
            ? `${maxAdditionalAssignees}+`
            : `${hiddenAssigneeCount}`;

        return (
            <div>
                <ul
                    className="bcs-AssigneeList-list"
                    data-testid="task-assignee-list"
                    arial-labelledby={this.listTitleId}
                >
                    {visibleUsers}
                </ul>
                {isCollapsed && hiddenAssigneeCount > 0 && (
                    <span>
                        <PlainButton
                            data-resin-target="showmorebtn"
                            data-testid="show-more-assignees"
                            onClick={this.showMoreAssignees}
                            className="lnk bcs-AssigneeList-expandBtn"
                        >
                            <FormattedMessage
                                {...messages.taskShowMoreAssignees}
                                values={{ additionalAssigneeCount }}
                            />
                        </PlainButton>
                    </span>
                )}
                {!isCollapsed && (
                    <span>
                        <PlainButton
                            data-resin-target="showlessbtn"
                            data-testid="show-less-assignees"
                            onClick={this.showLessAssignees}
                            className="lnk bcs-AssigneeList-expandBtn"
                        >
                            <FormattedMessage {...messages.taskShowLessAssignees} />
                        </PlainButton>
                    </span>
                )}
            </div>
        );
    }
}

export default injectIntl(AssigneeList);

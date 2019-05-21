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
import AssigneeStatus from './AssigneeStatus';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';

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

const AssignmentDetails = React.memo(({ user, status, completedAt, className }) => {
    const statusMessage = statusMessages[status] || null;
    return (
        <div className={className}>
            <div className="bcs-task-assignment-details-name">{user.name}</div>
            {statusMessage && completedAt && (
                <div className="bcs-task-assignment-details-status">
                    <FormattedMessage {...statusMessage} values={{ dateTime: <Datestamp date={completedAt} /> }} />
                </div>
            )}
        </div>
    );
});

/* eslint-disable react/prefer-stateless-function */
class Assignees extends React.Component<Props> {
    static defaultProps = {
        maxAvatars: MAX_AVATARS,
    };

    listTitleId = `task-assignment-list-title-${uniqueId()}`;

    render() {
        const { maxAvatars, assignees = {}, getAvatarUrl, intl } = this.props;
        const { entries = [], next_marker } = assignees;
        const assigneeCount = entries.length;
        const hiddenAssigneeCount = Math.max(0, assigneeCount - maxAvatars);
        const areThereMoreEntries = !!next_marker; // there are more assignees in another page of results
        const visibleAssignees = entries
            .slice(0, maxAvatars)
            .map(({ id, target, status, completed_at: completedAt }) => {
                return (
                    <Tooltip
                        key={id}
                        text={
                            <AssignmentDetails
                                className="bcs-task-assignment-tooltip"
                                user={target}
                                status={status}
                                completedAt={completedAt}
                            />
                        }
                    >
                        <AssigneeStatus status={status} user={target} getAvatarUrl={getAvatarUrl} />
                    </Tooltip>
                );
            });
        const allAssignees = entries.map(({ id, target, status, completed_at: completedAt }) => {
            return (
                <li key={id} className="bcs-task-assignment-list-item">
                    <AssigneeStatus
                        status={status}
                        className="bcs-task-assignment-list-item-avatar"
                        user={target}
                        getAvatarUrl={getAvatarUrl}
                    />
                    <AssignmentDetails
                        className="bcs-task-assignment-list-item-details"
                        user={target}
                        status={status}
                        completedAt={completedAt}
                    />
                </li>
            );
        });
        return (
            <div className="bcs-task-assignment-container">
                <div className="bcs-task-assignments">
                    {visibleAssignees}
                    {hiddenAssigneeCount > 0 && (
                        <Flyout position="top-left" shouldDefaultFocus>
                            <PlainButton type="button" className="bcs-task-assignment-count-container">
                                <Tooltip text={intl.formatMessage(messages.tasksFeedMoreAssigneesLabel)}>
                                    <span
                                        className="bcs-task-assignment-count bcs-task-assignment-avatar"
                                        data-testid="task-assignment-overflow"
                                    >
                                        {areThereMoreEntries ? `${hiddenAssigneeCount}+` : `+${hiddenAssigneeCount}`}
                                    </span>
                                </Tooltip>
                            </PlainButton>
                            <Overlay className="bcs-task-assignment-list-flyout">
                                <p className="bcs-task-assignment-list-title" id={this.listTitleId}>
                                    <FormattedMessage {...messages.tasksFeedAssigneeListTitle} />
                                </p>
                                <ul className="bcs-task-assignment-list" arial-labelledby={this.listTitleId}>
                                    {allAssignees}
                                </ul>
                            </Overlay>
                        </Flyout>
                    )}
                </div>
            </div>
        );
    }
}

export default injectIntl(Assignees);

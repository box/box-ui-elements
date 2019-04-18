// @flow strict
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import { Flyout, Overlay } from '../../../../components/flyout';
import Tooltip from '../../../../components/tooltip';
import PlainButton from '../../../../components/plain-button';
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
    [TASK_NEW_APPROVED]: <FormattedMessage {...messages.tasksFeedStatusAccepted} />,
    [TASK_NEW_REJECTED]: <FormattedMessage {...messages.tasksFeedStatusRejected} />,
    [TASK_NEW_COMPLETED]: <FormattedMessage {...messages.tasksFeedStatusCompleted} />,
    [TASK_NEW_NOT_STARTED]: <FormattedMessage {...messages.tasksFeedStatusNotStarted} />,
};

const AssigneeTooltipLabel = React.memo(({ user, status }) => {
    const statusMessage = statusMessages[status] || null;
    return (
        <div className="bcs-task-assignment-tooltip-text">
            <div>
                <strong>{user.name}</strong>
            </div>
            {statusMessage && <div>{statusMessage}</div>}
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
        const { entries = [], limit } = assignees;
        const assigneeCount = entries.length;
        const hiddenAssigneeCount = Math.max(0, assigneeCount - maxAvatars);
        const areThereMoreEntries = limit != null && assigneeCount >= limit; // there are more assignees in another page of results
        const visibleAssignees = entries
            .slice(0, maxAvatars)
            .map(({ id: assignmentId, target, status: assigneeStatus }) => {
                return (
                    <Tooltip key={assignmentId} text={<AssigneeTooltipLabel user={target} status={assigneeStatus} />}>
                        <AssigneeStatus
                            key={assignmentId}
                            status={assigneeStatus}
                            user={target}
                            getAvatarUrl={getAvatarUrl}
                            data-testid="task-assignment-status"
                        />
                    </Tooltip>
                );
            });
        const allAssignees = entries.map(({ id: assignmentId, target, status: assigneeStatus }) => {
            const statusMessage = statusMessages[assigneeStatus] || null;
            return (
                <li key={assignmentId} className="bcs-task-assignment-list-item">
                    <AssigneeStatus
                        status={assigneeStatus}
                        className="bcs-task-assignment-list-item-avatar"
                        user={target}
                        getAvatarUrl={getAvatarUrl}
                        data-testid="task-assignment-status"
                    />
                    <div className="bcs-task-assignment-list-item-details">
                        <div>{target.name}</div>
                        <div className="bcs-task-assignment-list-item-status">{statusMessage}</div>
                    </div>
                </li>
            );
        });
        return (
            <div className="bcs-task-assignment-container">
                <div className="bcs-task-assignments">
                    {visibleAssignees}
                    {hiddenAssigneeCount > 0 && (
                        <Flyout position="top-left" shouldDefaultFocus>
                            <PlainButton
                                type="button"
                                className="bcs-task-assignment-count-container"
                                data-testid="task-assignment-overflow"
                            >
                                <Tooltip text={intl.formatMessage(messages.tasksFeedMoreAssigneesLabel)}>
                                    <span className="bcs-task-assignment-count bcs-task-assignment-avatar">
                                        {areThereMoreEntries ? '+' : `+${hiddenAssigneeCount}`}
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

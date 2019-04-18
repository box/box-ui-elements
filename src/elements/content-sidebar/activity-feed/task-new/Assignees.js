// @flow strict
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import { Flyout, Overlay } from '../../../../components/flyout';
import Tooltip from '../../../../components/tooltip';
import messages from '../../../common/messages';
import AssigneeStatus from './AssigneeStatus';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';

const MAX_AVATARS = 3;

type Props = {|
    assignees: TaskAssigneeCollection,
    getAvatarUrl: GetAvatarUrlCallback,
    maxAvatars?: number,
    ...InjectIntlProvidedProps,
|};

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

class Assignees extends React.Component<Props> {
    state = {};

    render() {
        const { maxAvatars = MAX_AVATARS, assignees, getAvatarUrl, intl } = this.props;
        const assigneeCount = (assignees && assignees.entries.length) || 0;
        const hiddenAssigneeCount = assigneeCount - maxAvatars;
        const overflowLabel = `+${hiddenAssigneeCount}`;
        const visibleAssignees = assignees.entries
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
        const hiddenAssignees = assignees.entries.map(({ id: assignmentId, target, status: assigneeStatus }) => {
            const statusMessage = statusMessages[assigneeStatus] || null;
            return (
                <div key={assignmentId} className="bcs-task-assignment-list-item">
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
                </div>
            );
        });
        return (
            <div className="bcs-task-assignment-container">
                <div className="bcs-task-assignments">
                    {visibleAssignees}
                    {hiddenAssigneeCount > 0 && (
                        <Flyout position="top-left">
                            <span
                                className="bcs-task-assignment-count-container"
                                data-testid="task-assignment-overflow"
                            >
                                <Tooltip text={intl.formatMessage(messages.tasksFeedMoreAssigneesLabel)}>
                                    <span className="bcs-task-assignment-count bcs-task-assignment-avatar">
                                        {overflowLabel}
                                    </span>
                                </Tooltip>
                            </span>
                            <Overlay>
                                <div className="bcs-task-assignment-list">
                                    <h5 className="bcs-task-assignment-list-title">
                                        <FormattedMessage {...messages.tasksFeedAssigneeListTitle} />
                                    </h5>
                                    {hiddenAssignees}
                                </div>
                            </Overlay>
                        </Flyout>
                    )}
                </div>
            </div>
        );
    }
}

export default injectIntl(Assignees);

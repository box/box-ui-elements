/**
 * @flow
 * @file Component for in-modal error messages for tasks
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';

import messages from './messages';
import apiMessages from '../../../../api/messages';
import { TASK_EDIT_MODE_EDIT } from '../../../../constants';
import InlineNotice from '../../../../components/inline-notice/InlineNotice';

import type { TaskType, TaskEditMode } from '../../../../common/types/tasks';

type Props = {
    editMode?: TaskEditMode,
    /* needs to include status and message */
    error?: { status: number },
    taskType: TaskType,
};
const TaskError = ({ editMode, error, taskType }: Props) => {
    const isEditMode = editMode === TASK_EDIT_MODE_EDIT;
    const isForbiddenErrorOnEdit = getProp(error, 'status') === 403 && isEditMode;
    // TODO: update to ElementXhrError once API supports it
    const taskGroupExceedsError = getProp(error, 'code') === 'group_exceeds_limit';

    const errorTitle = isForbiddenErrorOnEdit ? messages.taskEditWarningTitle : messages.taskCreateErrorTitle;
    let errorMessage = isEditMode ? messages.taskUpdateErrorMessage : apiMessages.taskCreateErrorMessage;
    if (!error) {
        return null;
    }

    // error message changes when a forbidden operation occurs while editing a task
    if (isForbiddenErrorOnEdit) {
        switch (taskType) {
            case 'GENERAL':
                errorMessage = messages.taskGeneralAssigneeRemovalWarningMessage;
                break;
            case 'APPROVAL':
                errorMessage = messages.taskApprovalAssigneeRemovalWarningMessage;
                break;
            default:
                return null;
        }
    }

    return (
        <div>
            {taskGroupExceedsError ? (
                <InlineNotice
                    type="warning"
                    title={<FormattedMessage {...messages.taskGroupExceedsLimitWarningTitle} />}
                >
                    <FormattedMessage {...apiMessages.taskGroupExceedsLimitWarningMessage} />
                </InlineNotice>
            ) : null}

            {isForbiddenErrorOnEdit ? (
                <InlineNotice type="error" title={<FormattedMessage {...errorTitle} />}>
                    <FormattedMessage {...errorMessage} />
                </InlineNotice>
            ) : null}
        </div>
    );
};

export default TaskError;

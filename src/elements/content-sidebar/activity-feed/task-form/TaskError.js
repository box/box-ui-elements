/**
 * @flow
 * @file Component for in-modal error messages for tasks
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';

import messages from './messages';
import apiMessages from '../../../../api/messages';
import { TASK_EDIT_MODE_EDIT, TASK_MAX_GROUP_ASSIGNEES, ERROR_CODE_GROUP_EXCEEDS_LIMIT } from '../../../../constants';
import InlineNotice from '../../../../components/inline-notice/InlineNotice';

import type { TaskType, TaskEditMode } from '../../../../common/types/tasks';

type Props = {
    editMode?: TaskEditMode,
    error?: { status: number }, // TODO: update to ElementXhrError once API supports it
    taskType: TaskType,
};
const TaskError = ({ editMode, error, taskType }: Props) => {
    const isEditMode = editMode === TASK_EDIT_MODE_EDIT;
    const isForbiddenErrorOnEdit = getProp(error, 'status') === 403 && isEditMode;
    const taskGroupExceedsError = getProp(error, 'code') === ERROR_CODE_GROUP_EXCEEDS_LIMIT;

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

    return taskGroupExceedsError ? (
        <InlineNotice type="warning" title={<FormattedMessage {...messages.taskGroupExceedsLimitWarningTitle} />}>
            <FormattedMessage
                {...apiMessages.taskGroupExceedsLimitWarningMessage}
                values={{ max: TASK_MAX_GROUP_ASSIGNEES }}
            />
        </InlineNotice>
    ) : (
        <InlineNotice type="error" title={<FormattedMessage {...errorTitle} />}>
            <FormattedMessage {...errorMessage} />
        </InlineNotice>
    );
};

export default TaskError;

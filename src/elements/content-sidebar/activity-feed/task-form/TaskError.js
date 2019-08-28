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
    error?: { status: number },
    taskType: TaskType,
};

const TaskError = ({ editMode, error, taskType }: Props) => {
    const isEditMode = editMode === TASK_EDIT_MODE_EDIT;
    const isForbiddenErrorOnEdit = getProp(error, 'status') === 403 && isEditMode;
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
        <InlineNotice type="error" title={<FormattedMessage {...errorTitle} />}>
            <FormattedMessage {...errorMessage} />
        </InlineNotice>
    );
};

export default TaskError;

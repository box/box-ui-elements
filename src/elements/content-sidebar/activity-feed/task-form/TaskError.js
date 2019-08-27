/**
 * @flow
 * @file Component for in-modal error messages for tasks
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';

import messages from './messages';
import apiMessages from '../../../../api/messages';
import { TASK_EDIT_MODE_EDIT } from '../../../../constants';
import InlineError from '../../../../components/inline-error/InlineError';

import type { TaskType, TaskEditMode } from '../../../../common/types/tasks';

type Props = {
    editMode?: TaskEditMode,
    error?: { status: number },
    taskType: TaskType,
};

function TaskError(props: Props) {
    const { editMode, error, taskType } = props;
    const isEditMode = editMode === TASK_EDIT_MODE_EDIT;
    const isForbiddenErrorOnEdit = get(error, 'status') === 403 && isEditMode;
    const errorTitle = isForbiddenErrorOnEdit ? messages.taskEditWarningTitle : messages.taskCreateErrorTitle;
    let errorMessage = isEditMode ? messages.taskUpdateErrorMessage : apiMessages.taskCreateErrorMessage;

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
    if (!error) {
        return null;
    }

    return (
        <InlineError title={<FormattedMessage {...errorTitle} />}>
            <FormattedMessage {...errorMessage} />
        </InlineError>
    );
}

export default TaskError;

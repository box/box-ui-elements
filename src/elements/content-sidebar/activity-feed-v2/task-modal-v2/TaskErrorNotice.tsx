import * as React from 'react';
import { useIntl } from 'react-intl';

import { InlineNotice } from '@box/blueprint-web';

import { ERROR_CODE_GROUP_EXCEEDS_LIMIT, TASK_MAX_GROUP_ASSIGNEES, TASK_TYPE_GENERAL } from '../../../../constants';

import type { ElementsXhrError } from '../../../../common/types/api';
import type { TaskType } from '../../../../common/types/tasks';

import messages from './messages';

export type TaskErrorNoticeProps = {
    error: ElementsXhrError | undefined;
    isEditMode: boolean;
    taskType: TaskType;
};

const getErrorStatus = (error: ElementsXhrError): number | undefined => {
    if ('status' in error && typeof error.status === 'number') {
        return error.status;
    }
    const { response } = error as { response?: { status?: number } };
    return response?.status;
};

const getErrorCode = (error: ElementsXhrError): string | undefined => {
    if ('code' in error && typeof error.code === 'string') {
        return error.code;
    }
    const { response } = error as { response?: { data?: { code?: string } } };
    return response?.data?.code;
};

const TaskErrorNotice = ({ error, isEditMode, taskType }: TaskErrorNoticeProps) => {
    const { formatMessage } = useIntl();

    if (!error) {
        return null;
    }

    const status = getErrorStatus(error);
    const code = getErrorCode(error);
    const isForbiddenEdit = isEditMode && status === 403;
    const isGroupLimit = code === ERROR_CODE_GROUP_EXCEEDS_LIMIT;

    if (isForbiddenEdit) {
        const forbiddenMessage =
            taskType === TASK_TYPE_GENERAL
                ? messages.editGeneralTaskForbiddenMessage
                : messages.editApprovalTaskForbiddenMessage;
        return (
            <InlineNotice
                title={formatMessage(messages.editForbiddenTitle)}
                variant="warning"
                variantIconAriaLabel={formatMessage(messages.inlineNoticeWarningAriaLabel)}
            >
                {formatMessage(forbiddenMessage)}
            </InlineNotice>
        );
    }

    if (isGroupLimit) {
        return (
            <InlineNotice
                title={formatMessage(messages.groupExceedsLimitWarningTitle)}
                variant="warning"
                variantIconAriaLabel={formatMessage(messages.inlineNoticeWarningAriaLabel)}
            >
                {formatMessage(messages.groupExceedsLimitWarningMessage, { max: TASK_MAX_GROUP_ASSIGNEES })}
            </InlineNotice>
        );
    }

    return (
        <InlineNotice
            title={formatMessage(messages.taskErrorTitle)}
            variant="error"
            variantIconAriaLabel={formatMessage(messages.inlineNoticeErrorAriaLabel)}
        >
            {formatMessage(isEditMode ? messages.updateTaskErrorMessage : messages.createTaskErrorMessage)}
        </InlineNotice>
    );
};

export default TaskErrorNotice;

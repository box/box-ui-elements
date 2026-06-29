import * as React from 'react';
import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import { Modal } from '@box/blueprint-web';

import { TASK_EDIT_MODE_CREATE, TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../../constants';

import type { TaskEditMode, TaskType } from '../../../../common/types/tasks';

import messages from './messages';

import './TaskModalV2.scss';

export type TaskModalV2Props = {
    editMode?: TaskEditMode;
    isOpen: boolean;
    onClose: () => void;
    taskType: TaskType;
};

const getTitleMessage = (taskType: TaskType, editMode: TaskEditMode): MessageDescriptor => {
    const isCreate = editMode === TASK_EDIT_MODE_CREATE;
    if (taskType === TASK_TYPE_GENERAL) {
        return isCreate ? messages.createGeneralTaskTitle : messages.editGeneralTaskTitle;
    }
    return isCreate ? messages.createApprovalTaskTitle : messages.editApprovalTaskTitle;
};

const TaskModalV2 = ({
    editMode = TASK_EDIT_MODE_CREATE,
    isOpen,
    onClose,
    taskType = TASK_TYPE_APPROVAL,
}: TaskModalV2Props) => {
    const { formatMessage } = useIntl();
    const titleMessage = getTitleMessage(taskType, editMode);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Modal open={isOpen} onOpenChange={handleOpenChange}>
            <Modal.Content className="bcs-NewTaskModal" data-testid="task-modal-v2" size="medium">
                <Modal.Header>{formatMessage(titleMessage)}</Modal.Header>
                <Modal.Body>
                    <div>Form goes here</div>
                </Modal.Body>
                <Modal.Close aria-label={formatMessage(messages.closeLabel)} />
            </Modal.Content>
        </Modal>
    );
};

export default TaskModalV2;

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    closeLabel: {
        id: 'be.taskModalV2.close',
        defaultMessage: 'Close',
        description: 'aria-label for the task modal close button',
    },
    createApprovalTaskTitle: {
        id: 'be.taskModalV2.createApprovalTask',
        defaultMessage: 'Create Approval Task',
        description: 'Title of the modal for creating an approval task',
    },
    createGeneralTaskTitle: {
        id: 'be.taskModalV2.createGeneralTask',
        defaultMessage: 'Create General Task',
        description: 'Title of the modal for creating a general task',
    },
    editApprovalTaskTitle: {
        id: 'be.taskModalV2.editApprovalTask',
        defaultMessage: 'Modify Approval Task',
        description: 'Title of the modal for editing an existing approval task',
    },
    editGeneralTaskTitle: {
        id: 'be.taskModalV2.editGeneralTask',
        defaultMessage: 'Modify General Task',
        description: 'Title of the modal for editing an existing general task',
    },
});

export default messages;

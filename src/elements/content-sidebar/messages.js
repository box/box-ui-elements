/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    boxSignFtuxBody: {
        id: 'be.contentSidebar.boxSignFtuxBody',
        defaultMessage: 'Sign documents or send signature requests, right from where your content lives',
        description: 'body for first-time user experience tooltip shown to new users of Box Sign',
    },
    boxSignFtuxTitle: {
        id: 'be.contentSidebar.boxSignFtuxTitle',
        defaultMessage: 'Box Sign - Secure, seamless e-signatures in Box',
        description: 'title for first-time user experience tooltip shown to new users of Box Sign',
    },
    boxSignRequest: {
        id: 'be.contentSidebar.boxSignRequest',
        defaultMessage: 'Request Signature',
        description: 'label for button that opens a Box Sign signature request experience',
    },
    boxSignSignature: {
        id: 'be.contentSidebar.boxSignSignature',
        defaultMessage: 'Sign',
        description: 'label for button that opens a Box Sign signature fulfillment experience',
    },
    tasksAddTask: {
        id: 'be.contentSidebar.addTask',
        defaultMessage: 'Add Task',
        description: 'label for button that opens task popup',
    },
    taskAddTaskGeneral: {
        id: 'be.contentSidebar.addTask.general',
        defaultMessage: 'General Task',
        description: 'label for menu item that opens general task popup',
    },
    taskAddTaskGeneralDescription: {
        id: 'be.contentSidebar.addTask.general.description',
        defaultMessage: 'Assignees will be responsible for marking tasks as complete',
        description: 'description for menu item that opens general task popup',
    },
    taskAddTaskApproval: {
        id: 'be.contentSidebar.addTask.approval',
        defaultMessage: 'Approval Task',
        description: 'label for menu item that opens approval task popup',
    },
    taskAddTaskApprovalDescription: {
        id: 'be.contentSidebar.addTask.approval.description',
        defaultMessage: 'Assignees will be responsible for approving or rejecting tasks',
        description: 'description for menu item that opens approval task popup',
    },
    tasksCreateGeneralTaskFormTitle: {
        id: 'be.contentSidebar.addTask.general.title',
        defaultMessage: 'Create General Task',
        description: 'title for general task popup',
    },
    tasksCreateApprovalTaskFormTitle: {
        id: 'be.contentSidebar.addTask.approval.title',
        defaultMessage: 'Create Approval Task',
        description: 'title for approval task popup',
    },
    tasksEditApprovalTaskFormTitle: {
        id: 'be.contentSidebar.editTask.approval.title',
        defaultMessage: 'Modify Approval Task',
        description: 'title for when editing an existing approval task',
    },
    tasksEditGeneralTaskFormTitle: {
        id: 'be.contentSidebar.editTask.general.title',
        defaultMessage: 'Modify General Task',
        description: 'modal title for when editing an existing general task',
    },
});

export default messages;

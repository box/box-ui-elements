/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    activitySidebarFilterOptionAllActivity: {
        id: 'be.activitySidebarFilter.status.allActivity',
        defaultMessage: 'All Activity',
        description: 'Dropdown option for filtering all activity from activity list',
    },
    activitySidebarFilterOptionAllComments: {
        id: 'be.activitySidebarFilter.status.allComments',
        defaultMessage: 'All Comments',
        description: 'Dropdown option for filtering all comments from comments list',
    },
    activitySidebarFilterOptionOpen: {
        id: 'be.activitySidebarFilter.status.open',
        defaultMessage: 'Unresolved Comments',
        description: 'Dropdown option for filtering unresolved comments from activity or comments list',
    },
    activitySidebarFilterOptionResolved: {
        id: 'be.activitySidebarFilter.status.resolved',
        defaultMessage: 'Resolved Comments',
        description: 'Dropdown option for filtering resolved comments from activity or comments list',
    },
    activitySidebarFilterOptionTasks: {
        id: 'be.activitySidebarFilter.status.tasks',
        defaultMessage: 'Tasks',
        description: 'Dropdown option for filtering tasks from activity list',
    },
    boxAISidebarClear: {
        id: 'be.contentSidebar.boxAI.clear',
        description: 'Default message for Box AI clear button in sidebar header',
        defaultMessage: 'Clear',
    },
    boxAISidebarClearConversationTooltip: {
        id: 'be.contentSidebar.boxAI.clearConversationTooltip',
        description: 'Tooltip text for clear button for Box AI in sidebar header',
        defaultMessage: 'Clear conversation',
    },
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
    boxSignRequestSignature: {
        id: 'be.contentSidebar.boxSignRequestSignature',
        defaultMessage: 'Request Signature',
        description: 'One of the dropdown options that opens a Box Sign request signature experience',
    },
    boxSignSignMyself: {
        id: 'be.contentSidebar.boxSignSignMyself',
        defaultMessage: 'Sign Myself',
        description: 'One of the dropdown options that opens a Box Sign sign myself experience',
    },
    boxSignSignature: {
        id: 'be.contentSidebar.boxSignSignature',
        defaultMessage: 'Sign',
        description: 'label for button that opens a Box Sign signature fulfillment experience',
    },
    boxSignSecurityBlockedTooltip: {
        defaultMessage: 'This action is unavailable due to a security policy.',
        description: 'Tooltip text for when Box Sign is blocked due to a security policy',
        id: 'be.contentSidebar.boxSignSecurityBlockedTooltip',
    },
    boxSignWatermarkBlockedTooltip: {
        defaultMessage: 'This action is unavailable, because the file is watermarked.',
        description: 'Tooltip text for when Box Sign is blocked due to an item being watermarked',
        id: 'be.contentSidebar.boxSignWatermarkBlockedTooltip',
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

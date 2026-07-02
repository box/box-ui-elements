import type { Meta, StoryObj } from '@storybook/react';

import { InteractiveTaskModal, mockEditingAssignees, mockEditingTask } from './__mocks__/TaskModalV2Mocks';

import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../constants';

const meta: Meta<typeof InteractiveTaskModal> = {
    title: 'Elements/ContentSidebar/TaskModalV2',
    component: InteractiveTaskModal,
    parameters: {
        // Modal portals to document.body, so inline docs previews would stack every story's open dialog
        docs: { story: { iframeHeight: 640, inline: false } },
    },
};

export default meta;

export const CreateGeneralTask: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        taskType: TASK_TYPE_GENERAL,
    },
};

export const CreateApprovalTask: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        taskType: TASK_TYPE_APPROVAL,
    },
};

export const EditApprovalTask: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        editingAssignees: mockEditingAssignees,
        editingTask: mockEditingTask,
        taskType: TASK_TYPE_APPROVAL,
    },
};

export const SubmitError: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        shouldFailSubmit: true,
        taskType: TASK_TYPE_APPROVAL,
    },
};

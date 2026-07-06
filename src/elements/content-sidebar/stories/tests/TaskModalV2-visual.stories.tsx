import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from 'storybook/test';

import { InteractiveTaskModal } from '../__mocks__/TaskModalV2Mocks';

import { TASK_TYPE_APPROVAL } from '../../../../constants';

const meta: Meta<typeof InteractiveTaskModal> = {
    title: 'Elements/ContentSidebar/TaskModalV2/tests/visual-regression-tests',
    component: InteractiveTaskModal,
    parameters: {
        docs: { story: { iframeHeight: 640, inline: false } },
    },
};

export default meta;

const findAssigneeCombobox = async () => screen.findByRole('combobox', { name: 'Select Assignees' });

export const CreateApprovalTaskTabOrder: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        taskType: TASK_TYPE_APPROVAL,
    },
    play: async () => {
        await screen.findByRole('dialog', { name: 'Create Approval Task' });

        const combobox = await findAssigneeCombobox();
        combobox.focus();
        expect(combobox).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('textbox', { name: /message/i })).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('spinbutton', { name: /month/i })).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('spinbutton', { name: /day/i })).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('spinbutton', { name: /year/i })).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('button', { name: /open due date calendar/i })).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('button', { name: 'Create' })).toHaveFocus();
    },
};

export const AssigneeListboxAccessibleNames: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        taskType: TASK_TYPE_APPROVAL,
    },
    play: async () => {
        await screen.findByRole('dialog', { name: 'Create Approval Task' });

        const combobox = await findAssigneeCombobox();
        await userEvent.type(combobox, 'team');

        const listbox = await screen.findByRole('listbox');
        expect(listbox).toBeVisible();

        const designOption = await screen.findByRole('option', { name: /Design Team/ });
        const engineeringOption = await screen.findByRole('option', { name: /Engineering Team/ });
        expect(designOption).toBeVisible();
        expect(engineeringOption).toBeVisible();
    },
};

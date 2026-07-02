import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor } from 'storybook/test';

import { InteractiveTaskModal, mockEditingAssignees, mockEditingTask } from '../__mocks__/TaskModalV2Mocks';

import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../../constants';

const meta: Meta<typeof InteractiveTaskModal> = {
    title: 'Elements/ContentSidebar/TaskModalV2/tests/visual-regression-tests',
    component: InteractiveTaskModal,
    parameters: {
        docs: { story: { iframeHeight: 640, inline: false } },
    },
};

export default meta;

const findAssigneeCombobox = async () => screen.findByRole('combobox', { name: 'Select Assignees' });

export const CreateGeneralTaskAccessibleStructure: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        taskType: TASK_TYPE_GENERAL,
    },
    play: async () => {
        const dialog = await screen.findByRole('dialog', { name: 'Create General Task' });
        expect(dialog).toBeVisible();

        const combobox = await findAssigneeCombobox();
        expect(combobox).toBeVisible();
        expect(await screen.findByRole('textbox', { name: /message/i })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Create' })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Close' })).toBeVisible();

        // Completion rule only appears once an assignee is selected
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    },
};

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

export const CompletionRuleShownAfterSelection: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        taskType: TASK_TYPE_APPROVAL,
    },
    play: async () => {
        await screen.findByRole('dialog', { name: 'Create Approval Task' });

        const combobox = await findAssigneeCombobox();
        await userEvent.type(combobox, 'Alice');
        const aliceOption = await screen.findByRole('option', { name: /Alice Wong/ });
        await userEvent.click(aliceOption);

        // A single user assignee shows the completion rule disabled; adding a group enables it
        const checkbox = await screen.findByRole('checkbox', {
            name: 'Only one assignee is required to complete this task',
        });
        expect(checkbox).toBeVisible();
        expect(checkbox).toBeDisabled();

        await userEvent.type(combobox, 'Engineering');
        const groupOption = await screen.findByRole('option', { name: /Engineering Team/ });
        await userEvent.click(groupOption);

        await waitFor(() =>
            expect(
                screen.getByRole('checkbox', { name: 'Only one assignee is required to complete this task' }),
            ).toBeEnabled(),
        );
    },
};

export const EditApprovalTaskPrefill: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        editingAssignees: mockEditingAssignees,
        editingTask: mockEditingTask,
        taskType: TASK_TYPE_APPROVAL,
    },
    play: async () => {
        const dialog = await screen.findByRole('dialog', { name: 'Modify Approval Task' });
        expect(dialog).toBeVisible();

        expect(await screen.findByRole('textbox', { name: /message/i })).toHaveValue(
            'Review the updated launch checklist',
        );
        expect(screen.getAllByText('Alice Wong')[0]).toBeVisible();
        expect(screen.getAllByText('Engineering Team')[0]).toBeVisible();

        expect(screen.getByRole('spinbutton', { name: /month/i })).toHaveAttribute('aria-valuenow', '7');
        expect(screen.getByRole('spinbutton', { name: /day/i })).toHaveAttribute('aria-valuenow', '15');
        expect(screen.getByRole('spinbutton', { name: /year/i })).toHaveAttribute('aria-valuenow', '2026');

        const completionRuleCheckbox = screen.getByRole('checkbox', {
            name: 'Only one assignee is required to complete this task',
        });
        expect(completionRuleCheckbox).toBeEnabled();
        expect(completionRuleCheckbox).not.toBeChecked();

        expect(screen.getByRole('button', { name: 'Update' })).toBeVisible();
    },
};

export const EditGeneralTaskPrefill: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        editingAssignees: mockEditingAssignees,
        editingTask: { ...mockEditingTask, task_type: TASK_TYPE_GENERAL },
        taskType: TASK_TYPE_GENERAL,
    },
    play: async () => {
        const dialog = await screen.findByRole('dialog', { name: 'Modify General Task' });
        expect(dialog).toBeVisible();

        expect(await screen.findByRole('textbox', { name: /message/i })).toHaveValue(
            'Review the updated launch checklist',
        );
        expect(screen.getByRole('button', { name: 'Update' })).toBeVisible();
    },
};

export const RequiredFieldValidationErrors: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        taskType: TASK_TYPE_APPROVAL,
    },
    play: async () => {
        await screen.findByRole('dialog', { name: 'Create Approval Task' });
        await findAssigneeCombobox();

        await userEvent.click(screen.getByRole('button', { name: 'Create' }));

        // Both the assignee and message fields are required
        const requiredFieldErrors = await screen.findAllByText('Required Field');
        expect(requiredFieldErrors.length).toBeGreaterThanOrEqual(2);
        expect(screen.getByRole('textbox', { name: /message/i })).toBeInvalid();
        expect(await findAssigneeCombobox()).toBeInvalid();

        // The modal stays open so the user can correct the form
        expect(screen.getByRole('dialog', { name: 'Create Approval Task' })).toBeVisible();
    },
};

export const SubmitErrorNotice: StoryObj<typeof InteractiveTaskModal> = {
    args: {
        shouldFailSubmit: true,
        taskType: TASK_TYPE_APPROVAL,
    },
    play: async () => {
        await screen.findByRole('dialog', { name: 'Create Approval Task' });

        const combobox = await findAssigneeCombobox();
        await userEvent.type(combobox, 'Alice');
        const aliceOption = await screen.findByRole('option', { name: /Alice Wong/ });
        await userEvent.click(aliceOption);

        await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Please review');
        await userEvent.click(screen.getByRole('button', { name: 'Create' }));

        expect(await screen.findByText('An error occurred while creating this task. Please try again.')).toBeVisible();
    },
};

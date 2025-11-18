import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { AddTaskButtonV2Component } from '../AddTaskButtonV2';
import type { TaskFormProps } from '../activity-feed/task-form/TaskForm';

const defaultTaskFormProps: TaskFormProps = {
    id: 'task_123',
    createTask: action('createTask'),
    editTask: action('editTask'),
    onSubmitSuccess: action('onSubmitSuccess'),
    onSubmitError: action('onSubmitError'),
};

const meta: Meta<typeof AddTaskButtonV2Component> = {
    title: 'Elements/ContentSidebar/AddTaskButtonV2',
    component: AddTaskButtonV2Component,
    parameters: {
        docs: {
            description: {
                component:
                    'A functional/hooks-based button component for adding new tasks (approval or general) in the sidebar. This is the TypeScript version of AddTaskButton.',
            },
        },
    },
    argTypes: {
        isDisabled: {
            control: { type: 'boolean' },
            description: 'Whether the add task button is disabled',
        },
        onTaskModalClose: {
            action: 'onTaskModalClose',
            description: 'Callback when the task modal is closed',
        },
        taskFormProps: {
            control: { type: 'object' },
            description: 'Props to pass to the task form component',
        },
        routerDisabled: {
            control: { type: 'boolean' },
            description: 'Whether router navigation is disabled',
        },
        internalSidebarNavigation: {
            control: { type: 'object' },
            description: 'Internal navigation state for the sidebar',
        },
        internalSidebarNavigationHandler: {
            action: 'internalSidebarNavigationHandler',
            description: 'Handler for internal sidebar navigation',
        },
    },
    decorators: [
        Story => (
            <MemoryRouter>
                <div style={{ width: '600px', marginLeft: '300px' }}>
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof AddTaskButtonV2Component>;

export const Basic: Story = {
    args: {
        isDisabled: false,
        onTaskModalClose: action('onTaskModalClose'),
        taskFormProps: defaultTaskFormProps,
    },
};

export const Disabled: Story = {
    args: {
        isDisabled: true,
        onTaskModalClose: action('onTaskModalClose'),
        taskFormProps: defaultTaskFormProps,
    },
};

export const WithInternalNavigation: Story = {
    args: {
        isDisabled: false,
        onTaskModalClose: action('onTaskModalClose'),
        taskFormProps: defaultTaskFormProps,
        routerDisabled: true,
        internalSidebarNavigation: {
            open: true,
            tab: 'activity',
        },
        internalSidebarNavigationHandler: action('internalSidebarNavigationHandler'),
    },
};

export const Interactive: Story = {
    args: {
        isDisabled: false,
        onTaskModalClose: action('onTaskModalClose'),
        taskFormProps: defaultTaskFormProps,
    },
    parameters: {
        docs: {
            description: {
                story: 'This story allows you to interact with the component and see how it opens the task modal.',
            },
        },
    },
};

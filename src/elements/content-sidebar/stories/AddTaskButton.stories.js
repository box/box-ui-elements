// @flow
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { action } from 'storybook/actions';

import { AddTaskButtonComponent } from '../AddTaskButton';

const defaultTaskFormProps = {
    id: 'task_123',
    createTask: action('createTask'),
    editTask: action('editTask'),
    onSubmitSuccess: action('onSubmitSuccess'),
    onSubmitError: action('onSubmitError'),
};

const Template = args => (
    <MemoryRouter>
        <AddTaskButtonComponent {...args} />
    </MemoryRouter>
);

export const Basic = Template.bind({});
Basic.args = {
    isDisabled: false,
    onTaskModalClose: action('onTaskModalClose'),
    taskFormProps: defaultTaskFormProps,
};

export const Disabled = Template.bind({});
Disabled.args = {
    isDisabled: true,
    onTaskModalClose: action('onTaskModalClose'),
    taskFormProps: defaultTaskFormProps,
};

export const WithInternalNavigation = Template.bind({});
WithInternalNavigation.args = {
    isDisabled: false,
    onTaskModalClose: action('onTaskModalClose'),
    taskFormProps: defaultTaskFormProps,
    routerDisabled: true,
    internalSidebarNavigation: {
        open: true,
        tab: 'activity',
    },
    internalSidebarNavigationHandler: action('internalSidebarNavigationHandler'),
};

export default {
    title: 'Elements/ContentSidebar/AddTaskButton',
    component: AddTaskButtonComponent,
    parameters: {
        docs: {
            description: {
                component: 'A button component for adding new tasks (approval or general) in the sidebar.',
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
};

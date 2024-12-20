import * as React from 'react';
import { mount } from 'enzyme';
import { IntlShape } from 'react-intl';
import { TASK_EDIT_MODE_EDIT } from '../../../../../constants';
import FeatureProvider from '../../../../common/feature-checking/FeatureProvider';
import { TaskFormUnwrapped as TaskForm } from '..';
import commonMessages from '../../../../../common/messages';
import { TaskCollabAssignee, TaskCompletionRule, TaskUpdatePayload } from '../../../../../common/types/tasks';
import { ElementsXhrError } from '../../../../../common/types/api';
import { UserMini, GroupMini } from '../../../../../common/types/core';

jest.mock('../../Avatar', () => () => 'Avatar');

interface DatePickerProps {
    name?: string;
    value?: string;
    className?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    inputProps?: Record<string, unknown>;
}

jest.mock('../../../../../components/date-picker/DatePicker', () => (props: DatePickerProps) => {
    const { name, value = '', className, onChange, placeholder, inputProps = {} } = props;
    return React.createElement('input', {
        type: 'date',
        name,
        value,
        className,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value),
        placeholder,
        ...inputProps,
    });
});

const mockIntl: IntlShape = {
    formatMessage: (message: { defaultMessage: string }) => message.defaultMessage,
} as IntlShape;

interface RenderProps {
    approverSelectorContacts?: Array<{
        id: string | number;
        item: { id: string | number; name: string };
        name: string;
    }>;
    approvers?: Array<{
        id: string;
        target: {
            id: string | number;
            name: string;
            type: string;
        };
        role: string;
        type: string;
        status: string;
        permissions: {
            can_delete: boolean;
            can_update: boolean;
        };
    }>;
    createTask?: (
        text: string,
        assignees: Array<TaskCollabAssignee>,
        dueDate: string | null,
        completionRule: TaskCompletionRule,
        onSuccess: () => void,
        onError: (e: ElementsXhrError) => void,
    ) => void;
    editMode?: string;
    editTask?: (task: TaskUpdatePayload, onSuccess: () => void, onError: (e: ElementsXhrError) => void) => void;
    getApproverWithQuery?: (query: string) => Promise<Array<UserMini | GroupMini>>;
    id?: string;
    onCancel?: () => void;
    activityFeed?: {
        tasks?: {
            assignToGroup?: boolean;
        };
    };
}

const render = (props: RenderProps) =>
    mount<typeof TaskForm>(
        <TaskForm
            getMentionWithQuery={() => Promise.resolve([])}
            intl={mockIntl}
            user={{ id: 123, name: 'foo bar' }}
            {...props}
        />,
    );

const defaultFeatures = {
    activityFeed: {
        tasks: {
            assignToGroup: false,
        },
    },
};

const renderWithFeatures = (props: RenderProps, features?: typeof defaultFeatures) =>
    mount(
        <FeatureProvider features={features || defaultFeatures}>
            <TaskForm
                getMentionWithQuery={() => Promise.resolve([])}
                intl={mockIntl}
                user={{ id: 123, name: 'foo bar' }}
                {...props}
            />
        </FeatureProvider>,
    );

describe('components/ContentSidebar/ActivityFeed/task-form/TaskForm', () => {
    test('should render form fields', () => {
        const wrapper = render({ createTask: jest.fn() });
        const container = wrapper.render();

        expect(container.find('[data-testid="task-form-assignee-input"]').length).toEqual(1);
        expect(container.find('[data-testid="task-form-name-input"]').length).toEqual(1);
        expect(container.find('[data-testid="task-form-date-input"]').length).toEqual(1);
        expect(container.find('[data-testid="task-form-submit-button"]').length).toEqual(1);
        expect(container.find('[data-testid="task-form-cancel-button"]').length).toEqual(1);
    });

    test('should call createTask prop on submit when form is valid', () => {
        const createTaskSpy = jest.fn();
        const wrapper = render({
            createTask: createTaskSpy,
        });

        const approver = {
            id: '',
            target: {
                id: 123,
                name: 'abc',
                type: 'user',
            },
            role: 'ASSIGNEE',
            type: 'task_collaborator',
            status: 'NOT_STARTED',
            permissions: { can_delete: false, can_update: false },
        };
        const message = 'hey';
        const dueDate = new Date('2019-04-12');

        // Fill form fields
        const messageInput = wrapper.find('[data-testid="task-form-name-input"]').first();
        messageInput.simulate('change', { target: { value: message } });

        const dateInput = wrapper.find('[data-testid="task-form-date-input"]').first();
        dateInput.simulate('change', { target: { value: dueDate.toISOString() } });

        // Add approver through PillSelector
        const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
        pillSelector.simulate('change', { target: { value: approver.target.name } });
        pillSelector.simulate('select', approver);

        // Submit form
        const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
        submitButton.simulate('submit', {
            preventDefault: jest.fn(),
            target: {
                checkValidity: () => true,
            },
        });

        expect(createTaskSpy).toHaveBeenCalledWith(
            message,
            [approver],
            dueDate.toISOString(),
            'ALL_ASSIGNEES',
            expect.any(Function),
            expect.any(Function),
        );
    });

    test('should call editTask prop on submit when form is in edit mode', () => {
        const editTaskMock = jest.fn();
        const id = '1';
        const description = 'hey';
        const wrapper = render({
            id,
            editTask: editTaskMock,
            editMode: TASK_EDIT_MODE_EDIT,
        });

        // Fill message field
        const messageInput = wrapper.find('[data-testid="task-form-name-input"]').first();
        messageInput.simulate('change', { target: { value: description } });

        // Submit form
        const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
        submitButton.simulate('submit', {
            preventDefault: jest.fn(),
            target: {
                checkValidity: () => true,
            },
        });

        expect(editTaskMock).toHaveBeenCalledWith(
            {
                id,
                description,
                due_at: null,
                completion_rule: 'ALL_ASSIGNEES',
                addedAssignees: [],
                removedAssignees: [],
            },
            expect.any(Function),
            expect.any(Function),
        );
    });

    test('should call onCancel handler when cancel button is clicked', () => {
        const onCancelSpy = jest.fn();
        const wrapper = render({ onCancel: onCancelSpy });

        const cancelButton = wrapper.find('[data-testid="task-form-cancel-button"]').hostNodes();
        cancelButton.simulate('click');

        expect(onCancelSpy).toHaveBeenCalledTimes(1);
    });

    test('should not call createTask() when inputs are empty', () => {
        const createTaskSpy = jest.fn();
        const wrapper = render({ createTask: createTaskSpy });

        const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
        submitButton.simulate('submit', {
            preventDefault: jest.fn(),
            target: {
                checkValidity: () => false,
            },
        });

        expect(createTaskSpy).not.toHaveBeenCalled();
    });

    test('should filter out already-assigned users from assignment dropdown options', () => {
        const wrapper = render({
            approverSelectorContacts: [
                { id: 123, item: { id: 123, name: 'name' }, name: 'name' },
                { id: 234, item: { id: 234, name: 'test' }, name: 'test' },
            ],
            createTask: jest.fn(),
        });

        // Add an approver
        const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
        pillSelector.simulate('change', { target: { value: 'name' } });
        pillSelector.simulate('select', {
            id: '',
            target: {
                id: 123,
                name: 'abc',
                type: 'user',
            },
            role: 'ASSIGNEE',
            type: 'task_collaborator',
            status: 'NOT_STARTED',
            permissions: { can_delete: false, can_update: false },
        });

        expect(wrapper.find('PillSelectorDropdown').prop('selectorOptions')).toHaveLength(1);
    });

    test('should add scrollable class when there are enough contacts in assignment dropdown', () => {
        const wrapper = render({
            approverSelectorContacts: [{ id: 123, item: { id: 123, name: 'name' }, name: 'name' }],
            createTask: jest.fn(),
        });
        expect(wrapper.find('PillSelectorDropdown').hasClass('scrollable')).toBe(false);

        wrapper.setProps({
            approverSelectorContacts: [
                { id: 123, item: { id: 123, name: 'name' }, name: 'name' },
                { id: 234, item: { id: 234, name: 'test' }, name: 'test' },
                { id: 567, item: { id: 567, name: 'hello' }, name: 'hello' },
                { id: 890, item: { id: 890, name: 'bob' }, name: 'bob' },
                { id: 555, item: { id: 555, name: 'ann' }, name: 'ann' },
            ],
        });

        expect(wrapper.find('PillSelectorDropdown').hasClass('scrollable')).toBe(true);
    });

    describe('approver input', () => {
        test('should show error when approver input is incomplete (no pill selected)', () => {
            const value = 'not-a-user';
            const getApproverWithQuery = jest.fn();
            const wrapper = render({ getApproverWithQuery });
            const input = wrapper.find('PillSelector[data-testid="task-form-assignee-input"]');

            input.simulate('change', { target: { value } });
            input.simulate('blur');

            wrapper.update();
            expect(wrapper.find('PillSelector[data-testid="task-form-assignee-input"]').prop('error')).toBe(
                commonMessages.invalidUserError.defaultMessage,
            );
        });
    });

    describe('date input', () => {
        test('should set the due date to be one millisecond before midnight of the next day', () => {
            // Midnight on December 3rd GMT
            const date = new Date('2018-12-03T00:00:00');
            // 11:59:59:999 on December 3rd GMT
            const lastMillisecondOfDate = new Date('2018-12-03T23:59:59.999');
            const wrapper = render({});

            // Change date input
            const dateInput = wrapper.find('[data-testid="task-form-date-input"]').first();
            dateInput.simulate('change', { target: { value: date.toISOString() } });

            // Get the updated date value from the input
            const updatedDateInput = wrapper.find('[data-testid="task-form-date-input"]').first();
            expect(updatedDateInput.prop('value')).toBe(lastMillisecondOfDate.toISOString());
        });

        test('should clear the due date when input is cleared', () => {
            const wrapper = render({});

            // Set initial date
            const dateInput = wrapper.find('[data-testid="task-form-date-input"]').first();
            dateInput.simulate('change', { target: { value: new Date('2018-12-03T00:00:00').toISOString() } });

            // Clear date
            dateInput.simulate('change', { target: { value: '' } });

            // Get the updated date value from the input
            const updatedDateInput = wrapper.find('[data-testid="task-form-date-input"]').first();
            expect(updatedDateInput.prop('value')).toBe('');
        });
    });

    describe('approver selector', () => {
        test('should call getApproverWithQuery() when input changes', () => {
            const value = 'test';
            const getApproverWithQuery = jest.fn();
            const wrapper = render({ getApproverWithQuery });

            const input = wrapper.find('[data-testid="task-form-assignee-input"]').first();
            input.simulate('change', { target: { value } });

            expect(getApproverWithQuery).toHaveBeenCalledWith(value);
        });

        test('should update approvers when an option is selected', () => {
            const wrapper = render({});
            const newApprover = {
                id: 234,
                text: 'bcd',
                item: {
                    id: 234,
                    name: 'bcd',
                    type: 'user',
                },
            };

            // Select a new approver
            const input = wrapper.find('[data-testid="task-form-assignee-input"]').first();
            input.simulate('select', newApprover);

            // Verify the approver was added
            const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
            expect(pillSelector.prop('selectedOptions')).toEqual([
                {
                    id: '',
                    target: {
                        id: 234,
                        name: 'bcd',
                        type: 'user',
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                },
            ]);
        });
    });

    describe('approver removal', () => {
        test('should remove approver when pill is removed', () => {
            const wrapper = render({});
            const approver = {
                id: '',
                target: {
                    id: 123,
                    name: 'abc',
                    type: 'user',
                },
                role: 'ASSIGNEE',
                type: 'task_collaborator',
                status: 'NOT_STARTED',
                permissions: { can_delete: false, can_update: false },
            };

            // Add an approver first
            const input = wrapper.find('[data-testid="task-form-assignee-input"]').first();
            input.simulate('select', approver);

            // Remove the approver
            const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
            pillSelector.simulate('remove', approver, 0);

            // Verify the approver was removed
            expect(pillSelector.prop('selectedOptions')).toEqual([]);
        });
    });

    describe('form submission', () => {
        test('should handle submit success by clearing form', () => {
            const createTaskMock = jest.fn((text, assignees, dueDate, completionRule, onSuccess) => {
                onSuccess();
            });
            const wrapper = render({ createTask: createTaskMock });

            // Fill form with data
            const messageInput = wrapper.find('[data-testid="task-form-name-input"]').first();
            messageInput.simulate('change', { target: { value: 'test message' } });

            // Submit form
            const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
            submitButton.simulate('submit', {
                preventDefault: jest.fn(),
                target: {
                    checkValidity: () => true,
                },
            });

            // Verify success handler was called
            expect(createTaskMock).toHaveBeenCalled();

            // Verify form was cleared
            const updatedMessageInput = wrapper.find('[data-testid="task-form-name-input"]').first();
            expect(updatedMessageInput.prop('value')).toBe('');
        });

        test('should handle submit error', () => {
            const createTaskMock = jest.fn((text, assignees, dueDate, completionRule, onSuccess, onError) => {
                const error: ElementsXhrError = {
                    code: 'error_code',
                    status: 400,
                    message: 'Error message',
                };
                onError(error);
            });
            const wrapper = render({ createTask: createTaskMock });

            // Submit form
            const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
            submitButton.simulate('submit', {
                preventDefault: jest.fn(),
                target: {
                    checkValidity: () => true,
                },
            });

            expect(createTaskMock).toHaveBeenCalled();
        });
    });

    describe('completion rule', () => {
        test.each`
            numAssignees | shouldShowCheckbox | checkBoxDisabled
            ${0}         | ${false}           | ${undefined}
            ${1}         | ${true}            | ${true}
            ${2}         | ${true}            | ${false}
        `(
            'checkbox should be shown correctly when number of assignees is $numAssignees',
            ({ numAssignees, shouldShowCheckbox, checkBoxDisabled }) => {
                const approvers = new Array(numAssignees).fill(null).map(() => ({
                    id: '',
                    target: {
                        id: 123 * Math.random(),
                        name: 'abc',
                        type: 'user',
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                }));

                // Add approvers through PillSelector
                const wrapper = renderWithFeatures({});
                const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
                approvers.forEach(approver => {
                    pillSelector.simulate('select', approver);
                });

                const checkbox = wrapper.find('[data-testid="task-form-completion-rule-checkbox"]');
                expect(checkbox.length === 1).toBe(shouldShowCheckbox);
                expect(checkbox.prop('disabled')).toBe(checkBoxDisabled);
            },
        );

        test.each`
            numGroupAssignees | shouldShowCheckbox | checkBoxDisabled
            ${0}              | ${false}           | ${undefined}
            ${1}              | ${true}            | ${false}
            ${2}              | ${true}            | ${false}
        `(
            'checkbox should be shown correctly when number of group assignees is $numGroupAssignees',
            ({ numGroupAssignees, shouldShowCheckbox, checkBoxDisabled }) => {
                const approvers = new Array(numGroupAssignees).fill(null).map(() => ({
                    id: '',
                    target: {
                        id: 123 * Math.random(),
                        name: 'abc',
                        type: 'group',
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                }));

                // Add approvers through PillSelector
                const wrapper = renderWithFeatures({});
                const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
                approvers.forEach(approver => {
                    pillSelector.simulate('select', approver);
                });

                const checkbox = wrapper.find('[data-testid="task-form-completion-rule-checkbox"]');
                expect(checkbox.length === 1).toBe(shouldShowCheckbox);
                expect(checkbox.prop('disabled')).toBe(checkBoxDisabled);
            },
        );

        test('should enable checkbox when there is one type of each assignee', () => {
            const approvers = [
                {
                    id: '',
                    target: {
                        id: 123 * Math.random(),
                        name: 'abc',
                        type: 'group',
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                },
                {
                    id: '',
                    target: {
                        id: 123 * Math.random(),
                        name: 'abc',
                        type: 'user',
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                },
            ];

            // Add approvers through PillSelector
            const wrapper = renderWithFeatures({});
            const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
            approvers.forEach(approver => {
                pillSelector.simulate('select', approver);
            });

            const checkbox = wrapper.find('[data-testid="task-form-completion-rule-checkbox"]');
            expect(checkbox.length === 1).toBe(true);
            expect(checkbox.prop('disabled')).toBe(false);
        });

        test.each`
            assignToGroupFeature | numCheckboxes | checkboxTestId
            ${false}             | ${1}          | ${'task-form-completion-rule-checkbox'}
            ${true}              | ${1}          | ${'task-form-completion-rule-checkbox-group'}
        `(
            'Given 3 approvers, $numCheckboxes checkboxes are shown when assign to group is $assignToGroupFeature (using test id $checkboxTestId)',
            ({ assignToGroupFeature, numCheckboxes, checkboxTestId }) => {
                const approvers = new Array(3).fill(null).map(() => ({
                    id: '',
                    target: {
                        id: 123 * Math.random(),
                        name: 'abc',
                        type: 'user',
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                }));
                const wrapper = renderWithFeatures({
                    activityFeed: {
                        tasks: {
                            assignToGroup: assignToGroupFeature,
                        },
                    },
                });

                const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
                approvers.forEach(approver => {
                    pillSelector.simulate('select', approver);
                });

                const checkbox = wrapper.find(`[data-testid="${checkboxTestId}"]`);
                expect(checkbox.length).toBe(numCheckboxes);
            },
        );
    });

    describe('assignee management', () => {
        test('should handle adding and removing assignees', () => {
            const approvers = [
                {
                    id: '123',
                    target: {
                        id: 123,
                        name: 'abc',
                        type: 'user',
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                },
                {
                    id: '234',
                    target: {
                        id: 234,
                        name: 'abc',
                        type: 'user',
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                },
            ];
            const newApprover = {
                id: '456',
                text: 'bcd',
                item: {
                    id: 456,
                    name: 'bcd',
                    type: 'user',
                },
            };

            const wrapper = render({ id: '12345678', editMode: TASK_EDIT_MODE_EDIT, approvers });

            // Add approver through PillSelector
            const pillSelector = wrapper.find('[data-testid="task-form-assignee-input"]').first();
            pillSelector.simulate('select', newApprover);

            // Remove approver
            const removeButton = wrapper.find('[data-testid="task-form-assignee-remove"]').first();
            removeButton.simulate('click');

            expect(wrapper.find('.bcs-task-input-controls')).toMatchSnapshot();
        });
    });
});

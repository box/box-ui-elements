import * as React from 'react';
import { mount } from 'enzyme';
import DatePicker from '../../../../../components/date-picker/DatePicker'; // eslint-disable-line no-unused-vars
import { TASK_EDIT_MODE_EDIT } from '../../../../../constants';
import FeatureProvider from '../../../../common/feature-checking/FeatureProvider';
import { TaskFormUnwrapped as TaskForm } from '..';
import commonMessages from '../../../../../common/messages';

jest.mock('../../Avatar', () => () => 'Avatar');
jest.mock('../../../../../components/date-picker/DatePicker', () => props => {
    // only spread `input` attritutes to the input field
    const { name, value = '', className, onChange, placeholder } = props;
    const localInputProps = {
        name,
        value,
        className,
        onChange,
        placeholder,
    };
    return (
        <input type="date" {...localInputProps} {...props.inputProps} /> // eslint-disable-line react/prop-types
    );
});

const mockIntl = {
    formatMessage: message => message.defaultMessage,
};

const render = props =>
    mount(<TaskForm getMentionWithQuery={() => {}} intl={mockIntl} user={{ id: 123, name: 'foo bar' }} {...props} />);

const defaultFeatures = {
    activityFeed: {
        tasks: {
            assignToGroup: false,
        },
    },
};

// TODO: Remove this when Any Task GA's
const renderWithFeatures = (props, features) =>
    mount(
        <FeatureProvider features={features || defaultFeatures}>
            <TaskForm getMentionWithQuery={() => {}} intl={mockIntl} user={{ id: 123, name: 'foo bar' }} {...props} />
        </FeatureProvider>,
    );

describe('components/ContentSidebar/ActivityFeed/task-form/TaskForm', () => {
    test('should render form fields', () => {
        const wrapper = render({ createTask: jest.fn() });
        const container = wrapper.render();

        expect(container.find('[data-testid="task-form-assignee-input"]').length).toEqual(1);
        expect(container.find('[data-testid="task-form-name-input"]').length).toEqual(1);
        expect(container.find('[data-testid="task-form-date-input"]').length).toEqual(1);
        expect(container.find('.bcs-task-input-controls').length).toEqual(1);
        expect(container.find('.bcs-task-input-controls').find('button').length).toEqual(2);
    });

    test('should call createTask prop on submit when form is valid', () => {
        const createTaskSpy = jest.fn();
        const wrapper = render({
            createTask: createTaskSpy,
        });

        const approvers = [
            {
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
            },
        ];
        const message = 'hey';
        const dueDate = new Date('2019-04-12');

        // Warning: bypass user interactions to populate form
        wrapper.setState({
            approvers,
            message,
            dueDate,
            isValid: true,
        });

        // Clicks should cause form submit but Enzyme doesn't do it
        const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
        submitButton.simulate('submit', {
            target: {
                checkValidity: () => true, // not implemented in JSDOM
            },
        });

        expect(createTaskSpy).toHaveBeenCalled();
    });

    test('should call editTask prop on submit when form is in edit mode', () => {
        const editTaskMock = jest.fn();
        const id = '1';
        const wrapper = render({
            id,
            editTask: editTaskMock,
            editMode: TASK_EDIT_MODE_EDIT,
        });
        const instance = wrapper.instance();
        const description = 'hey';

        // Set form state to reflect updated data
        wrapper.setState({
            message: description,
            isValid: true,
        });

        const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
        submitButton.simulate('submit', {
            target: {
                checkValidity: () => true, // not implemented in JSDOM
            },
        });

        expect(editTaskMock).toHaveBeenCalledWith(
            {
                addedAssignees: [],
                removedAssignees: [],
                id,
                description,
                due_at: null,
                completion_rule: 'ALL_ASSIGNEES',
            },
            instance.handleSubmitSuccess,
            instance.handleSubmitError,
        );
    });

    test('should call onCancel handler when cancel button is clicked', async () => {
        const onCancelSpy = jest.fn();
        const wrapper = render({ onCancel: onCancelSpy });

        // This should be linked to an element but Enzyme won't simulate the event below
        const cancelButton = wrapper.find('[data-testid="task-form-cancel-button"]').hostNodes();
        cancelButton.simulate('click');

        expect(onCancelSpy).toHaveBeenCalledTimes(1);
    });

    test('should not call createTask() when inputs are empty', () => {
        const createTaskSpy = jest.fn();
        const wrapper = render({ createTask: createTaskSpy });

        const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
        submitButton.simulate('click');

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
        wrapper.setState({
            approvers: [
                {
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
                },
            ],
        });
        expect(wrapper.find('PillSelectorDropdown').prop('selectorOptions').length).toBe(1);
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
        expect(wrapper.find('PillSelectorDropdown').hasClass('scrollable'));
    });

    describe('approver input', () => {
        test('should show error when approver input is incomplete (no pill selected)', () => {
            const value = 'not-a-user';
            const getApproverWithQuery = jest.fn();
            const wrapper = render({ getApproverWithQuery });
            let input = wrapper.find('PillSelector[data-testid="task-form-assignee-input"]');

            input.prop('onInput')({ target: { value } });
            input.prop('onBlur')();
            wrapper.update();

            input = wrapper.find('PillSelector[data-testid="task-form-assignee-input"]');
            expect(input.prop('error')).toBe(commonMessages.invalidUserError.defaultMessage); // 'Invalid User'
        });
    });

    describe('handleDueDateChange()', () => {
        test('should set the approval date to be one millisecond before midnight of the next day', async () => {
            // Midnight on December 3rd GMT
            const date = new Date('2018-12-03T00:00:00');
            const validateFormMock = jest.fn();
            // 11:59:59:999 on December 3rd GMT
            const lastMillisecondOfDate = new Date('2018-12-03T23:59:59.999');
            const wrapper = render({});

            wrapper.instance().validateForm = validateFormMock;

            wrapper.instance().handleDueDateChange(date);

            expect(wrapper.state('dueDate')).toEqual(lastMillisecondOfDate);
            expect(validateFormMock).toHaveBeenCalled();
        });

        test('should change a previously set approval date to null if there is no approval date', () => {
            // Midnight on December 3rd GMT
            const date = new Date('2018-12-03T00:00:00');
            // 11:59:59:999 on December 3rd GMT
            const lastMillisecondOfDate = new Date('2018-12-03T23:59:59.999');
            const wrapper = render({});

            wrapper.instance().handleDueDateChange(date);
            expect(wrapper.state('dueDate')).toEqual(lastMillisecondOfDate);

            wrapper.instance().handleDueDateChange(null);
            expect(wrapper.state('dueDate')).toEqual(null);
        });
    });

    describe('handleApproverSelectorInput()', () => {
        test('should call getApproverWithQuery() when called', () => {
            const value = 'test';
            const getApproverWithQuery = jest.fn();
            const wrapper = render({ getApproverWithQuery });
            wrapper.instance().handleApproverSelectorInput(value);

            expect(getApproverWithQuery).toHaveBeenCalledWith(value);
        });
    });

    describe('handleApproverSelectorSelect()', () => {
        test('should update approvers when called', () => {
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
            const newApprover = {
                id: 234,
                text: 'bcd',
                item: {
                    id: 234,
                    name: 'bcd',
                    type: 'user',
                },
            };
            const expectedNewApprover = {
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
            };
            const wrapper = render();
            wrapper.setState({ approvers: [approver] });
            wrapper.instance().handleApproverSelectorSelect([newApprover]);
            expect(wrapper.state('approvers')).toEqual([approver, expectedNewApprover]);
        });
    });

    describe('handleApproverSelectorRemove()', () => {
        test('should update approvers when called', () => {
            const approvers = [
                {
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
                },
                {
                    id: '',
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
            const wrapper = render();

            wrapper.setState({ approvers });
            wrapper.instance().handleApproverSelectorRemove(approvers[0], 0);
            expect(wrapper.state('approvers')).toEqual([approvers[1]]);
        });
    });

    describe('handleSubmitError()', () => {
        test('should call onSubmitError prop and unset isLoading state', () => {
            const errorMock = { foo: 'bar' };
            const onSubmitErrorMock = jest.fn();
            const wrapper = render({ onSubmitError: onSubmitErrorMock });
            wrapper.setState({ isLoading: true });
            wrapper.instance().handleSubmitError(errorMock);

            expect(wrapper.state('isLoading')).toEqual(false);
            expect(onSubmitErrorMock).toHaveBeenCalledWith(errorMock);
        });
    });

    describe('handleSubmitSuccess()', () => {
        test('should call onSubmitSuccess prop, clearForm and unset isLoading state', () => {
            const onSubmitSuccessMock = jest.fn();
            const clearFormMock = jest.fn();

            const wrapper = render({ onSubmitSuccess: onSubmitSuccessMock });
            wrapper.setState({ isLoading: true });
            wrapper.instance().clearForm = clearFormMock;

            wrapper.instance().handleSubmitSuccess();

            expect(wrapper.state('isLoading')).toEqual(false);
            expect(onSubmitSuccessMock).toHaveBeenCalled();
            expect(clearFormMock).toHaveBeenCalled();
        });
    });

    describe('completionRule()', () => {
        test.each`
            numAssignees | shouldShowCheckbox | checkBoxDisabled
            ${0}         | ${false}           | ${undefined}
            ${1}         | ${true}            | ${true}
            ${2}         | ${true}            | ${false}
        `(
            'checkbox should be shown correctly when number of assignees is $numAssignees',
            ({ numAssignees, shouldShowCheckbox, checkBoxDisabled }) => {
                const approvers = new Array(numAssignees).fill().map(() => ({
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
                const wrapper = renderWithFeatures({ approvers });
                const container = wrapper.render();
                const checkbox = container.find('[data-testid="task-form-completion-rule-checkbox"]');

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
                const approvers = new Array(numGroupAssignees).fill().map(() => ({
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
                const wrapper = renderWithFeatures({ approvers });
                const container = wrapper.render();
                const checkbox = container.find('[data-testid="task-form-completion-rule-checkbox"]');

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

            const wrapper = renderWithFeatures({ approvers });
            const container = wrapper.render();
            const checkbox = container.find('[data-testid="task-form-completion-rule-checkbox"]');

            expect(checkbox.length === 1).toBe(true);
            expect(checkbox.prop('disabled')).toBe(false);
        });

        test('should call createTask with any assignee param when checkbox is checked', () => {
            const createTaskSpy = jest.fn();
            const message = 'hey';
            const taskType = 'GENERAL';
            const dueDate = new Date('2019-04-12');

            const wrapper = renderWithFeatures({
                taskType,
                createTask: createTaskSpy,
            });

            const approvers = new Array(3).fill().map(() => ({
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

            wrapper.find(TaskForm).setState({
                approvers,
                message,
                dueDate,
                completionRule: 'ANY_ASSIGNEE',
                isValid: true,
            });

            const container = wrapper.render();
            const checkbox = container.find('[data-testid="task-form-completion-rule-checkbox"]');

            const submitButton = wrapper.find('[data-testid="task-form-submit-button"]').hostNodes();
            submitButton.simulate('submit', {
                target: {
                    checkValidity: () => true,
                },
            });

            expect(checkbox.length).toBe(1);
            expect(checkbox.prop('checked')).toBe(true);
            expect(createTaskSpy).toHaveBeenCalledWith(
                message,
                expect.any(Object),
                taskType,
                dueDate.toISOString(),
                'ANY_ASSIGNEE',
                expect.any(Function),
                expect.any(Function),
            );
        });

        test.each`
            assignToGroupFeature | numCheckboxes | checkboxTestId
            ${false}             | ${1}          | ${'task-form-completion-rule-checkbox'}
            ${true}              | ${1}          | ${'task-form-completion-rule-checkbox-group'}
        `(
            'Given 3 approvers, $numCheckboxes checkboxes are shown when any task is $anyTaskFeature and assign to group is $assignToGroupFeature (using test id $checkboxTestId)',
            ({ assignToGroupFeature, numCheckboxes, checkboxTestId }) => {
                const approvers = new Array(3).fill().map(() => ({
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
                const wrapper = renderWithFeatures(
                    {
                        approvers,
                    },
                    {
                        activityFeed: {
                            tasks: {
                                assignToGroup: assignToGroupFeature,
                            },
                        },
                    },
                );
                const container = wrapper.render();
                const checkbox = container.find(`[data-testid="${checkboxTestId}"]`);

                expect(checkbox.length).toBe(numCheckboxes);
            },
        );
    });

    describe('addResinInfo()', () => {
        test('should set assignee added and removed information correctly', () => {
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
                id: 456,
                text: 'bcd',
                item: {
                    id: 456,
                    name: 'bcd',
                    type: 'user',
                },
            };
            const dueDate = new Date('2019-04-12');

            const wrapper = render({ id: 12345678, editMode: TASK_EDIT_MODE_EDIT, approvers });
            wrapper.setState({ dueDate });

            // add approver
            wrapper.instance().handleApproverSelectorSelect([newApprover]);

            // remove approver
            wrapper.instance().handleApproverSelectorRemove(approvers[0], 0);

            wrapper.mount();
            expect(wrapper.find('.bcs-task-input-controls')).toMatchSnapshot();
        });
    });
});

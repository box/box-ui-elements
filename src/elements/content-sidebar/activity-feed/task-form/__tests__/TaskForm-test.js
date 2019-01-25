import * as React from 'react';
import { mount } from 'enzyme';
import DatePicker from 'components/date-picker/DatePicker'; // eslint-disable-line no-unused-vars

import { TaskFormUnwrapped as TaskForm } from '..';

jest.mock('../../Avatar', () => () => 'Avatar');
jest.mock('components/date-picker/DatePicker', () => props => <input type="date" {...props} {...props.inputProps} />);

const mockIntl = {
    formatMessage: message => message.defaultMessage,
};

const render = props =>
    mount(<TaskForm getMentionWithQuery={() => {}} user={{ id: 123, name: 'foo bar' }} intl={mockIntl} {...props} />);

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

        const approvers = [{ text: 'user one', value: '123' }];
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
        expect(submitButton.props()['aria-disabled']).toBe(true);
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
            approvers: [{ text: 'name', value: 123 }],
        });
        expect(wrapper.find('PillSelectorDropdown').prop('selectorOptions').length).toBe(1);
    });

    describe('handleDueDateChange()', () => {
        test('should set the approval date to be one millisecond before midnight of the next day', async () => {
            // Midnight on December 3rd GMT
            const date = new Date('2018-12-03T00:00:00');
            // 11:59:59:999 on December 3rd GMT
            const lastMillisecondOfDate = new Date('2018-12-03T23:59:59.999');
            const wrapper = render({});

            wrapper.instance().handleDueDateChange(date);

            expect(wrapper.state('dueDate')).toEqual(lastMillisecondOfDate);
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
            const wrapper = render();
            wrapper.setState({ approvers: [{ value: 123 }] });
            wrapper.instance().handleApproverSelectorSelect([{ value: 234 }]);
            expect(wrapper.state('approvers')).toEqual([{ value: 123 }, { value: 234 }]);
        });
    });

    describe('handleApproverSelectorRemove()', () => {
        test('should update approvers when called', () => {
            const wrapper = render();
            wrapper.setState({ approvers: [{ value: 123 }, { value: 234 }] });
            wrapper.instance().handleApproverSelectorRemove({ value: 123 }, 0);
            expect(wrapper.state('approvers')).toEqual([{ value: 234 }]);
        });
    });
});

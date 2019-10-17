import React from 'react';
import { mount } from 'enzyme';
import { AddTaskButtonComponent as AddTaskButton } from '../AddTaskButton';

describe('elements/content-sidebar/AddTaskButton', () => {
    /* 
    1. Pushing the open state into history keeps the sidebar open upon resize and refresh
    2. Preventing the sidebar from closing keeps the task modal open upon edit and resize 
    */

    test('should call history.replace state with force open state when task menu items are clicked', () => {
        const historyMock = { replace: jest.fn() };
        const wrapper = mount(<AddTaskButton history={historyMock} />);

        const button = wrapper.find('Button');
        button.simulate('click');

        const menuItem = wrapper.find('MenuItem').first();
        menuItem.simulate('click');

        expect(historyMock.replace).toHaveBeenCalledWith({ state: { open: true } });
    });
});

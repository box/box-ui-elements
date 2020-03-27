import React from 'react';
import { shallow } from 'enzyme/build';
import { SidebarToggleComponent as SidebarToggle } from '../SidebarToggle';

describe('elements/content-sidebar/SidebarToggle', () => {
    const historyMock = { replace: jest.fn() };
    const getWrapper = (props = {}) => shallow(<SidebarToggle history={historyMock} {...props} />);

    test.each`
        isOpen   | location
        ${true}  | ${{ state: { open: false } }}
        ${false} | ${{ state: { open: true } }}
    `('should render and handle clicks correctly when isOpen is $isOpen', ({ isOpen, location }) => {
        const event = { preventDefault: jest.fn() };
        const wrapper = getWrapper({ isOpen });

        wrapper.simulate('click', event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(historyMock.replace).toHaveBeenCalledWith(location);
        expect(wrapper).toMatchSnapshot();
    });
});

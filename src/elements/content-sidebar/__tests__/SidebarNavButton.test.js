import * as React from 'react';
import { mount } from 'enzyme';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';
import PlainButton from '../../../components/plain-button';
import CustomRouter from '../../common/routing/customRouter';
import SidebarNavButton from '../SidebarNavButton';
import Tooltip from '../../../components/tooltip/Tooltip';

describe('elements/content-sidebar/SidebarNavButton', () => {
    const getWrapper = ({ children, ...props }, path = '/') =>
        mount(
            <CustomRouter initialEntries={[path]}>
                <SidebarNavButton {...props}>{children}</SidebarNavButton>
            </CustomRouter>,
        );
    const getButton = wrapper => wrapper.find(PlainButton).first();

    test('should render nav button properly', () => {
        const wrapper = getWrapper({ tooltip: 'foo' });
        const button = getButton(wrapper);

        expect(wrapper.find(Tooltip).prop('text')).toBe('foo');
        expect(button.hasClass('bcs-is-selected')).toBe(false);
    });

    test.each`
        isOpen       | expected
        ${true}      | ${true}
        ${false}     | ${false}
        ${undefined} | ${false}
    `('should render nav button properly when selected with the sidebar open or closed', ({ expected, isOpen }) => {
        const props = {
            isOpen,
            sidebarView: 'activity',
            tooltip: 'foo',
        };
        const wrapper = getWrapper(props, '/activity');
        const button = getButton(wrapper);

        expect(button.hasClass('bcs-is-selected')).toBe(expected);
    });

    test.each`
        path                | expected
        ${'/'}              | ${false}
        ${'/activity'}      | ${true}
        ${'/activity/'}     | ${true}
        ${'/activity/test'} | ${true}
        ${'/skills'}        | ${false}
    `('should reflect active state ($expected) correctly based on active path', ({ expected, path }) => {
        const wrapper = getWrapper({ isOpen: true, sidebarView: 'activity' }, path);
        const button = getButton(wrapper);

        expect(button.hasClass('bcs-is-selected')).toBe(expected);
    });

    test('should call onClick with sidebarView when clicked', () => {
        const mockOnClick = jest.fn();
        const mockSidebarView = 'activity';

        render(
            <CustomRouter initialEntries={['/']}>
                <SidebarNavButton onClick={mockOnClick} sidebarView={mockSidebarView}>
                    button
                </SidebarNavButton>
            </CustomRouter>,
        );
        const button = screen.getByText('button');

        fireEvent.click(button);
        expect(mockOnClick).toBeCalledWith(mockSidebarView);
    });
});

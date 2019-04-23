import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import PlainButton from '../../../components/plain-button';
import SidebarNavButton from '../SidebarNavButton';
import Tooltip from '../../../components/tooltip/Tooltip';

describe('elements/content-sidebar/SidebarNavButton', () => {
    const getWrapper = ({ children, ...props }, active = '') =>
        mount(
            <MemoryRouter initialEntries={[`/${active}`]}>
                <SidebarNavButton {...props}>{children}</SidebarNavButton>
            </MemoryRouter>,
        ).find('SidebarNavButton');
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
        const wrapper = getWrapper(props, 'activity');
        const button = getButton(wrapper);

        expect(button.hasClass('bcs-is-selected')).toBe(expected);
    });
});

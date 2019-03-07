import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import Tooltip from '../../../components/tooltip/Tooltip';
import SidebarNavButton from '../SidebarNavButton';

describe('elements/content-sidebar/SidebarNavButton', () => {
    const getWrapper = ({ children, ...props }, active = '') =>
        mount(
            <MemoryRouter initialEntries={[`/${active}`]}>
                <SidebarNavButton {...props}>{children}</SidebarNavButton>
            </MemoryRouter>,
        ).find('SidebarNavButton');

    test('should render nav button properly', () => {
        const props = {
            tooltip: 'foo',
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(Tooltip).prop('text')).toBe('foo');
    });

    test('should render nav button properly when selected', () => {
        const props = {
            sidebarView: 'activity',
            tooltip: 'foo',
        };
        const wrapper = getWrapper(props, 'activity');
        expect(
            wrapper
                .find('.bcs-nav-btn')
                .first()
                .prop('className'),
        ).toContain('bcs-nav-btn-is-selected');
    });
});

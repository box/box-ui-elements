import React from 'react';

import SidebarToggleButton from '..';

describe('components/sidebar-toggle-button/SidebarToggleButton', () => {
    test('should render correctly as open', () => {
        const wrapper = mount(<SidebarToggleButton isOpen />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly as closed', () => {
        const wrapper = mount(<SidebarToggleButton isOpen={false} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should have the proper class when it is collapsed', () => {
        const wrapper = mount(<SidebarToggleButton isOpen={false} />);

        expect(wrapper.find('PlainButton').hasClass('bdl-is-collapsed')).toBeTruthy();
    });

    test('should render correctly as left oriented toggle when open', () => {
        const wrapper = mount(<SidebarToggleButton direction="left" isOpen />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly as left oriented toggle when closed', () => {
        const wrapper = mount(<SidebarToggleButton direction="left" isOpen={false} />);

        expect(wrapper).toMatchSnapshot();
    });
});

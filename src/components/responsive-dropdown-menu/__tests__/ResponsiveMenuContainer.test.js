import React from 'react';

import ResponsiveMenuContainer from '../ResponsiveMenuContainer';
import Menu from '../../menu/Menu';
import MenuItem from '../../menu/MenuItem';

describe('components/dropdown-menu/ResponsiveMenuContainer', () => {
    test('should correctly render toggle', () => {
        const props = {
            buttonText: 'click me',
            subtitle: 'subtitle',
            title: 'title',
        };

        const menu = (
            <Menu>
                <MenuItem>View Profile</MenuItem>
                <MenuItem>Help</MenuItem>
            </Menu>
        );

        const wrapper = shallow(<ResponsiveMenuContainer {...props}>{menu}</ResponsiveMenuContainer>);

        expect(wrapper).toMatchSnapshot();
    });
});

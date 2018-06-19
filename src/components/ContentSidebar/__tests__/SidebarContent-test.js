import React from 'react';
import { shallow } from 'enzyme';
import SidebarContent from '../SidebarContent';

describe('components/ContentSidebar/SidebarContent', () => {
    const getWrapper = (props) => shallow(<SidebarContent {...props} />);

    test('should render sidebar content component', () => {
        const wrapper = getWrapper({
            title: 'title',
            children: 'children'
        });

        expect(wrapper).toMatchSnapshot();
    });
});

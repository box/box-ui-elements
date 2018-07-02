import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from 'box-react-ui/lib/components/tooltip/Tooltip';
import SidebarNavButton from '../SidebarNavButton';

describe('components/ContentSidebar/SidebarNavButton', () => {
    const getWrapper = (props) => shallow(<SidebarNavButton {...props} />);

    test('should render nav button properly', () => {
        const props = {
            tooltip: 'foo'
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(Tooltip).prop('text')).toBe('foo');
        expect(wrapper).toMatchSnapshot();
    });

    test('should render nav button properly when selected', () => {
        const props = {
            tooltip: 'foo',
            isSelected: true
        };
        const wrapper = getWrapper(props);
        expect(wrapper.childAt(0).prop('className')).toBe('bcs-nav-btn bcs-nav-btn-is-selected');
        expect(wrapper).toMatchSnapshot();
    });
});

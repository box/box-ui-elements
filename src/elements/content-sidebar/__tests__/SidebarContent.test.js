import * as React from 'react';
import { shallow } from 'enzyme';
import SidebarContent from '../SidebarContent';
import { SIDEBAR_VIEW_ACTIVITY } from '../../../constants';

describe('elements/content-sidebar/SidebarContent', () => {
    const getWrapper = props => shallow(<SidebarContent {...props} />);

    test('should render sidebar content component', () => {
        const wrapper = getWrapper({
            title: 'title',
            children: 'children',
            elementId: 'bcs_5',
            sidebarView: SIDEBAR_VIEW_ACTIVITY,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render sidebar content component without title header element if title prop is not provided', () => {
        const wrapper = getWrapper({
            children: 'children',
            elementId: 'bcs_5',
            sidebarView: SIDEBAR_VIEW_ACTIVITY,
        });

        expect(wrapper.find('.bcs-title')).toHaveLength(0);
    });
});

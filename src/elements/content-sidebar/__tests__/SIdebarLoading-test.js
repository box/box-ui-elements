import * as React from 'react';
import { shallow } from 'enzyme';
import SidebarLoading from '../SidebarLoading';

describe('elements/content-sidebar/SidebarLoading', () => {
    const getWrapper = (props = {}) => shallow(<SidebarLoading {...props} />);

    test('should render the component', () => {
        const wrapper = getWrapper({
            tile: 'foo',
        });
        expect(wrapper).toMatchSnapshot();
    });
});

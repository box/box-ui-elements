import * as React from 'react';
import { shallow } from 'enzyme';
import SidebarLoadingError from '../SidebarLoadingError';

describe('elements/content-sidebar/SidebarLoading', () => {
    const getWrapper = (props = {}) => shallow(<SidebarLoadingError {...props} />);

    test('should render the component', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
});

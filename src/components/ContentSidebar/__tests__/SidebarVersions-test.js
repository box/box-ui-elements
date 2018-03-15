import React from 'react';
import { shallow } from 'enzyme';
import SidebarVersions from '../SidebarVersions';

describe('components/ContentSidebar/SidebarVersions', () => {
    const wrapper = (props) => shallow(<SidebarVersions {...props} />);

    test('should render the versions when total_count > 0', () => {
        const props = {
            versions: {
                total_count: 1
            }
        };
        expect(wrapper(props)).toMatchSnapshot();
    });

    test('should not render the versions when total_count is falsy', () => {
        const props = {
            versions: {
                total_count: 0
            }
        };
        expect(wrapper(props)).toMatchSnapshot();
    });
});

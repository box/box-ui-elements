import React from 'react';
import { shallow } from 'enzyme';
import SidebarAccessStats from '../SidebarAccessStats';

describe('components/ContentSidebar/SidebarAccessStats', () => {
    const wrapper = (props) => shallow(<SidebarAccessStats {...props} />);

    test('should not render the component when there are no access stats', () => {
        const props = {
            accessStats: {
                preview_count: 0,
                comment_count: 0,
                download_count: 0,
                edit_count: 0
            }
        };
        expect(wrapper(props)).toMatchSnapshot();
    });

    test('should render the component when there is at least one type of access stat', () => {
        const props = {
            accessStats: {
                preview_count: 0,
                comment_count: 0,
                download_count: 0,
                edit_count: 0
            }
        };
        expect(wrapper(props)).toMatchSnapshot();
    });
});

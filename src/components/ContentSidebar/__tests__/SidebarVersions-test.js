import React from 'react';
import { shallow } from 'enzyme';
import VersionHistoryLink from 'box-react-ui/lib/features/item-details/VersionHistoryLink';
import SidebarVersions from '../SidebarVersions';

describe('components/ContentSidebar/SidebarVersions', () => {
    const getWrapper = (props) => shallow(<SidebarVersions {...props} />);

    test('should render the versions when total_count > 0', () => {
        const props = {
            versions: {
                total_count: 1
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render the versions when total_count is falsy', () => {
        const props = {
            versions: {
                total_count: 0
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
    });
});

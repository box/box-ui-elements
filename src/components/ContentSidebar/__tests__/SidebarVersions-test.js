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
            },
            file: {
                extension: 'foo'
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
            },
            file: {
                extension: 'foo'
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink).exists()).toBe(false);
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render the versions when file is a box note', () => {
        const props = {
            versions: {
                total_count: 0
            },
            file: {
                extension: 'boxnote'
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink).exists()).toBe(false);
        expect(wrapper).toMatchSnapshot();
    });
});

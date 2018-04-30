import React from 'react';
import { shallow } from 'enzyme';
import AccessStats from 'box-react-ui/lib/features/access-stats/AccessStats';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import SidebarAccessStats, { SidebarAccessStatsComponent } from '../SidebarAccessStats';

describe('components/ContentSidebar/SidebarAccessStats', () => {
    const getWrapper = (props) => shallow(<SidebarAccessStatsComponent {...props} />);

    test('should not render the component when there are no access stats', () => {
        const props = {
            accessStats: {
                preview_count: 0,
                comment_count: 0,
                download_count: 0,
                edit_count: 0
            },
            file: {
                extension: 'foo'
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(AccessStats)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render the component when there is at least one type of access stat', () => {
        const props = {
            accessStats: {
                preview_count: 1,
                comment_count: 0,
                download_count: 0,
                edit_count: 0
            },
            file: {
                extension: 'foo'
            }
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(AccessStats)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render an error', () => {
        const props = {
            maskError: {
                errorHeader: {
                    id: 'foo',
                    description: 'bar',
                    defaultMessage: 'baz'
                }
            }
        };
        const wrapper = shallow(<SidebarAccessStats {...props} />);

        expect(wrapper.find(ErrorMask)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});

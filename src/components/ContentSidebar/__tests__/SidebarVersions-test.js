import React from 'react';
import { shallow, mount } from 'enzyme';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import VersionHistoryLink from 'box-react-ui/lib/features/item-details/VersionHistoryLink';
import SidebarVersionsComponent, { SidebarVersions as WrappedComponent } from '../SidebarVersions';

jest.mock('box-react-ui/lib/components/error-mask/ErrorMask', () => 'error-mask-mock');

describe('components/ContentSidebar/SidebarVersions', () => {
    const getWrapper = (props) => shallow(<WrappedComponent {...props} />);

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

    test('should render an error', () => {
        const props = {
            maskError: {
                errorHeader: {
                    defaultMessage: 'foo'
                }
            }
        };
        const wrapper = mount(<SidebarVersionsComponent {...props} />);

        expect(wrapper.find(ErrorMask)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});

import React from 'react';
import { shallow } from 'enzyme';
import VersionHistoryLink from '../../../features/item-details/VersionHistoryLink';
import SidebarVersions from '../SidebarVersions';

describe('elements/content-sidebar/SidebarVersions', () => {
    const getWrapper = props => shallow(<SidebarVersions {...props} />);

    test('should render the versions when version_number > 1', () => {
        const props = {
            file: {
                extension: 'foo',
                version_number: 2,
            },
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render the versions when version_number <= 1', () => {
        const props = {
            file: {
                extension: 'foo',
                version_number: 1,
            },
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink).exists()).toBe(false);
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render the versions when version_number is falsy', () => {
        const props = {
            file: {
                extension: 'foo',
                version: null,
            },
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink).exists()).toBe(false);
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render the versions when version_number is undefined', () => {
        const props = {
            file: {
                extension: 'foo',
            },
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink).exists()).toBe(false);
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render the versions when file is a box note', () => {
        const props = {
            file: {
                version_number: 1,
                extension: 'boxnote',
            },
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(VersionHistoryLink).exists()).toBe(false);
        expect(wrapper).toMatchSnapshot();
    });
});

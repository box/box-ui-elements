import { shallow } from 'enzyme';
import * as React from 'react';
import DetailsSidebar from '../DetailsSidebar';

jest.mock('../SidebarFileProperties', () => 'SidebarFileProperties');
jest.mock('../SidebarAccessStats', () => 'SidebarAccessStats');

const file = {
    id: 'foo'
};

describe('components/ContentSidebar/DetailsSidebar', () => {
    const getWrapper = (props) => shallow(<DetailsSidebar {...props} />);

    test('should render DetailsSidebar with all components', () => {
        const wrapper = getWrapper({
            file,
            hasProperties: true,
            hasNotices: true,
            hasAccessStats: true,
            hasClassification: true,
            hasRetentionPolicy: true,
            hasVersions: true
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty SidebarContent', () => {
        const wrapper = getWrapper({
            file
        });

        expect(wrapper.find('SidebarContent').children()).toHaveLength(0);
    });

    test('should have onClassificationClick prop on SidebarFileProperties', () => {
        const onClassificationClick = jest.fn();
        const wrapper = getWrapper({
            file: {
                ...file,
                permissions: {
                    can_upload: true
                }
            },
            hasProperties: true,
            onClassificationClick
        });

        expect(wrapper.find('SidebarFileProperties').prop('onClassificationClick')).toEqual(onClassificationClick);
    });

    test('should not have onClassificationClick prop on SidebarFileProperties', () => {
        const onClassificationClick = jest.fn();
        const wrapper = getWrapper({
            file: {
                ...file,
                permissions: {
                    can_upload: false
                }
            },
            hasProperties: true,
            onClassificationClick
        });

        expect(wrapper.find('SidebarFileProperties').prop('onClassificationClick')).toBeUndefined();
    });
});

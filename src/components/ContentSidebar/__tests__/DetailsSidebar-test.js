import { shallow } from 'enzyme';
import * as React from 'react';
import DetailsSidebar from '../DetailsSidebar';

jest.mock('../SidebarFileProperties', () => 'SidebarFileProperties');
jest.mock('../SidebarAccessStats', () => 'SidebarAccessStats');

const file = {
    id: 'foo',
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
            hasVersions: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty SidebarContent', () => {
        const wrapper = getWrapper({
            file,
        });

        expect(wrapper.find('SidebarContent').children()).toHaveLength(0);
    });
});

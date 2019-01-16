import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from '../Sidebar';

jest.mock('../ActivitySidebar', () => 'ActivitySidebar');
jest.mock('../DetailsSidebar', () => 'DetailsSidebar');
jest.mock('../SkillsSidebar', () => 'SkillsSidebar');
jest.mock('../MetadataSidebar', () => 'MetadataSidebar');
jest.mock('../../../utils/performance', () => ({
    mark: jest.fn(),
}));

describe('elements/content-sidebar/Sidebar', () => {
    const file = { id: 'id' };
    const getWrapper = props => shallow(<Sidebar file={file} {...props} />);

    test('should render no sidebar', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render skills sidebar', () => {
        const wrapper = getWrapper({ hasSkills: true, selectedView: 'skills' });
        expect(wrapper.find('SkillsSidebar')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render activity sidebar', () => {
        const wrapper = getWrapper({ hasActivityFeed: true, selectedView: 'activity' });
        expect(wrapper.find('ActivitySidebar')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render details sidebar', () => {
        const wrapper = getWrapper({ hasDetails: true, selectedView: 'details' });
        expect(wrapper.find('DetailsSidebar')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render metadata sidebar', () => {
        const wrapper = getWrapper({ hasMetadata: true, selectedView: 'metadata' });
        expect(wrapper.find('MetadataSidebar')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});

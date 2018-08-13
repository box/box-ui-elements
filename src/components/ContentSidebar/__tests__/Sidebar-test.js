import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from '../Sidebar';
import DetailsSidebar from '../DetailsSidebar';
import SkillsSidebar from '../SkillsSidebar';
import MetadataSidebar from '../MetadataSidebar';
import SidebarNav from '../SidebarNav';

jest.mock('../ActivitySidebar', () => 'ActivitySidebar');

describe('components/ContentSidebar/Skills/Sidebar', () => {
    const file = { id: 'id' };
    const getWrapper = (props) => shallow(<Sidebar file={file} {...props} />);

    test('should render no sidebar', () => {
        const wrapper = getWrapper();
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render skills sidebar', () => {
        const wrapper = getWrapper({ hasSkills: true, view: 'skills' });
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper.find(SkillsSidebar)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render activity sidebar', () => {
        const wrapper = getWrapper({ hasActivityFeed: true, view: 'activity' });
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper.find('ActivitySidebar')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render details sidebar', () => {
        const wrapper = getWrapper({ hasDetails: true, view: 'details' });
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper.find(DetailsSidebar)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render metadata sidebar', () => {
        const wrapper = getWrapper({ hasMetadata: true, view: 'metadata' });
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper.find(MetadataSidebar)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});

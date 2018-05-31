import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from '../Sidebar';
import DetailsSidebar from '../DetailsSidebar';
import SkillsSidebar from '../SkillsSidebar';
import ActivitySidebar from '../ActivitySidebar';
import SidebarNav from '../SidebarNav';
import * as skillUtils from '../Skills/skillUtils';

describe('components/ContentSidebar/Skills/Sidebar', () => {
    const getWrapper = (props) => shallow(<Sidebar {...props} />);

    test('should render no sidebar', () => {
        const wrapper = getWrapper();
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render skills sidebar', () => {
        skillUtils.hasSkills = jest.fn(() => true);
        const wrapper = getWrapper({ hasSkills: true });
        wrapper.setState({ view: 'skills' });
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper.find(SkillsSidebar)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render activity sidebar', () => {
        const wrapper = getWrapper({ hasActivityFeed: true });
        wrapper.setState({ view: 'activity' });
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper.find(ActivitySidebar)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render details sidebar', () => {
        const wrapper = getWrapper({ hasProperties: true });
        wrapper.setState({ view: 'details' });
        expect(wrapper.find(SidebarNav)).toHaveLength(1);
        expect(wrapper.find(DetailsSidebar)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});

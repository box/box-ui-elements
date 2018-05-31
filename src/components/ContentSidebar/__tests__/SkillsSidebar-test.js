import React from 'react';
import { shallow } from 'enzyme';
import SkillsSidebar from '../SkillsSidebar';
import SidebarSkills from '../Skills/SidebarSkills';

describe('components/ContentSidebar/Skills/SkillsSidebar', () => {
    const getWrapper = (props) => shallow(<SkillsSidebar {...props} />);

    test('should render skills sidebar component', () => {
        const wrapper = getWrapper({
            file: {},
            getPreviewer: jest.fn(),
            onSkillChange: jest.fn()
        });

        expect(wrapper.find(SidebarSkills)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});

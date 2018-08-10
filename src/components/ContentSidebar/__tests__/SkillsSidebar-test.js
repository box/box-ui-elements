import React from 'react';
import { shallow } from 'enzyme';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import { SkillsSidebarComponent as SkillsSidebar } from '../SkillsSidebar';
import SidebarSkills from '../Skills/SidebarSkills';

describe('components/ContentSidebar/Skills/SkillsSidebar', () => {
    const getWrapper = (props) => shallow(<SkillsSidebar {...props} />);

    test('should render skills sidebar component when cards are available', () => {
        const getSkills = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getSkills,
            }),
        };
        const wrapper = getWrapper({
            file: {},
            getPreviewer: jest.fn(),
            api,
        });
        wrapper.setState({ cards: [] });
        expect(wrapper.find(SidebarSkills)).toHaveLength(1);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getSkills).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    test('should render loading indicator component when cards are not available', () => {
        const getSkills = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getSkills,
            }),
        };
        const wrapper = getWrapper({
            file: {},
            getPreviewer: jest.fn(),
            api,
        });
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
        expect(wrapper.find(SidebarSkills)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getSkills).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });
});

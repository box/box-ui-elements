import React from 'react';
import { mount } from 'enzyme';
import SidebarSkills from '../SidebarSkills';
import SidebarSkillsCard from '../SidebarSkillsCard';
import * as skillUtils from '../skillUtils';

jest.mock('../../SidebarSection', () => 'sidebar-section');
jest.mock('../SidebarSkillsCard', () => 'sidebar-skills-card');

describe('components/ContentSidebar/Skills/SidebarSkills', () => {
    const getWrapper = (props) => mount(<SidebarSkills {...props} />);

    test('should render the cards when there are valid skills', () => {
        skillUtils.isValidSkillsCard = jest.fn(() => true);

        const props = {
            file: {
                permissions: {
                    can_upload: true
                },
                metadata: {
                    global: {
                        boxSkillsCards: {
                            cards: [
                                {
                                    entries: [{ title: 'foo' }]
                                },
                                {
                                    entries: [{ title: 'bar' }]
                                }
                            ]
                        }
                    }
                }
            },
            getPreviewer: jest.fn(),
            rootElement: jest.fn(),
            appElement: jest.fn()
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(SidebarSkillsCard)).toHaveLength(2);
        expect(wrapper).toMatchSnapshot();
    });
});

import React from 'react';
import { mount } from 'enzyme';
import SidebarSection from '../../SidebarSection';
import SidebarSkills from '../SidebarSkills';
import * as skillUtils from '../skillUtils';

describe('components/ContentSidebar/Skills/SidebarSkills', () => {
    const getWrapper = (props) => mount(<SidebarSkills {...props} />);

    test('should render the cards when there are valid skills', () => {
        skillUtils.isValidSkillsCard = jest.fn(() => true);

        const props = {
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
            },
            getPreviewer: jest.fn(),
            rootElement: jest.fn(),
            appElement: jest.fn(),
            onInteraction: jest.fn()
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find(SidebarSection)).toHaveLength(2);
        expect(wrapper).toMatchSnapshot();
    });
});

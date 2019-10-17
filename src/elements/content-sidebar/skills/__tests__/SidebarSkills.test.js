import React from 'react';
import { mount } from 'enzyme';
import SidebarSkills from '../SidebarSkills';
import SidebarSkillsCard from '../SidebarSkillsCard';

jest.mock('../../SidebarSection', () => 'sidebar-section');
jest.mock('../SidebarSkillsCard', () => 'sidebar-skills-card');

describe('elements/content-sidebar/Skills/SidebarSkills', () => {
    const getWrapper = props => mount(<SidebarSkills {...props} />);

    test('should render the cards when there are valid skills', () => {
        const props = {
            file: {
                permissions: {
                    can_upload: true,
                },
            },
            errors: {
                3: true,
                5: true,
            },
            cards: [
                {
                    skill_card_title: { code: 'skills_faces' },
                    entries: [{}],
                },
                {
                    skill_card_title: { code: 'skills_transcript' },
                    entries: [],
                },
                {
                    skill_card_title: { code: 'skills_topics' },
                    entries: [],
                },
                {
                    skill_card_title: { code: 'skills_status' },
                    entries: [{}],
                },
                {
                    skill_card_title: { code: 'skills_error' },
                    entries: [],
                },
                {
                    skill_card_title: { message: 'title' },
                    entries: [{}],
                },
            ],
            getViewer: jest.fn(),
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(SidebarSkillsCard)).toHaveLength(6);
    });

    test('should render only the valid cards', () => {
        const props = {
            file: {
                permissions: {
                    can_upload: true,
                },
            },
            errors: {
                1: true,
            },
            cards: [
                {},
                {
                    entries: [{ title: 'bar' }],
                },
            ],
            getViewer: jest.fn(),
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(SidebarSkillsCard)).toHaveLength(1);
    });

    test('should have no editable permission if can_upload is false', () => {
        const props = {
            file: {
                permissions: {
                    can_upload: false,
                },
            },
            errors: {},
            cards: [
                {
                    entries: [{ title: 'bar' }],
                },
            ],
            getViewer: jest.fn(),
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(SidebarSkillsCard)).toHaveLength(1);
    });
});

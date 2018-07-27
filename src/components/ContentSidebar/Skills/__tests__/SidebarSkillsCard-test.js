import React from 'react';
import { shallow } from 'enzyme';
import SidebarSkillsCard from '../SidebarSkillsCard';
import Transcript from '../Transcript';
import Keywords from '../Keywords';
import Faces from '../Faces';
import Status from '../Status';

describe('components/ContentSidebar/Skills/SidebarSkillsCard', () => {
    const getWrapper = (props) => shallow(<SidebarSkillsCard {...props} />);

    let cardProps;

    beforeEach(() => {
        cardProps = {
            card: {},
            getViewer: jest.fn()
        };
    });

    test('should render keywords component', () => {
        cardProps.card.skill_card_type = 'keyword';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Keywords)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render timelines component', () => {
        cardProps.card.skill_card_type = 'timeline';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Faces)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render face component', () => {
        cardProps.card.skill_card_type = 'face';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Faces)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render transcript component', () => {
        cardProps.card.skill_card_type = 'transcript';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Transcript)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render nothing if invalid type', () => {
        cardProps.card.skill_card_type = 'foo';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.children()).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render an error from the error code', () => {
        cardProps.card.skill_card_type = 'status';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Status)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});

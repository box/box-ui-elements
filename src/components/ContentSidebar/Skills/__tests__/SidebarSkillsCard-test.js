import React from 'react';
import { shallow, mount } from 'enzyme';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import SidebarSkillsCard, { SidebarSkillsCardComponent } from '../SidebarSkillsCard';
import Transcript from '../Transcript';
import Keywords from '../Keywords';
import Keyvalues from '../Keyvalues';
import Timelines from '../Timeline';

jest.mock('box-react-ui/lib/components/error-mask/ErrorMask', () => 'error-mask-mock');

describe('components/ContentSidebar/Skills/SidebarSkillsCard', () => {
    const getWrapper = (props) => shallow(<SidebarSkillsCardComponent {...props} />);

    let cardProps;

    beforeEach(() => {
        cardProps = {
            skill: {},
            onInteraction: jest.fn(),
            getPreviewer: jest.fn(),
            rootElement: jest.fn(),
            appElement: jest.fn()
        };
    });

    test('should render keywords component', () => {
        cardProps.skill.skill_card_type = 'keyword';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Keywords)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render keyvalues component', () => {
        cardProps.skill.skill_card_type = 'keyvalue';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Keyvalues)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render timelines component', () => {
        cardProps.skill.skill_card_type = 'timeline';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Timelines)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render transcript component', () => {
        cardProps.skill.skill_card_type = 'transcript';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.find(Transcript)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render nothing if invalid type', () => {
        cardProps.skill.skill_card_type = 'foo';
        const wrapper = getWrapper(cardProps);

        expect(wrapper.children()).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render an error', () => {
        const props = {
            maskError: {
                errorHeader: {
                    defaultMessage: 'foo'
                }
            }
        };
        const wrapper = mount(<SidebarSkillsCard {...props} />);

        expect(wrapper.find(ErrorMask)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});

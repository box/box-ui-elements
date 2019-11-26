import * as React from 'react';
import { shallow } from 'enzyme';
import Faces from '../Faces';

describe('elements/content-sidebar/Skills/Faces/Faces', () => {
    test('should correctly render error when no faces', () => {
        const props = {
            card: {
                duration: 100,
                entries: [],
            },
            isEditable: false,
            onSkillChange: jest.fn(),
        };

        const wrapper = shallow(<Faces {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render faces when not editable', () => {
        const props = {
            card: {
                duration: 100,
                entries: [{ text: 'foo' }, { text: 'bar' }],
            },
            isEditable: false,
            onSkillChange: jest.fn(),
        };

        const wrapper = shallow(<Faces {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render faces without removed faces', () => {
        const props = {
            card: {
                duration: 100,
                entries: [{ text: 'foo' }, { text: 'bar' }],
            },
            isEditable: false,
            onSkillChange: jest.fn(),
        };

        const wrapper = shallow(<Faces {...props} />);
        wrapper.setState({ removes: [props.card.entries[1]] });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render edit button when editable', () => {
        const props = {
            card: {
                duration: 100,
                entries: [{ text: 'foo' }, { text: 'bar' }],
            },
            isEditable: true,
            onSkillChange: jest.fn(),
        };

        const wrapper = shallow(<Faces {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render time line when face is selected', () => {
        const props = {
            card: {
                duration: 100,
                entries: [
                    { text: 'foo', appears: [{ start: 1 }] },
                    { text: 'bar', appears: [{ start: 1 }] },
                ],
            },
            isEditable: false,
            onSkillChange: jest.fn(),
        };

        const wrapper = shallow(<Faces {...props} />);
        wrapper.setState({ selected: props.card.entries[1] });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render save and cancel button when editable and editing', () => {
        const props = {
            card: {
                duration: 100,
                entries: [{ text: 'foo' }, { text: 'bar' }],
            },
            isEditable: true,
            onSkillChange: jest.fn(),
        };

        const wrapper = shallow(<Faces {...props} />);
        wrapper.setState({ isEditing: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render when isLoading is true', () => {
        const props = {
            card: {
                duration: 100,
                entries: [{ text: 'foo' }, { text: 'bar' }],
            },
            transcript: { duration: 100 },
            isEditable: true,
            onSkillChange: jest.fn(),
        };

        const wrapper = shallow(<Faces {...props} />);
        wrapper.setState({ isLoading: true });

        expect(wrapper).toMatchSnapshot();
    });
});

import * as React from 'react';
import { shallow } from 'enzyme';
import Face from '../Face';

describe('elements/content-sidebar/Skills/Face/Face', () => {
    test('should correctly render a face', () => {
        const props = {
            face: { text: 'foo', image_url: 'bar' },
            isEditing: false,
            onDelete: jest.fn(),
            onSelect: jest.fn(),
        };

        const wrapper = shallow(<Face {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a face when editing', () => {
        const props = {
            face: { text: 'foo', image_url: 'bar' },
            isEditing: true,
            onDelete: jest.fn(),
            onSelect: jest.fn(),
        };

        const wrapper = shallow(<Face {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a face when selected face is being rendered', () => {
        const face = { text: 'foo', image_url: 'bar' };
        const props = {
            face,
            selected: face,
            isEditing: false,
            onDelete: jest.fn(),
            onSelect: jest.fn(),
        };

        const wrapper = shallow(<Face {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a face when un-selected face is being rendered', () => {
        const face = { text: 'foo', image_url: 'bar' };
        const props = {
            face,
            selected: { text: 'baz', image_url: 'buz' },
            isEditing: false,
            onDelete: jest.fn(),
            onSelect: jest.fn(),
        };

        const wrapper = shallow(<Face {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

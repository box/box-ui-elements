import * as React from 'react';
import { shallow } from 'enzyme';
import IconPuzzlePiece from '../IconPuzzlePiece';

describe('icons/general/IconPuzzlePiece', () => {
    test('should correctly render default icon with default color', () => {
        const wrapper = shallow(<IconPuzzlePiece />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const wrapper = shallow(<IconPuzzlePiece color="#fcfcfc" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height and default viewBox value', () => {
        const wrapper = shallow(<IconPuzzlePiece height={16} width={16} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const wrapper = shallow(<IconPuzzlePiece title="abcde" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with custom class name', () => {
        const wrapper = shallow(<IconPuzzlePiece className="rectangular" />);
        expect(wrapper).toMatchSnapshot();
    });
});

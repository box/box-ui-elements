import * as React from 'react';
import { shallow } from 'enzyme';
import IconPuzzlePieceCircle from '../IconPuzzlePieceCircle';

describe('icons/general/IconPuzzlePieceCircle', () => {
    test('should correctly render default icon with default color', () => {
        const wrapper = shallow(<IconPuzzlePieceCircle />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const wrapper = shallow(<IconPuzzlePieceCircle color="#fcfcfc" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height and default viewBox value', () => {
        const wrapper = shallow(<IconPuzzlePieceCircle height={16} width={16} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const wrapper = shallow(<IconPuzzlePieceCircle title="abcde" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with custom class name', () => {
        const wrapper = shallow(<IconPuzzlePieceCircle className="circular" />);
        expect(wrapper).toMatchSnapshot();
    });
});

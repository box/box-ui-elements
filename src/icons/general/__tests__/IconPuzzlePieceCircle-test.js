import * as React from 'react';

import IconPuzzlePieceCircle from '../IconPuzzlePieceCircle';
import { bdlBoxBlue } from '../../../styles/variables';

describe('icons/general/IconPuzzlePieceCircle', () => {
    test('should correctly render default icon with default color', () => {
        const dimension = 28;
        const wrapper = shallow(<IconPuzzlePieceCircle />);

        expect(wrapper.hasClass('bdl-IconPuzzlePieceCircle')).toEqual(true);
        expect(wrapper.find('g').prop('fill')).toEqual('none');
        expect(wrapper.find('g').prop('stroke')).toEqual(bdlBoxBlue);
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('viewBox')).toEqual('0 0 28 28');
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const color = '#fcfcfc';
        const wrapper = shallow(<IconPuzzlePieceCircle color={color} />);

        expect(wrapper.find('g').prop('stroke')).toEqual(color);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height and default viewBox value', () => {
        const dimension = 16;
        const wrapper = shallow(<IconPuzzlePieceCircle dimension={dimension} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('viewBox')).toEqual('0 0 28 28');
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const title = 'abcde';
        const wrapper = shallow(<IconPuzzlePieceCircle title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
        expect(wrapper).toMatchSnapshot();
    });
});

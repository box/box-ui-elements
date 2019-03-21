import * as React from 'react';

import IconPuzzlePiece from '../IconPuzzlePiece';
import { silverChalice } from '../../../styles/variables';

describe('icons/general/IconPuzzlePiece', () => {
    test('should correctly render default icon with default color', () => {
        const dimension = 14;
        const wrapper = shallow(<IconPuzzlePiece />);

        expect(wrapper.hasClass('bdl-IconPuzzlePiece')).toEqual(true);
        expect(wrapper.find('path').prop('fill')).toEqual(silverChalice);
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('viewBox')).toEqual(`0 0 ${dimension} ${dimension}`);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#fcfcfc';
        const wrapper = shallow(<IconPuzzlePiece color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width, height, and viewBox value', () => {
        const dimension = 16;
        const wrapper = shallow(<IconPuzzlePiece dimension={dimension} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('viewBox')).toEqual(`0 0 ${dimension} ${dimension}`);
    });

    test('should correctly render icon with title', () => {
        const title = 'abcde';
        const wrapper = shallow(<IconPuzzlePiece title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});

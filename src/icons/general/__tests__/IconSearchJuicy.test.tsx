import * as React from 'react';
import { shallow } from 'enzyme';
import IconSearchJuicy from '../IconSearchJuicy';
import { bdlGray40 } from '../../../styles/variables';

describe('icons/general/IconSearchJuicy', () => {
    test('should correctly render default icon with default color', () => {
        const dimension = 14;
        const wrapper = shallow(<IconSearchJuicy />);

        expect(wrapper.hasClass('icon-search-juicy')).toEqual(true);
        expect(wrapper.find('path').prop('fill')).toEqual(bdlGray40);
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#fcfcfc';
        const wrapper = shallow(<IconSearchJuicy color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const dimension = 16;
        const wrapper = shallow(<IconSearchJuicy height={dimension} width={dimension} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
    });

    test('should correctly render icon with title', () => {
        const title = 'abcde';
        const wrapper = shallow(<IconSearchJuicy title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});

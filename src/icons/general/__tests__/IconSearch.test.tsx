import * as React from 'react';
import { shallow } from 'enzyme';
import IconSearch from '../IconSearch';
import { bdlGray40 } from '../../../styles/variables';

describe('icons/general/IconSearch', () => {
    test('should correctly render default icon with default color', () => {
        const dimension = 14;
        const wrapper = shallow(<IconSearch />);

        expect(wrapper.hasClass('icon-search')).toEqual(true);
        expect(wrapper.find('path').prop('fill')).toEqual(bdlGray40);
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#fcfcfc';
        const wrapper = shallow(<IconSearch color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const dimension = 16;
        const wrapper = shallow(<IconSearch height={dimension} width={dimension} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
    });

    test('should correctly render icon with title', () => {
        const title = 'abcde';
        const wrapper = shallow(<IconSearch title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});

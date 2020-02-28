import React from 'react';
import { shallow } from 'enzyme';
import IconCollectionItemLink from '../IconCollectionItemLink';

describe('icons/general/IconCollectionItemLink', () => {
    const getWrapper = (props = {}) => shallow(<IconCollectionItemLink {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconCollectionItemLink height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'task-icon';
        const wrapper = shallow(<IconCollectionItemLink title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});

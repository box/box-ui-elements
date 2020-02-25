import React from 'react';
import { shallow } from 'enzyme';
import IconToolbox from '../IconToolbox';

describe('icons/general/IconToolbox', () => {
    const getWrapper = (props = {}) => shallow(<IconToolbox {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#222',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

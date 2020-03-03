import React from 'react';
import { shallow } from 'enzyme';
import IconPrintInverted from '../IconPrintInverted';

describe('icons/general/IconPrintInverted', () => {
    const getWrapper = (props = {}) => shallow(<IconPrintInverted {...props} />);

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

import React from 'react';
import { shallow } from 'enzyme';
import IconMobileApp from '../IconMobileApp';

describe('icons/promotions/IconMobileApp', () => {
    const getWrapper = (props = {}) => shallow(<IconMobileApp {...props} />);

    test('should correctly render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render component with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#123456',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

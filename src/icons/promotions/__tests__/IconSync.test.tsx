import React from 'react';
import { shallow } from 'enzyme';
import IconSync from '../IconSync';

describe('icons/promotions/IconSync', () => {
    const getWrapper = (props = {}) => shallow(<IconSync {...props} />);

    test('should correctly render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render component with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#DEDBEF',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

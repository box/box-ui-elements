import React from 'react';
import { shallow } from 'enzyme';
import SetDefaultAppState from '../SetDefaultAppState';

describe('icons/states/SetDefaultAppState', () => {
    const getWrapper = (props = {}) => shallow(<SetDefaultAppState {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified class name', () => {
        const wrapper = getWrapper({
            className: 'test',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const wrapper = getWrapper({
            color: '#333',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const wrapper = getWrapper({
            width: 16,
            height: 17,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const wrapper = getWrapper({
            title: 'fool',
        });

        expect(wrapper).toMatchSnapshot();
    });
});

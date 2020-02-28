// @flow
import React from 'react';
import { shallow } from 'enzyme';
import UsersEmptyState from '../UsersEmptyState';

describe('icons/states/UsersEmptyState', () => {
    const getWrapper = (props = {}) => shallow(<UsersEmptyState {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper.hasClass('users-empty-state')).toBeTruthy();
    });

    test('should correctly render the icon with specified class', () => {
        const className = 'test-class';
        const wrapper = getWrapper({
            className,
        });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 20;
        const height = 15;
        const wrapper = getWrapper({
            height,
            width,
        });

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'I am the title';
        const wrapper = getWrapper({
            title,
        });

        expect(wrapper.prop('title')).toEqual(title);
    });

    test('should override color in svg when specified', () => {
        const color = '#abc';
        const wrapper = getWrapper({
            color,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

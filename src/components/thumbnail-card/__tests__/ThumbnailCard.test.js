// @flow
import * as React from 'react';

import ThumbnailCard from '../ThumbnailCard';

const getWrapper = (props = {}) =>
    shallow(<ThumbnailCard thumbnail={<div>Foo Bar!</div>} title={<div>Hello World!</div>} {...props} />);

describe('components/thumbnail-card/ThumbnailCard', () => {
    test('should render', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should use additional className', () => {
        const className = 'fooBar';
        const wrapper = getWrapper({ className });

        expect(wrapper).toMatchSnapshot();
    });

    test('should have role and tabIndex when onKeyDown prop does not exist', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('.thumbnail-card').prop('role')).toBe('button');
        expect(wrapper.find('.thumbnail-card').prop('tabIndex')).toBe(0);
    });

    test('should not have role and tabIndex when onKeyDown prop exists', () => {
        const onKeyDown = () => {};
        const wrapper = getWrapper({ onKeyDown });

        expect(wrapper.find('.thumbnail-card').prop('role')).toBe(null);
        expect(wrapper.find('.thumbnail-card').prop('tabIndex')).toBe(null);
    });

    test('should pass down actionItem, icon, and subtitle', () => {
        const icon = <img alt="icon" />;
        const subtitle = <div>Subtitle!</div>;
        const actionItem = <button type="button">Click Me</button>;
        const wrapper = getWrapper({ actionItem, icon, subtitle });

        expect(wrapper).toMatchSnapshot();
    });

    test('should apply is-highlight-applied selector if highlightOnHover is true', () => {
        const highlightOnHover = true;
        const wrapper = getWrapper({ highlightOnHover });

        const container = wrapper.find('.is-highlight-applied');
        expect(container.length).toBe(1);
    });
});

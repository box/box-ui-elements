import React from 'react';
import { shallow } from 'enzyme';
import AccessStatsEmptyState from '../AccessStatsEmptyState';

describe('icons/states/AccessStatsEmptyState', () => {
    const getWrapper = (props = {}) => shallow(<AccessStatsEmptyState {...props} />);

    test('should correctly render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render component with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 100,
            title: 'title',
            width: 200,
            color: '#333',
        });

        expect(wrapper).toMatchSnapshot();
    });
});

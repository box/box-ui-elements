import React from 'react';
import { shallow } from 'enzyme';
import ActivityFeedEmptyState from '../ActivityFeedEmptyState';

describe('icons/states/ActivityFeedEmptyState', () => {
    const getWrapper = (props = {}) => shallow(<ActivityFeedEmptyState {...props} />);

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

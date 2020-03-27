import React from 'react';
import { shallow } from 'enzyme';
import SyncEmptyState from '../SyncEmptyState';

describe('icons/states/SyncEmptyState', () => {
    const getWrapper = (props = {}) => shallow(<SyncEmptyState {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
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

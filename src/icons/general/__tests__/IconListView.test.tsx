import React from 'react';
import { shallow } from 'enzyme';

import IconListView from '../IconListView';

describe('icons/general/IconListView', () => {
    const getWrapper = (props = {}) => shallow(<IconListView {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#444',
            height: 100,
            opacity: 0.2,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

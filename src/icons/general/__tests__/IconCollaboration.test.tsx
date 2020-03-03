import React from 'react';
import { shallow } from 'enzyme';

import IconCollaboration from '../IconCollaboration';

describe('icons/general/IconCollaboration', () => {
    const getWrapper = (props = {}) => shallow(<IconCollaboration {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with additional props', () => {
        const wrapper = getWrapper({
            className: 'class',
            color: '#000',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

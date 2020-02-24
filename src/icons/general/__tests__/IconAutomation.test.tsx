import React from 'react';
import { shallow } from 'enzyme';

import IconAutomation from '../IconAutomation';

describe('icons/general/IconAutomation', () => {
    const getWrapper = (props = {}) => shallow(<IconAutomation {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#222',
            height: 150,
            title: 'title',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

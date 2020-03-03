import React from 'react';
import { shallow } from 'enzyme';

import IconExpiration from '../IconExpiration';

describe('icons/general/IconExpiration', () => {
    const getWrapper = (props = {}) => shallow(<IconExpiration {...props} />);

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

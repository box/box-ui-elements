import React from 'react';
import { shallow } from 'enzyme';

import IconMail from '../IconMail';

describe('icons/general/IconMail', () => {
    const getWrapper = (props = {}) => shallow(<IconMail {...props} />);

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

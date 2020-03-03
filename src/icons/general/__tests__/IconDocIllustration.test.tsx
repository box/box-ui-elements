import React from 'react';
import { shallow } from 'enzyme';

import IconDocIllustration from '../IconDocIllustration';

describe('icons/general/IconShield2', () => {
    const getWrapper = (props = {}) => shallow(<IconDocIllustration {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 150,
            title: 'title',
            width: 150,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

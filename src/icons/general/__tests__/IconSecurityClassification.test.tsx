import React from 'react';
import { shallow } from 'enzyme';

import IconSecurityClassification from '../IconSecurityClassification';

describe('icons/general/IconSecurityClassification', () => {
    const getWrapper = (props = {}) => shallow(<IconSecurityClassification {...props} />);

    test('should correctly render icon with default values', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with all props specified', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#987654',
            height: 100,
            strokeWidth: 1,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

import React from 'react';
import { shallow } from 'enzyme';

import IconAlertDefault from '../IconAlertDefault';

describe('icons/general/IconAlertDefault', () => {
    const getWrapper = (props = {}) => shallow(<IconAlertDefault {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with additional props', () => {
        const wrapper = getWrapper({
            className: 'class',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});

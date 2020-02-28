import React from 'react';
import { shallow } from 'enzyme';

import IconAlertBlank from '../IconAlertBlank';

describe('icons/general/IconAlertBlank', () => {
    const getWrapper = (props = {}) => shallow(<IconAlertBlank {...props} />);

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

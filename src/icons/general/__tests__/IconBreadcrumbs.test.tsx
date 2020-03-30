import React from 'react';
import { shallow } from 'enzyme';

import IconBreadcrumbArrow from '../IconBreadcrumbArrow';

describe('icons/general/IconBreadcrumbArrow', () => {
    test('should correctly render default breadcrumb arrow icon', () => {
        const wrapper = shallow(<IconBreadcrumbArrow />);

        expect(wrapper.hasClass('icon-breadcrumb-arrow')).toBe(true);
    });
});

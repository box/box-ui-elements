import React from 'react';

import ContactDatalistItem from '../ContactDatalistItem';

describe('components/contact-datalist-item/ContactDatalistItem', () => {
    test('should render a DatalistItem with name and subtitle', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" subtitle="subtitle" />);

        expect(wrapper.find('DatalistItem').length).toBe(1);
        expect(wrapper.find('.contact-name').text()).toEqual('name');
        expect(wrapper.find('.contact-sub-name').text()).toEqual('subtitle');
    });

    test('should not render a subtitle when not provided', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" />);

        expect(wrapper.find('.contact-sub-name').length).toBe(0);
    });
});

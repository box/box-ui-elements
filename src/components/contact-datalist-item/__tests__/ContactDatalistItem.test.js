import React from 'react';

import ContactDatalistItem from '../ContactDatalistItem';

describe('components/contact-datalist-item/ContactDatalistItem', () => {
    test('should render a DatalistItem with avatar, name, and subtitle', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" subtitle="subtitle" showAvatar />);

        expect(wrapper.find('Avatar').length).toBe(1);
        expect(wrapper.find('DatalistItem').length).toBe(1);
        expect(wrapper.find('.contact-name').text()).toEqual('name');
        expect(wrapper.find('.contact-sub-name').text()).toEqual('subtitle');
    });

    test('should not render a subtitle when not provided', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" />);

        expect(wrapper.find('.contact-sub-name').length).toBe(0);
    });

    test('should not render an avatar when showAvatar is disabled', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" showAvatar={false} />);

        expect(wrapper.find('Avatar').length).toBe(0);
    });
});

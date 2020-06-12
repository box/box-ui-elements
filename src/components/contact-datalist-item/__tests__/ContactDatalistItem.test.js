import React from 'react';

import ContactDatalistItem from '../ContactDatalistItem';

describe('components/contact-datalist-item/ContactDatalistItem', () => {
    test('should render a DatalistItem with name and subtitle', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" subtitle="subtitle" />);

        expect(wrapper.find('DatalistItem').length).toBe(1);
        expect(wrapper.find('.contact-name').text()).toEqual('name');
        expect(wrapper.find('.contact-sub-name').text()).toEqual('subtitle');
        expect(wrapper.find('Avatar').length).toBe(0);
    });

    test('should not render a subtitle when not provided', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" />);

        expect(wrapper.find('.contact-sub-name').length).toBe(0);
        expect(wrapper.find('Avatar').length).toBe(0);
    });

    describe('avatars with or without image URLs', () => {
        test('should show avatar component when specified', () => {
            const wrapper = shallow(<ContactDatalistItem name="name" showAvatar />);

            expect(wrapper.find('Avatar').length).toBe(1);
        });

        test('should use the avatar URL when the prop (and show avatar) are provided', () => {
            const wrapper = shallow(
                <ContactDatalistItem
                    name="name"
                    id="123"
                    showAvatar
                    getContactAvatarUrl={contact => `/test?id=${contact.id}`}
                />,
            );

            expect(wrapper.find('Avatar').length).toBe(1);
            expect(wrapper.find('Avatar').props().avatarUrl).toEqual('/test?id=123');
        });

        test('should not have the avatar URL when the id prop is missing', () => {
            const wrapper = shallow(
                <ContactDatalistItem
                    name="name"
                    showAvatar
                    getContactAvatarUrl={contact => `/test?id=${contact.id}`}
                />,
            );

            expect(wrapper.find('Avatar').length).toBe(1);
            expect(wrapper.find('Avatar').props().avatarUrl).toBeUndefined();
        });
    });
});

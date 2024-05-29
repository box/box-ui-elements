import React from 'react';
import { shallow } from 'enzyme';

import ContactDatalistItem from '../ContactDatalistItem';
import DatalistItem from '../../datalist-item';
import Avatar from '../../avatar';

import { ContactType } from '../../../features/unified-share-modal/types';

describe('components/contact-datalist-item/ContactDatalistItem', () => {
    test('should render a DatalistItem with name and subtitle', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" subtitle="subtitle" />);

        expect(wrapper.find(DatalistItem).length).toBe(1);
        expect(wrapper.find('.contact-name').text()).toEqual('name');
        expect(wrapper.find('.contact-sub-name').text()).toEqual('subtitle');
        expect(wrapper.find(Avatar).length).toBe(0);
    });

    test('should not render a subtitle when not provided', () => {
        const wrapper = shallow(<ContactDatalistItem name="name" />);

        expect(wrapper.find('.contact-sub-name').length).toBe(0);
        expect(wrapper.find(Avatar).length).toBe(0);
    });

    describe('avatars with or without image URLs', () => {
        test('should show avatar component when specified', () => {
            const wrapper = shallow(<ContactDatalistItem name="name" showAvatar />);

            expect(wrapper.find(Avatar).length).toBe(1);
        });

        test('should do nothing when getPillImageUrl returns a rejected Promise', async () => {
            const wrapper = shallow(
                <ContactDatalistItem
                    name="name"
                    id="123"
                    showAvatar
                    getPillImageUrl={() => Promise.reject(new Error())}
                />,
            );

            const instance = await wrapper.instance();
            instance.componentDidMount?.();

            wrapper.update();
            expect(wrapper.find(Avatar).length).toBe(1);
            expect(wrapper.find(Avatar).props().avatarUrl).toBeUndefined();
        });

        test.each([
            [(contact: ContactType) => `/test?id=${contact.id}`],
            [(contact: ContactType) => Promise.resolve(`/test?id=${contact.id}`)],
        ])('should use the avatar URL when the prop (and show avatar) are provided', async getContactAvatarUrl => {
            const wrapper = shallow(
                <ContactDatalistItem name="name" id="123" showAvatar getContactAvatarUrl={getContactAvatarUrl} />,
            );
            expect(wrapper.find(Avatar).length).toBe(1);
            expect(wrapper.find(Avatar).props().avatarUrl).toBeUndefined();

            const instance = await wrapper.instance();
            instance.componentDidMount?.();

            wrapper.update();
            expect(wrapper.find(Avatar).length).toBe(1);
            expect(wrapper.find(Avatar).props().avatarUrl).toEqual('/test?id=123');
        });

        test('should not have the avatar URL when the id prop is missing', () => {
            const wrapper = shallow(
                <ContactDatalistItem
                    name="name"
                    showAvatar
                    getContactAvatarUrl={contact => `/test?id=${contact.id}`}
                />,
            );

            expect(wrapper.find(Avatar).length).toBe(1);
            expect(wrapper.find(Avatar).props().avatarUrl).toBeUndefined();
        });

        test.each([['user'], [undefined], [null]])('should have avatar URL when the type prop is %s', type => {
            const contactID = '123';
            const getContactAvatarUrlMock = jest
                .fn()
                .mockImplementation(() => Promise.resolve(`/test?id=${contactID}`));
            const wrapper = shallow(
                <ContactDatalistItem
                    name="name"
                    id={contactID}
                    type={type}
                    showAvatar
                    getContactAvatarUrl={getContactAvatarUrlMock}
                />,
            );
            expect(wrapper.state('avatarUrl')).toBe(undefined);
            const instance = wrapper.instance();

            if (instance.componentDidMount) {
                instance.componentDidMount();
            }

            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find('LabelPillIcon').length).toBe(2);
                expect(wrapper.find('LabelPillIcon[avatarUrl]').length).toBe(1);
                expect(getContactAvatarUrlMock).toHaveBeenCalledWith({ id: contactID, type });
            });
        });
    });
});

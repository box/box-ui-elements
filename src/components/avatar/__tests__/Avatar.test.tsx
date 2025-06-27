import React, { act } from 'react';
import { shallow, mount } from 'enzyme';
import { IntlShape } from 'react-intl';
import { AvatarBase as Avatar } from '../Avatar';
import AvatarImage from '../AvatarImage';

const testDataURI = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('components/avatar/Avatar', () => {
    const intl = {
        formatMessage: jest.fn().mockImplementation(message => message.defaultMessage) as unknown,
    } as IntlShape;

    const getWrapper = (props = {}) => shallow(<Avatar intl={intl} {...props} />);

    test('should render an avatar container', () => {
        const wrapper = getWrapper({ className: 'test-avatar', name: 'box' });
        expect(wrapper.is('.avatar.test-avatar')).toBe(true);
    });

    test('should add small size class based on prop', () => {
        const wrapper = getWrapper({ name: 'box', size: 'small' });
        expect(wrapper.is('.avatar.avatar--small')).toBe(true);
    });

    test('should add large size class based on prop', () => {
        const wrapper = getWrapper({ name: 'box', size: 'large' });
        expect(wrapper.is('.avatar.avatar--large')).toBe(true);
    });

    test('should not allow unknown sizes', () => {
        const wrapper = getWrapper({ name: 'box', size: 'WRONG' });
        expect(wrapper.is('.avatar.avatar--WRONG')).toBe(false);
    });

    test('should render an AvatarImage when avatarUrl is passed in', () => {
        const wrapper = getWrapper({ avatarUrl: testDataURI });
        const avatarImage = wrapper.find(AvatarImage);
        expect(avatarImage.length).toBe(1);
        expect(avatarImage.prop('url')).toBe(testDataURI);
    });

    test('should render an AvatarInitials when name is passed in', () => {
        const wrapper = getWrapper({ id: '1', name: 'hello world' });
        const avatarInitials = wrapper.find('AvatarInitials');
        expect(avatarInitials.length).toBe(1);
        expect(avatarInitials.prop('name')).toBe('hello world');
        expect(avatarInitials.prop('id')).toBe('1');
    });

    test('should render an UnknownUserAvatar when no params are passed', () => {
        const wrapper = getWrapper();
        const avatarIcon = wrapper.find('UnknownUserAvatar');
        expect(avatarIcon.length).toBe(1);
        expect(avatarIcon.prop('className')).toBe('avatar-icon');
    });

    test('should render an UnknownUserAvatar when empty name and url are passed', () => {
        const wrapper = getWrapper({ avatarUrl: null, id: 2, name: '' });
        const avatarIcon = wrapper.find('UnknownUserAvatar');
        expect(avatarIcon.length).toBe(1);
        expect(avatarIcon.prop('className')).toBe('avatar-icon');
    });

    test('should fall back to AvatarInitials when there is an error in AvatarImage', () => {
        const wrapper = getWrapper({ avatarUrl: 'http://foo.bar/baz123_invalid', id: '1', name: 'hello world' });

        const avatarImage = wrapper.find(AvatarImage);
        const onError = avatarImage.prop('onError') as Function;
        onError();

        const avatarInitials = wrapper.find('AvatarInitials');
        expect(avatarInitials.length).toEqual(1);
    });

    test('should show external user icon when isExternal and shouldShowExternal are passed', () => {
        const externalWrapper = getWrapper({
            id: '2',
            name: 'External User 1',
            isExternal: true,
            shouldShowExternal: true,
        });
        const nonExternalWrapper = getWrapper({ id: '2', name: 'External User 2', isExternal: true });

        expect(externalWrapper.is('.avatar.avatar--isExternal')).toBe(true);
        expect(nonExternalWrapper.is('.avatar.avatar--isExternal')).toBe(false);
    });

    test('should reset error state when new avatarUrl is passed in', () => {
        const props = {
            id: '1',
            name: 'hello world',
            avatarUrl: 'http://foo.bar/baz123_invalid',
        };

        const wrapper = mount(<Avatar intl={intl} {...props} />);
        expect(wrapper.find(AvatarImage).length).toBe(1);

        act(() => {
            const avatarImage = wrapper.find(AvatarImage);
            const onError = avatarImage.prop('onError') as Function;
            onError();
        });
        wrapper.update();
        expect(wrapper.find(AvatarImage).length).toBe(0);
        expect(wrapper.find('AvatarInitials').length).toBe(1);

        act(() => {
            wrapper.setProps({
                ...props,
                avatarUrl: 'http://foo.bar/baz123_invalid_new',
            });
        });
        wrapper.update();
        expect(wrapper.find(AvatarImage).length).toBe(1);
    });
});

import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Avatar from '../Avatar';
import AvatarImage from '../AvatarImage';

const testDataURI = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('components/avatar/Avatar', () => {
    test('should render an avatar container', () => {
        const wrapper = shallow(<Avatar className="test-avatar" name="hello" />);
        expect(wrapper.is('.avatar.test-avatar')).toBe(true);
    });

    test('should add small size class based on prop', () => {
        const wrapper = shallow(<Avatar name="hello" size="small" />);
        expect(wrapper.is('.avatar.avatar--small')).toBe(true);
    });

    test('should add large size class based on prop', () => {
        const wrapper = shallow(<Avatar name="hello" size="large" />);
        expect(wrapper.is('.avatar.avatar--large')).toBe(true);
    });

    test('should not allow unknown sizes', () => {
        // eslint-disable-next-line
        // @ts-ignore testing a wrong value for the size prop
        const wrapper = shallow(<Avatar name="hello" size="WRONG" />);
        expect(wrapper.is('.avatar.avatar--WRONG')).toBe(false);
    });

    test('should render an AvatarImage when avatarUrl is passed in', () => {
        const wrapper = shallow(<Avatar avatarUrl={testDataURI} />);
        const avatarImage = wrapper.find(AvatarImage);
        expect(avatarImage.length).toEqual(1);
        expect(avatarImage.prop('url')).toEqual(testDataURI);
    });

    test('should render an AvatarInitials when name is passed in', () => {
        const wrapper = shallow(<Avatar id="1" name="hello world" />);
        const avatarInitials = wrapper.find('AvatarInitials');
        expect(avatarInitials.length).toEqual(1);
        expect(avatarInitials.prop('name')).toEqual('hello world');
        expect(avatarInitials.prop('id')).toEqual('1');
    });

    test('should render an UnknownUserAvatar when no params are passed', () => {
        const wrapper = shallow(<Avatar />);
        const avatarIcon = wrapper.find('UnknownUserAvatar');
        expect(avatarIcon.length).toEqual(1);
        expect(avatarIcon.prop('className')).toEqual('avatar-icon');
    });

    test('should render an UnknownUserAvatar when empty name and url are passed', () => {
        const wrapper = shallow(<Avatar avatarUrl={null} id={2} name="" />);
        const avatarIcon = wrapper.find('UnknownUserAvatar');
        expect(avatarIcon.length).toEqual(1);
        expect(avatarIcon.prop('className')).toEqual('avatar-icon');
    });

    test('should fall back to AvatarInitials when there is an error in AvatarImage', () => {
        const wrapper = shallow(<Avatar avatarUrl="http://foo.bar/baz123_invalid" id="1" name="hello world" />);

        const avatarImage = wrapper.find(AvatarImage);
        const onError = avatarImage.prop('onError') as Function;
        onError();

        const avatarInitials = wrapper.find('AvatarInitials');
        expect(avatarInitials.length).toEqual(1);
    });

    test('should show external user icon only when requested', () => {
        const externalWrapper = shallow(<Avatar id="2" name="External User 1" isExternal shouldShowExternal />);
        const nonExternalWrapper = shallow(<Avatar id="2" name="External User 2" isExternal />);

        expect(externalWrapper.is('.avatar.avatar--isExternal')).toBe(true);
        expect(nonExternalWrapper.is('.avatar.avatar--isExternal')).toBe(false);
    });

    test('should reset error state when new avatarUrl is passed in', () => {
        const props = {
            id: '1',
            name: 'hello world',
            avatarUrl: 'http://foo.bar/baz123_invalid',
        };

        const wrapper = mount(<Avatar {...props} />);
        expect(wrapper.find(AvatarImage).length).toEqual(1);

        act(() => {
            const avatarImage = wrapper.find(AvatarImage);
            const onError = avatarImage.prop('onError') as Function;
            onError();
        });
        wrapper.update();
        expect(wrapper.find(AvatarImage).length).toEqual(0);
        expect(wrapper.find('AvatarInitials').length).toEqual(1);

        act(() => {
            wrapper.setProps({
                ...props,
                avatarUrl: 'http://foo.bar/baz123_invalid_new',
            });
        });
        wrapper.update();
        expect(wrapper.find(AvatarImage).length).toEqual(1);
    });
});

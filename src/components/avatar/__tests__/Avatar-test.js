import React from 'react';

import Avatar from '../Avatar';

const testDataURI = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('components/avatar/Avatar', () => {
    test('should render an avatar container', () => {
        const wrapper = shallow(<Avatar className="test-avatar" name="hello" />);
        expect(wrapper.is('span.avatar.test-avatar')).toBeTruthy();
    });

    test('should render an AvatarImage when avatarUrl is passed in', () => {
        const wrapper = shallow(<Avatar avatarUrl={testDataURI} />);
        const avatarImage = wrapper.find('AvatarImage');
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
        const wrapper = shallow(<Avatar id={2} name="" avatarUrl={null} />);
        const avatarIcon = wrapper.find('UnknownUserAvatar');
        expect(avatarIcon.length).toEqual(1);
        expect(avatarIcon.prop('className')).toEqual('avatar-icon');
    });

    test('should fall back to AvatarInitials when there is an error in AvatarImage', () => {
        const wrapper = shallow(<Avatar id="1" name="hello world" avatarUrl="http://foo.bar/baz123_invalid" />);

        wrapper.instance().onImageError();
        expect(wrapper.state('hasImageErrored')).toEqual(true);
        wrapper.update();
        const avatarInitials = wrapper.find('AvatarInitials');
        expect(avatarInitials.length).toEqual(1);
    });

    test('should reset error state when new avatarUrl is passed in', () => {
        const props = {
            id: '1',
            name: 'hello world',
            avatarUrl: 'http://foo.bar/baz123_invalid',
        };

        const wrapper = shallow(<Avatar {...props} />);

        wrapper.instance().onImageError();
        expect(wrapper.state('hasImageErrored')).toEqual(true);

        wrapper.setProps({
            ...props,
            avatarUrl: 'http://foo.bar/baz123_invalid_new',
        });
        wrapper.update();

        expect(wrapper.state('hasImageErrored')).toEqual(false);
        expect(wrapper.find('AvatarImage').length).toEqual(1);
    });
});

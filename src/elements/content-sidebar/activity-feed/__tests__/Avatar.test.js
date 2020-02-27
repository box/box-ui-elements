import React from 'react';
import { shallow } from 'enzyme';
import Avatar from '../Avatar';

describe('elements/content-sidebar/ActivityFeed/Avatar', () => {
    const user = {
        id: 'foo',
        login: 'foo@bar.com',
        name: 'foo bar',
        type: 'user',
    };
    const getAvatarUrl = jest.fn().mockReturnValue(Promise.resolve('foo'));

    const getWrapper = props => shallow(<Avatar {...props} />);

    test('should render nothing if no avatarUrl in state and getAvatarUrl method was passed', () => {
        expect(
            getWrapper({ user, getAvatarUrl })
                .dive()
                .find('Avatar')
                .exists(),
        ).toBe(false);
        expect(getAvatarUrl).toBeCalledWith(user.id);
    });

    test('should render avatar with initials if getAvatarUrl is not passed in and no avatarUrl is in state', () => {
        expect(
            getWrapper({ user })
                .find('AvatarInitials')
                .exists(),
        ).toBe(false);
        expect(getAvatarUrl).not.toBeCalledWith(user.id);
    });

    test('should render the avatar with an avatarUrl', () => {
        const wrapper = getWrapper({ user, getAvatarUrl });
        wrapper.instance().getAvatarUrlHandler('foo');
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.instance().isMounted).toBe(true);
    });

    test('should set the avatarUrl state by calling getAvatarUrl function prop', () => {
        const wrapper = getWrapper({ user, getAvatarUrl });
        expect(wrapper.state('avatarUrl')).toBe(null);
        wrapper
            .instance()
            .getAvatarUrl()
            .then(() => {
                expect(wrapper.state('avatarUrl')).toBe('foo');
            });
    });

    test('should set the avatarUrl state from user prop', async () => {
        const completeUser = { ...user, avatar_url: 'bar' };
        const wrapper = getWrapper({ user: completeUser });
        expect(wrapper.state('avatarUrl')).toBe(null);
        await wrapper.instance().getAvatarUrl();
        expect(wrapper.state('avatarUrl')).toBe('bar');
        expect(getAvatarUrl).not.toBeCalledWith(user.id);
    });

    test('should set the avatarUrl state from user prop', async () => {
        const wrapper = getWrapper({ user });
        expect(wrapper.state('avatarUrl')).toBe(null);
        await wrapper.instance().getAvatarUrl();
        wrapper.update();
        expect(getAvatarUrl).not.toBeCalledWith(user.id);
        expect(wrapper.dive()).toMatchSnapshot();
    });
});

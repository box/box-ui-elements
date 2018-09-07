import React from 'react';
import { shallow } from 'enzyme';
import Avatar from '../Avatar';

describe('components/ContentSidebar/ActivityFeed/Avatar', () => {
    const user = {
        id: 'foo',
        login: 'foo@bar.com',
        name: 'foo bar',
        type: 'user',
    };
    const getAvatarUrl = jest.fn().mockReturnValue(Promise.resolve('foo'));

    const getWrapper = props => shallow(<Avatar {...props} />);

    test('should render nothing if no avatarUrl in state', () => {
        expect(
            getWrapper({ user, getAvatarUrl })
                .find('Avatar')
                .exists(),
        ).toBe(false);
        expect(getAvatarUrl).toBeCalledWith(user.id);
    });

    test('should render the avatar with an avatarUrl', () => {
        const wrapper = getWrapper({ user, getAvatarUrl });
        wrapper.instance().getAvatarUrlHandler('foo');
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });

    test('should set the avatarUrl state', () => {
        const wrapper = getWrapper({ user, getAvatarUrl });
        expect(wrapper.state('avatarUrl')).toBe(null);
        wrapper
            .instance()
            .getAvatarUrl()
            .then(() => {
                expect(wrapper.state('avatarUrl')).toBe('foo');
            });
    });
});

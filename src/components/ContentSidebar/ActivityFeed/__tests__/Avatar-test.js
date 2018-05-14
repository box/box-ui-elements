import React from 'react';
import { shallow } from 'enzyme';
import Avatar from '../Avatar';

describe('components/ContentSidebar/ActivityFeed/Avatar', () => {
    const user = {
        id: 'foo',
        login: 'foo@bar.com',
        name: 'foo bar',
        type: 'user'
    };

    const getWrapper = (props) => shallow(<Avatar {...props} />);

    test('should render the avatar with an avatarUrl', () => {
        const getAvatarUrl = jest.fn().mockReturnValue(Promise.resolve('foo'));

        expect(getWrapper({ user, getAvatarUrl })).toMatchSnapshot();
        expect(getAvatarUrl).toBeCalledWith(user.id);
    });
});

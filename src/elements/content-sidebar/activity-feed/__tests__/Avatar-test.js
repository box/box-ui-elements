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

    const getWrapper = props => shallow(<Avatar {...props} />);

    test('should pass isPending prop to wrapped Avatar getAvatarUrl prop is passed', () => {
        const getAvatarUrl = jest.fn().mockResolvedValue('avatar.jpg');
        const wrapper = getWrapper({ user, getAvatarUrl });
        const wrappedAvatar = wrapper.find('Avatar').first();
        expect(wrappedAvatar.props()).toEqual(expect.objectContaining({ isPending: true }));
        expect(wrapper).toMatchInlineSnapshot(`
<Avatar
  avatarUrl={null}
  id="foo"
  isPending={true}
  name="foo bar"
/>
`);
    });

    test('should call getAvatarUrl prop with user id and pass result to child', async () => {
        const getAvatarUrl = jest.fn().mockResolvedValue('avatar.jpg');
        const wrapper = getWrapper({ user, getAvatarUrl });
        expect(getAvatarUrl).toBeCalledWith(user.id);
        // wait a tick for async, use react-dom/test-utils/act in future versions
        await new Promise(r => setImmediate(r));
        const wrappedAvatar = wrapper.find('Avatar').first();
        expect(wrappedAvatar.props()).toEqual(expect.objectContaining({ isPending: false, avatarUrl: 'avatar.jpg' }));
        expect(wrapper).toMatchInlineSnapshot(`
<Avatar
  avatarUrl="avatar.jpg"
  id="foo"
  isPending={false}
  name="foo bar"
/>
`);
    });

    test('should render avatar with initials if getAvatarUrl is not passed in and user prop does not have avatar_url', () => {
        const wrapper = getWrapper({ user });
        expect(wrapper.dive().find('AvatarInitials')).toHaveLength(1);
    });

    test('should use the avatar_url from user prop if set', async () => {
        const getAvatarUrl = jest.fn().mockResolvedValue('avatar.jpg');
        const completeUser = { ...user, avatar_url: 'preset.jpg' };
        const wrapper = getWrapper({ user: completeUser });
        expect(wrapper.state('avatarUrl')).toBe('preset.jpg');
        expect(wrapper.dive().find('AvatarImage')).toHaveLength(1);

        // in this case the component has all the data it needs and
        // should avoid doing anything async on mount, but wait a tick to confirm
        await new Promise(r => setImmediate(r));
        expect(getAvatarUrl).not.toHaveBeenCalled();
    });
});

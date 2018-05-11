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
        expect(getWrapper({ user })).toMatchSnapshot();
    });
});

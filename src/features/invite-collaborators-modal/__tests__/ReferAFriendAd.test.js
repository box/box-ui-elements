import React from 'react';

import ReferAFriendAd from '../ReferAFriendAd';

describe('features/invite-collaborators-modal/ReferAFriendAd', () => {
    const getWrapper = () => shallow(<ReferAFriendAd />);

    describe('render()', () => {
        test('should render correctly', () => {
            expect(getWrapper()).toMatchSnapshot();
        });
    });
});

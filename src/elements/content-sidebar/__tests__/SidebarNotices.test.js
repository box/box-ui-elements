import React from 'react';
import { shallow } from 'enzyme';
import SharedLinkExpirationNotice from '../../../features/item-details/SharedLinkExpirationNotice';
import ItemExpirationNotice from '../../../features/item-details/ItemExpirationNotice';
import SidebarNotices from '../SidebarNotices';

describe('elements/content-sidebar/SidebarNotices', () => {
    describe('render()', () => {
        const getWrapper = props => shallow(<SidebarNotices {...props} />);

        test('should render an item expiration if present', () => {
            const props = {
                file: {
                    expires_at: '2018-04-25T23:59:00-07:00',
                    shared_link: {
                        url: 'https://www.foo.com',
                    },
                },
            };

            const wrapper = getWrapper(props);

            expect(wrapper.find(ItemExpirationNotice)).toHaveLength(1);
            expect(wrapper.find(SharedLinkExpirationNotice)).toHaveLength(0);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a shared link expiration if present', () => {
            const props = {
                file: {
                    shared_link: {
                        unshared_at: '2018-04-25T23:59:00-07:00',
                    },
                },
            };
            const wrapper = getWrapper(props);

            expect(wrapper.find(SharedLinkExpirationNotice)).toHaveLength(1);
            expect(wrapper.find(ItemExpirationNotice)).toHaveLength(0);
            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render the empty state', () => {
            const wrapper = getWrapper({});
            expect(wrapper).toMatchSnapshot();
        });
    });
});

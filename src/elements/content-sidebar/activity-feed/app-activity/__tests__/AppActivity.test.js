import * as React from 'react';
import { shallow, mount } from 'enzyme';

import AppActivity from '../AppActivity';
import Media from '../../../../../components/media';
import { Link } from '../../../../../components/link';

describe('elements/content-sidebar/ActivityFeed/app-activity/AppActivity', () => {
    const fakeActivityTemplate = {
        id: 'template_12345',
    };
    const fakeApp = {
        id: 'app_12345',
        icon_url: 'foo/bar/baz.jpg',
        name: 'My Application',
    };
    const fakeUser = {
        id: 'user_1',
    };
    const fakeAppActivity = {
        activity_template: fakeActivityTemplate,
        app: fakeApp,
        created_at: '2019-03-07T20:12:49.223Z',
        created_by: fakeUser,
        id: 'activity_12345',
        rendered_text: 'You did something from <a data-resin-target="foo" data-resin-action="bar" >This App</a>',
    };
    const render = (props = {}) =>
        shallow(<AppActivity isPending={false} onDelete={jest.fn()} {...fakeAppActivity} {...props} />).dive();

    test('should correctly render an app activity item', () => {
        const currentUser = {
            ...fakeUser,
        };

        expect(
            render({
                currentUser,
                permissions: {
                    can_delete: true,
                },
            }),
        ).toMatchSnapshot();
    });

    test('should render as pending if isPending flag passed in', () => {
        const currentUser = {
            ...fakeUser,
        };
        const wrapper = render({
            currentUser,
            isPending: true,
            permissions: {
                can_delete: true,
            },
        });

        expect(wrapper.find(Media).hasClass('bcs-is-pending')).toBe(true);
    });

    test('should render as pending if an error occurred', () => {
        const currentUser = {
            ...fakeUser,
        };
        const wrapper = render({
            currentUser,
            error: {},
            permissions: {
                can_delete: true,
            },
        });

        expect(wrapper.find(Media).hasClass('bcs-is-pending')).toBe(true);
    });

    test('should show the overflow menu if the current user is the one who made the activity', () => {
        const wrapper = mount(
            <AppActivity
                isPending={false}
                onDelete={jest.fn()}
                {...fakeAppActivity}
                currentUser={{ ...fakeUser }}
                permissions={{ can_delete: false }}
            />,
        );

        expect(wrapper.find('button.bdl-Media-menu').exists()).toBe(true);
    });

    test('should show the overflow menu if a different user, with the correct permissions', () => {
        const wrapper = mount(
            <AppActivity
                isPending={false}
                onDelete={jest.fn()}
                {...fakeAppActivity}
                currentUser={{ id: 'someone_else' }}
                permissions={{ can_delete: true }}
            />,
        );

        expect(wrapper.find('button.bdl-Media-menu').exists()).toBe(true);
    });

    test('should show the overflow menu if pending', () => {
        const wrapper = render({
            currentUser: {
                id: 'someone_else',
            },
            permissions: {
                can_delete: true,
            },
            isPending: true,
        });

        expect(wrapper.exists(Media.Menu)).toBe(false);
    });

    test('should show the overflow menu if missing permissions and a different user', () => {
        const wrapper = render({
            currentUser: {
                id: 'someone_else',
            },
            permissions: {
                can_delete: false,
            },
        });

        expect(wrapper.exists(Media.Menu)).toBe(false);
    });

    test('should render app activity links and pass through any resin attributes', () => {
        const action = 'my_action';
        const target = 'my_target';
        const wrapper = render({
            currentUser: {
                id: 'someone_else',
            },
            rendered_text: `You did shared via <a data-resin-target="${target}" data-resin-action="${action}">Box</a>`,
        });
        const link = wrapper.find(Link);

        expect(link.exists()).toBe(true);
        expect(link.prop('data-resin-action')).toEqual(action);
        expect(link.prop('data-resin-target')).toEqual(target);
        expect(wrapper.exists('a')).toBe(false);
    });
});

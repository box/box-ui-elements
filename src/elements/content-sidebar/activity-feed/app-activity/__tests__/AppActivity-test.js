import * as React from 'react';
import { shallow } from 'enzyme';

import AppActivity from '../AppActivity';

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
            permissions: {
                can_delete: true,
            },
            isPending: true,
        });
        const activity = wrapper.find('.bcs-app-activity');

        expect(activity.hasClass('bcs-is-pending')).toBe(true);
    });

    test('should render as pending if an error occurred', () => {
        const currentUser = {
            ...fakeUser,
        };

        const wrapper = render({
            currentUser,
            permissions: {
                can_delete: true,
            },
            error: {},
        });
        const activity = wrapper.find('.bcs-app-activity');

        expect(activity.hasClass('bcs-is-pending')).toBe(true);
    });

    test('should render the InlineDelete component if the current user is the one who made the activity', () => {
        const currentUser = {
            ...fakeUser,
        };

        const wrapper = render({
            currentUser,
        });
        const inlineDelete = wrapper.find('InlineDelete');

        expect(inlineDelete.exists()).toBe(true);
    });

    test('should render the InlineDelete component if a different user, with the correct permissions', () => {
        const wrapper = render({
            currentUser: {
                id: 'someone_else',
            },
            permissions: {
                can_delete: true,
            },
        });
        const inlineDelete = wrapper.find('InlineDelete');

        expect(inlineDelete.exists()).toBe(true);
    });

    test('should not render InlineDelete component if pending', () => {
        const wrapper = render({
            currentUser: {
                id: 'someone_else',
            },
            permissions: {
                can_delete: true,
            },
            isPending: true,
        });
        const inlineDelete = wrapper.find('InlineDelete');

        expect(inlineDelete.exists()).toBe(false);
    });

    test('should not render InlineDelete component if missing permissions and a different user', () => {
        const wrapper = render({
            currentUser: {
                id: 'someone_else',
            },
            permissions: {
                can_delete: false,
            },
        });
        const inlineDelete = wrapper.find('InlineDelete');

        expect(inlineDelete.exists()).toBe(false);
    });

    test('should render Link component in place of anchor tags in rendered_text', () => {
        const rendered_text =
            'You did shared via <a data-resin-target="my_target" data-resin-action="my_action" >Box</a>';

        const wrapper = render({
            currentUser: {
                id: 'someone_else',
            },
            rendered_text,
        });

        const link = wrapper.find('Link');
        const anchor = wrapper.find('a');

        expect(link.exists()).toBe(true);
        expect(anchor.exists()).toBe(false);
    });

    test('should pass through resin tags from anchors to Link component', () => {
        const target = 'my_target';
        const action = 'my_action';
        const rendered_text = `You did shared via <a data-resin-target="${target}" data-resin-action="${action}" >Box</a>`;

        const wrapper = render({
            currentUser: {
                id: 'someone_else',
            },
            rendered_text,
        });

        const link = wrapper.find('Link');

        expect(link.prop('data-resin-target')).toEqual(target);
        expect(link.prop('data-resin-action')).toEqual(action);
    });
});

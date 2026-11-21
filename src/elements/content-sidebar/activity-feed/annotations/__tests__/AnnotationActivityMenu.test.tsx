import * as React from 'react';
import { shallow } from 'enzyme';

import AnnotationActivityMenu from '../AnnotationActivityMenu';
import { FeedItemStatus } from '../../../../../common/types/feed';

describe('elements/content-sidebar/ActivityFeed/annotations/AnnotationActivityMenu', () => {
    const defaults = {
        id: '123',
        onDelete: jest.fn(),
        onEdit: jest.fn(),
        onMenuClose: jest.fn(),
        onMenuOpen: jest.fn(),
        onStatusChange: jest.fn(),
    };

    const getWrapper = (props = {}) => shallow(<AnnotationActivityMenu {...defaults} {...props} />);

    test.each`
        permissions             | showDelete
        ${{ canDelete: true }}  | ${true}
        ${{ canDelete: false }} | ${false}
        ${{ canDelete: false }} | ${false}
        ${{ canDelete: false }} | ${false}
    `(
        `for an activity with permissions $permissions and onEdit ($onEdit), should showDelete: $showDelete, showEdit: $showEdit`,
        ({ permissions, showDelete }) => {
            const wrapper = getWrapper({ ...permissions });

            expect(wrapper.find('[data-testid="delete-annotation-activity"]').length).toEqual(showDelete ? 1 : 0);
        },
    );

    test('should render the edit annotation activity menu item if canEdit is true', () => {
        const wrapper = getWrapper({ canEdit: true });

        expect(wrapper.exists('[data-testid="edit-annotation-activity"]')).toBe(true);
    });

    test('should render the resolve annotation activity menu item if canResolve is true for unresolved item', () => {
        const wrapper = getWrapper({ canResolve: true, status: 'open' as FeedItemStatus });

        expect(wrapper.exists('[data-testid="resolve-annotation-activity"]')).toBe(true);
    });

    test('should render the unresolve annotation activity menu item if canResolve is true for resolved item', () => {
        const wrapper = getWrapper({ canResolve: true, status: 'resolved' as FeedItemStatus });

        expect(wrapper.exists('[data-testid="unresolve-annotation-activity"]')).toBe(true);
    });

    test('should render resin tags', () => {
        const wrapper = getWrapper({
            canDelete: true,
            canEdit: true,
            canResolve: true,
            status: 'open' as FeedItemStatus,
        });

        expect(wrapper.find("[data-testid='delete-annotation-activity']").props()).toMatchObject({
            'data-resin-itemid': '123',
            'data-resin-target': 'activityfeed-annotation-delete',
        });

        expect(wrapper.find("[data-testid='edit-annotation-activity']").props()).toMatchObject({
            'data-resin-itemid': '123',
            'data-resin-target': 'activityfeed-annotation-edit',
        });

        expect(wrapper.find("[data-testid='resolve-annotation-activity']").props()).toMatchObject({
            'data-resin-itemid': '123',
            'data-resin-target': 'activityfeed-annotation-resolve',
        });
    });

    test('should render resin tags for unresolve activity', () => {
        const wrapper = getWrapper({
            canResolve: true,
            status: 'resolved' as FeedItemStatus,
        });

        expect(wrapper.find("[data-testid='unresolve-annotation-activity']").props()).toMatchObject({
            'data-resin-itemid': '123',
            'data-resin-target': 'activityfeed-annotation-unresolve',
        });
    });
});

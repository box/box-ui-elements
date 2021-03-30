import * as React from 'react';
import { mount, shallow } from 'enzyme';

import AnnotationActivityMenu from '../AnnotationActivityMenu';
import Media from '../../../../../components/media';

describe('elements/content-sidebar/ActivityFeed/annotations/AnnotationActivityMenu', () => {
    const defaults = {
        id: '123',
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

    test('should show the delete confirm menu when confirming delete', () => {
        const wrapper = getWrapper({ canDelete: true });
        const deleteButton = wrapper.find('MenuItem').prop('onClick');

        deleteButton();

        expect(wrapper.find('DeleteConfirmation').length).toEqual(1);
    });

    test('should render resin tags', () => {
        const wrapper = getWrapper({ canDelete: true, canEdit: true });

        expect(wrapper.find("[data-testid='delete-annotation-activity']").props()).toMatchObject({
            'data-resin-itemid': '123',
            'data-resin-target': 'activityfeed-annotation-delete',
        });

        expect(wrapper.find("[data-testid='edit-annotation-activity']").props()).toMatchObject({
            'data-resin-itemid': '123',
            'data-resin-target': 'activityfeed-annotation-edit',
        });
    });

    describe('menu open and close callbacks', () => {
        const getDefaults = () => ({
            canDelete: true,
            canEdit: true,
            id: '123',
            onMenuClose: jest.fn(),
            onMenuOpen: jest.fn(),
        });

        const getMountedWrapper = (props = {}) => mount(<AnnotationActivityMenu {...getDefaults()} {...props} />);

        test('should call onMenuOpen and onMenuClose when the menu button is clicked', () => {
            const onMenuClose = jest.fn();
            const onMenuOpen = jest.fn();
            const wrapper = getMountedWrapper({ onMenuClose, onMenuOpen });

            wrapper.find(Media.Menu).simulate('click');

            expect(onMenuOpen).toHaveBeenCalledTimes(1);
            expect(onMenuClose).toHaveBeenCalledTimes(0);

            wrapper.find(Media.Menu).simulate('click');

            expect(onMenuOpen).toHaveBeenCalledTimes(1);
            expect(onMenuClose).toHaveBeenCalledTimes(1);
        });

        test('should call onMenuOpen and onMenuClose when a menu item is selected', () => {
            const onMenuClose = jest.fn();
            const onMenuOpen = jest.fn();
            const wrapper = getMountedWrapper({ onMenuClose, onMenuOpen });

            wrapper.find(Media.Menu).simulate('click');

            expect(onMenuOpen).toHaveBeenCalledTimes(1);
            expect(onMenuClose).toHaveBeenCalledTimes(0);

            wrapper.find('MenuItem[data-testid="edit-annotation-activity"]').simulate('click');

            expect(onMenuOpen).toHaveBeenCalledTimes(1);
            expect(onMenuClose).toHaveBeenCalledTimes(1);
        });

        test('should not call onMenuClose when the delete confirmation appears', () => {
            const onMenuClose = jest.fn();
            const onMenuOpen = jest.fn();
            const wrapper = getMountedWrapper({ onMenuClose, onMenuOpen });

            wrapper.find(Media.Menu).simulate('click');

            expect(onMenuOpen).toHaveBeenCalledTimes(1);
            expect(onMenuClose).toHaveBeenCalledTimes(0);

            wrapper.find('MenuItem[data-testid="delete-annotation-activity"]').simulate('click');

            expect(onMenuOpen).toHaveBeenCalledTimes(1);
            expect(onMenuClose).toHaveBeenCalledTimes(0);

            wrapper.find('Button[data-resin-target="activityfeed-delete-cancel"]').simulate('click');

            expect(onMenuOpen).toHaveBeenCalledTimes(1);
            expect(onMenuClose).toHaveBeenCalledTimes(1);
        });
    });
});

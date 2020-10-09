import * as React from 'react';
import { shallow } from 'enzyme';

import AnnotationActivityMenu from '../AnnotationActivityMenu';

describe('elements/content-sidebar/ActivityFeed/annotations/AnnotationActivityMenu', () => {
    const getWrapper = (props = {}) => shallow(<AnnotationActivityMenu id="123" {...props} />);

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

        expect(wrapper.find('[data-testid="edit-annotation-activity"]').length).toEqual(1);
    });

    test('should show the delete confirm menu when confirming delete', () => {
        const wrapper = getWrapper({ canDelete: true });
        const deleteButton = wrapper.find('MenuItem').prop('onClick');

        deleteButton();

        expect(wrapper.find('DeleteConfirmation').length).toEqual(1);
    });

    test.each`
        canDelete | canEdit  | dataTestId                      | dataResinTarget
        ${true}   | ${false} | ${'delete-annotation-activity'} | ${'activityfeed-annotation-delete'}
        ${false}  | ${true}  | ${'edit-annotation-activity'}   | ${'activityfeed-annotation-edit'}
    `('should render resin tags', ({ canDelete, canEdit, dataResinTarget, dataTestId }) => {
        const wrapper = getWrapper({ canDelete, canEdit });

        expect(wrapper.find(`[data-testid="${dataTestId}"]`).props()).toMatchObject({
            'data-resin-itemid': '123',
            'data-resin-target': dataResinTarget,
        });
    });
});

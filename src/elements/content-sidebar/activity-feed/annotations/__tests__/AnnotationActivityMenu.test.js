import * as React from 'react';
import { shallow } from 'enzyme';

import AnnotationActivityMenu from '../AnnotationActivityMenu';

describe('elements/content-sidebar/ActivityFeed/annotations/AnnotationActivityMenu', () => {
    const getWrapper = (props = {}) => shallow(<AnnotationActivityMenu {...props} />);

    test.each`
        permissions                             | showDelete | showEdit
        ${{ canDelete: true, canEdit: false }}  | ${true}    | ${false}
        ${{ canDelete: false, canEdit: true }}  | ${false}   | ${true}
        ${{ canDelete: false, canEdit: true }}  | ${false}   | ${true}
        ${{ canDelete: false, canEdit: false }} | ${false}   | ${false}
    `(
        `for an activity with permissions $permissions and onEdit ($onEdit), should showDelete: $showDelete, showEdit: $showEdit`,
        ({ permissions, onEdit, showDelete, showEdit }) => {
            const wrapper = getWrapper({ onEdit, ...permissions });

            expect(wrapper.find('[data-testid="delete-annotation-activity"]').length).toEqual(showDelete ? 1 : 0);
            expect(wrapper.find('[data-testid="edit-annotation-activity"]').length).toEqual(showEdit ? 1 : 0);
        },
    );

    test('should show the delete confirm menu when confirming delete', () => {
        const wrapper = getWrapper({ canDelete: true });
        const deleteButton = wrapper.find('MenuItem').prop('onClick');

        deleteButton();

        expect(wrapper.find('DeleteConfirmation').length).toEqual(1);
    });
});

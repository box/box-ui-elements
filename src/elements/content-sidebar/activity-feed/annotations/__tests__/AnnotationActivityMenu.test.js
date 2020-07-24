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

    test('should show the delete confirm menu when confirming delete', () => {
        const wrapper = getWrapper({ canDelete: true });
        const deleteButton = wrapper.find('MenuItem').prop('onClick');

        deleteButton();

        expect(wrapper.find('DeleteConfirmation').length).toEqual(1);
    });

    test('shoud render resin tags', () => {
        const wrapper = getWrapper({ canDelete: true });

        expect(wrapper.find('[data-testid="delete-annotation-activity"]').props()).toMatchObject({
            'data-resin-itemid': '123',
            'data-resin-target': 'activityfeed-annotation-delete',
        });
    });
});

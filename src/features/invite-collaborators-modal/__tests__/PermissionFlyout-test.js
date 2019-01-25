import React from 'react';

import { PermissionFlyoutBase as PermissionFlyout } from '../PermissionFlyout';

describe('features/invite-collaborators-modal/PermissionFlyout', () => {
    const getWrapper = props =>
        shallow(<PermissionFlyout intl={{ formatMessage: jest.fn(() => 'message') }} {...props} />);

    describe('render()', () => {
        test('should render a Flyout and an Overlay', () => {
            const wrapper = getWrapper();
            const overlay = wrapper.find('Overlay');
            const icon = wrapper.find('IconInfo');

            expect(wrapper.is('Flyout')).toBe(true);
            expect(wrapper.prop('position')).toEqual('top-center');
            expect(overlay.length).toBe(1);
            expect(icon.length).toBe(1);
        });

        test('should render a Table Properly', () => {
            const wrapper = getWrapper();

            const table = wrapper.find('Table');
            const tableHeader = wrapper.find('TableHeader');
            const tableBody = wrapper.find('TableBody');
            const tableRow = wrapper.find('TableRow');
            const tableHeaderCell = wrapper.find('TableHeaderCell');

            expect(table.length).toBe(1);
            expect(tableHeader.length).toBe(1);
            expect(tableBody.length).toBe(1);
            expect(tableRow.length).toBe(7);
            expect(tableHeaderCell.length).toBe(8);
        });
    });
});

import * as React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils/testing-library';
import SidebarClassification from '../SidebarClassification';
import type { BoxItem } from '../../../common/types/core';

const classified = {
    name: 'Public',
    definition: 'message',
};

const fileWithUpload = (canUpload: boolean): BoxItem =>
    ({
        id: '1',
        permissions: { can_upload: canUpload },
    }) as BoxItem;

describe('elements/content-sidebar/SidebarClassification', () => {
    const renderComponent = (props: Partial<React.ComponentProps<typeof SidebarClassification>> = {}) =>
        render(<SidebarClassification file={fileWithUpload(false)} {...props} />);

    test('renders nothing when the file is not classified and cannot be edited', () => {
        renderComponent({ onEdit: jest.fn() });

        expect(screen.queryByRole('button', { name: 'Classification' })).not.toBeInTheDocument();
    });

    test('renders the classification and an edit button when the file can be edited', async () => {
        const onEdit = jest.fn();
        const user = userEvent.setup();

        renderComponent({
            classification: classified,
            file: fileWithUpload(true),
            onEdit,
        });

        expect(screen.getByRole('button', { name: 'Classification' })).toBeVisible();
        expect(screen.getByText('Public')).toBeVisible();

        await user.click(screen.getByRole('button', { name: 'Edit' }));

        expect(onEdit).toHaveBeenCalledTimes(1);
    });

    test('does not render an edit button when the file cannot be uploaded', () => {
        renderComponent({
            classification: classified,
            onEdit: jest.fn(),
        });

        expect(screen.getByRole('button', { name: 'Classification' })).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    });

    test('does not render an edit button when onEdit is not provided', () => {
        renderComponent({
            classification: classified,
            file: fileWithUpload(true),
        });

        expect(screen.getByRole('button', { name: 'Classification' })).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    });
});

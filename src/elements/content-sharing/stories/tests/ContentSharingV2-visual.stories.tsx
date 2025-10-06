import * as React from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { TYPE_FILE } from '../../../../constants';
import {
    mockAPIWithCollaborators,
    mockAPIWithSharedLink,
    mockAPIWithoutSharedLink,
} from '../../utils/__mocks__/ContentSharingV2Mocks';
import ContentSharingV2 from '../../ContentSharingV2';

export const withModernization = {
    args: {
        api: mockAPIWithoutSharedLink,
        enableModernizedComponents: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Open Unified Share Modal' });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        expect(screen.getByRole('heading', { name: 'Share ‘Box Development Guide.pdf’' })).toBeVisible();
        expect(screen.getByRole('combobox', { name: 'Invite People' })).toBeVisible();
        expect(screen.getByRole('switch', { name: 'Shared link' })).toBeVisible();
    },
};

export const withSharedLink = {
    args: {
        api: mockAPIWithSharedLink,
    },
    play: async context => {
        await withModernization.play(context);
        expect(screen.getByLabelText('Shared link URL')).toBeVisible();
        expect(screen.getByRole('button', { name: 'Link Settings' })).toBeVisible();
        const peopleWithTheLinkButton = screen.getByRole('button', { name: 'People with the link' });
        expect(peopleWithTheLinkButton).toBeVisible();
        expect(screen.getByRole('button', { name: 'Can view and download' })).toBeVisible();

        await userEvent.click(peopleWithTheLinkButton);
        expect(screen.getByRole('menuitemcheckbox', { name: /Invited people only/ })).toHaveAttribute(
            'aria-disabled',
            'true',
        );
    },
};

export const withCollaborators = {
    args: {
        api: mockAPIWithCollaborators,
    },
    play: async context => {
        await withModernization.play(context);
        await waitFor(async () => {
            const sharedWithAvatars = screen.getByRole('button', { name: 'Shared with D R D' });
            expect(sharedWithAvatars).toBeVisible();
            await userEvent.click(sharedWithAvatars);

            expect(screen.getByRole('link', { name: 'Manage All' })).toBeVisible();
            expect(screen.getByRole('grid', { name: 'Collaborators' })).toBeVisible();
            expect(screen.getByRole('row', { name: /Detective Parrot/ })).toBeVisible();
            expect(screen.getByRole('button', { name: 'Done' })).toBeVisible();
        });
    },
};

export default {
    title: 'Elements/ContentSharingV2/tests/visual-regression-tests',
    component: ContentSharingV2,
    args: {
        children: <button>Open Unified Share Modal</button>,
        itemType: TYPE_FILE,
        itemID: global.FILE_ID,
    },
};

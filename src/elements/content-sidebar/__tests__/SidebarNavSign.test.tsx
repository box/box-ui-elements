import * as React from 'react';

import { userEvent } from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import SidebarNavSign from '../SidebarNavSign';

describe('elements/content-sidebar/SidebarNavSign', () => {
    const onClickRequestSignature = jest.fn();
    const onClickSignMyself = jest.fn();

    const defaultSignSideBarProps = {
        blockedReason: '',
        enabled: true,
        onClick: onClickRequestSignature,
        onClickSignMyself,
        targetingApi: null,
    };

    const renderComponent = () => render(<SidebarNavSign {...defaultSignSideBarProps} />, {});

    test('should render sign button', async () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'Request Signature' })).toBeInTheDocument();
    });

    test('should open dropdown with 2 menu items when sign button is clicked', async () => {
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Request Signature' }));

        expect(screen.getByRole('menuitem', { name: 'Request Signature' })).toBeVisible();
        expect(screen.getByRole('menuitem', { name: 'Sign Myself' })).toBeVisible();
    });

    test('should call correct handler when request signature option is clicked', async () => {
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Request Signature' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Request Signature' }));

        expect(onClickRequestSignature).toHaveBeenCalled();
    });

    test('should call correct handler when sign myself option is clicked', async () => {
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'Request Signature' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Sign Myself' }));

        expect(onClickSignMyself).toHaveBeenCalled();
    });
});

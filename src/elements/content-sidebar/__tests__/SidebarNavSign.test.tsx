import * as React from 'react';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import SidebarNavSign from '../SidebarNavSign';

describe('elements/content-sidebar/SidebarNavSign', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            blockedReason: '',
            enabled: true,
            targetingApi: null,
            onClick: jest.fn(),
            onClickSignMyself: jest.fn(),
        };

        render(<SidebarNavSign {...defaultProps} {...props} />);
    };

    test('should render sign button', () => {
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
        const onClickRequestSignatureMock = jest.fn();
        renderComponent({ onClick: onClickRequestSignatureMock });

        expect(onClickRequestSignatureMock).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole('button', { name: 'Request Signature' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Request Signature' }));

        expect(onClickRequestSignatureMock).toHaveBeenCalledTimes(1);
    });

    test('should call correct handler when sign myself option is clicked', async () => {
        const onClickSignMyselfMock = jest.fn();
        renderComponent({ onClickSignMyself: onClickSignMyselfMock });

        expect(onClickSignMyselfMock).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole('button', { name: 'Request Signature' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Sign Myself' }));

        expect(onClickSignMyselfMock).toHaveBeenCalledTimes(1);
    });
});

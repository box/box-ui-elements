import * as React from 'react';
import { userEvent } from '@testing-library/user-event';
import { screen, render } from '../../../../test-utils/testing-library';
import VersionsItemActions from '../VersionsItemActions';

describe('elements/content-sidebar/versions/VersionsItemActions', () => {
    const defaultProps = {
        fileId: '12345',
    };

    const renderComponent = (props = {}, features = {}) =>
        render(<VersionsItemActions {...defaultProps} {...props} />, {
            wrapperProps: { features },
        });

    describe('render', () => {
        test('should return null when no actions are shown', () => {
            const { container } = renderComponent({
                showDelete: false,
                showDownload: false,
                showPreview: false,
                showPromote: false,
                showRestore: false,
            });

            expect(container).toBeEmptyDOMElement();
        });

        test('should render actions toggle button when at least one action is shown', () => {
            renderComponent({ showDownload: true });

            expect(screen.getByRole('button', { name: 'Toggle Actions Menu' })).toBeInTheDocument();
        });

        test.each([
            { actionProp: 'showPreview', label: 'Preview' },
            { actionProp: 'showDownload', label: 'Download' },
            { actionProp: 'showPromote', label: 'Make Current' },
            { actionProp: 'showRestore', label: 'Restore' },
            { actionProp: 'showDelete', label: 'Delete' },
        ])('should render $label action when $actionProp is true', async ({ actionProp, label }) => {
            renderComponent({ [actionProp]: true });

            const toggleButton = screen.getByRole('button', { name: 'Toggle Actions Menu' });
            await userEvent.click(toggleButton);

            expect(screen.getByRole('menuitem', { name: new RegExp(label) })).toBeInTheDocument();
        });

        test('should render all actions when all show props are true', async () => {
            renderComponent({
                showDelete: true,
                showDownload: true,
                showPreview: true,
                showPromote: true,
                showRestore: true,
            });

            const toggleButton = screen.getByRole('button', { name: 'Toggle Actions Menu' });
            await userEvent.click(toggleButton);

            expect(screen.getByRole('menuitem', { name: /Preview/ })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: /Download/ })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: /Make Current/ })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: /Restore/ })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: /Delete/ })).toBeInTheDocument();
        });

        test('should disable delete action when isRetained is true', async () => {
            renderComponent({
                isRetained: true,
                showDelete: true,
            });

            const toggleButton = screen.getByRole('button', { name: 'Toggle Actions Menu' });
            await userEvent.click(toggleButton);

            const deleteButton = screen.getByRole('menuitem', { name: /Delete/ });
            expect(deleteButton).toHaveAttribute('aria-disabled', 'true');
        });

        test('should not disable delete action when isRetained is false', async () => {
            renderComponent({
                isRetained: false,
                showDelete: true,
            });

            const toggleButton = screen.getByRole('button', { name: 'Toggle Actions Menu' });
            await userEvent.click(toggleButton);

            const deleteButton = screen.getByRole('menuitem', { name: /Delete/ });
            expect(deleteButton).not.toHaveAttribute('aria-disabled', 'true');
        });

        describe('with previewModernization feature enabled', () => {
            const previewModernizationFeatures = {
                previewModernization: { enabled: true },
            };

            test('should render modernized toggle button', () => {
                renderComponent({ showDownload: true }, previewModernizationFeatures);

                const toggleButton = screen.getByRole('button', { name: 'Toggle Actions Menu' });
                expect(toggleButton).toHaveClass('bcs-VersionsItemActions-toggle--modernized');
            });

            test('should render actions in dropdown menu', async () => {
                renderComponent(
                    {
                        showDownload: true,
                        showPreview: true,
                    },
                    previewModernizationFeatures,
                );

                const toggleButton = screen.getByRole('button', { name: 'Toggle Actions Menu' });
                await userEvent.click(toggleButton);

                expect(screen.getByRole('menuitem', { name: /Download/ })).toBeInTheDocument();
                expect(screen.getByRole('menuitem', { name: /Preview/ })).toBeInTheDocument();
            });
        });

        describe('with previewModernization feature disabled', () => {
            test('should render legacy toggle button', () => {
                renderComponent({ showDownload: true });

                const toggleButton = screen.getByRole('button', { name: 'Toggle Actions Menu' });
                expect(toggleButton).toHaveClass('bcs-VersionsItemActions-toggle');
                expect(toggleButton).not.toHaveClass('bcs-VersionsItemActions-toggle--modernized');
            });
        });
    });
});

import * as React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, userEvent } from '../../../../test-utils/testing-library';
import VersionsExperienceMenu from '../VersionsExperienceMenu';

describe('elements/content-sidebar/versions/VersionsExperienceMenu', () => {
    const permissions = { can_delete: true, can_download: true, can_preview: true, can_upload: true };
    const versions = [
        {
            created_at: '2026-08-22T11:33:00',
            id: '3',
            modified_by: { id: '10', name: 'Emily Huang' },
            permissions,
            version_number: '3',
        },
        {
            created_at: '2026-08-21T14:48:00',
            id: '2',
            modified_by: { id: '11', name: 'Jordan Ellis' },
            permissions,
            version_number: '2',
        },
    ];
    const defaultProps = {
        onDelete: jest.fn(),
        onDownload: jest.fn(),
        onPreview: jest.fn(),
        onPromote: jest.fn(),
        onRestore: jest.fn(),
        routerDisabled: true,
        versionCount: 2,
        versionLimit: Infinity,
        versions,
    };

    const renderComponent = (props = {}) => render(<VersionsExperienceMenu {...defaultProps} {...props} />);

    test('should render a row per version with the current status', () => {
        renderComponent();

        expect(screen.getAllByTestId('version-item')).toHaveLength(2);
        expect(screen.getByText('Emily Huang')).toBeInTheDocument();
        expect(screen.getByText('Jordan Ellis')).toBeInTheDocument();
        expect(screen.getByText('CURRENT')).toBeInTheDocument();
    });

    test('should preview a version when its row is clicked', async () => {
        const onPreview = jest.fn();
        const user = userEvent();
        renderComponent({ onPreview });

        await user.click(screen.getByRole('button', { name: 'Aug 21, 2:48 PM' }));

        expect(onPreview).toHaveBeenCalledWith('2');
    });

    test('should mark the version from the internal sidebar navigation as selected', () => {
        renderComponent({ internalSidebarNavigation: { sidebar: 'versions', versionId: '2' } });

        expect(screen.getByRole('button', { name: 'Aug 21, 2:48 PM' })).toHaveAttribute('aria-current', 'true');
        expect(screen.getByRole('button', { name: 'Aug 22, 11:33 AM' })).not.toHaveAttribute('aria-current');
    });

    test('should mark the version from the route as selected when the router is enabled', () => {
        render(
            <MemoryRouter initialEntries={['/versions/2']}>
                <Route path="/versions/:versionId">
                    <VersionsExperienceMenu {...defaultProps} routerDisabled={false} />
                </Route>
            </MemoryRouter>,
        );

        expect(screen.getByRole('button', { name: 'Aug 21, 2:48 PM' })).toHaveAttribute('aria-current', 'true');
    });

    test('should promote an older version from the row menu', async () => {
        const onPromote = jest.fn();
        const user = userEvent();
        renderComponent({ onPromote });

        // The current version has nothing to offer here, so the only menu belongs to the older version.
        screen.getByRole('button', { name: 'More options' }).focus();
        await user.keyboard('{Enter}');
        await user.click(await screen.findByRole('menuitem', { name: 'Make current' }));

        expect(onPromote).toHaveBeenCalledWith('2');
    });

    test('should not show compare unless a compare handler is provided', () => {
        renderComponent();

        expect(screen.queryByRole('button', { name: 'Compare side-by-side' })).not.toBeInTheDocument();
    });

    test('should compare an older version when a compare handler is provided', async () => {
        const onCompare = jest.fn();
        const user = userEvent();
        renderComponent({ onCompare });

        await user.click(screen.getByRole('button', { name: 'Compare side-by-side' }));

        expect(onCompare).toHaveBeenCalledWith('2');
    });
});

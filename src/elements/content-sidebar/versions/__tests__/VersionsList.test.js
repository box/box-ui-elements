import * as React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '../../../../test-utils/testing-library';
import VersionsList from '../VersionsList';

jest.mock('../VersionsItem', () => {
    const MockVersionsItem = jest.fn(({ isCurrent, isSelected, version, fileId, versionCount, versionLimit }) => (
        <div data-testid={`versions-item-${version.id}`}>
            <span>Version {version.id}</span>
            {isCurrent && <span>Current</span>}
            {isSelected && <span>Selected</span>}
            {fileId && <span>FileID: {fileId}</span>}
            {versionCount && <span>VersionCount: {versionCount}</span>}
            {versionLimit && <span>VersionLimit: {versionLimit}</span>}
        </div>
    ));
    return MockVersionsItem;
});

describe('elements/content-sidebar/versions/VersionsList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = {}, routePath = '/activity/versions/12345') => {
        if (props.routerDisabled) {
            // When router is disabled, use simple MemoryRouter
            return render(
                <MemoryRouter>
                    <VersionsList {...props} />
                </MemoryRouter>,
            );
        }

        // When router is enabled, use the proper route structure
        return render(
            <MemoryRouter initialEntries={[routePath]}>
                <Route path="/:sidebar(activity|details)/versions/:versionId?">
                    <VersionsList {...props} />
                </Route>
            </MemoryRouter>,
        );
    };

    describe('render', () => {
        test('should render empty list when no versions provided', () => {
            renderComponent({ versions: [] });
            const list = screen.getByRole('list');
            const listItems = screen.queryAllByRole('listitem');

            expect(list).toBeInTheDocument();
            expect(listItems).toHaveLength(0);
        });

        test('should render single version item', () => {
            const versions = [{ id: '12345' }];
            renderComponent({ versions });
            const list = screen.getByRole('list');
            const listItems = screen.getAllByRole('listitem');

            expect(list).toBeInTheDocument();
            expect(listItems).toHaveLength(1);
            expect(screen.getByText('Version 12345')).toBeInTheDocument();
        });

        test('should render multiple version items', () => {
            const versions = [{ id: '12345' }, { id: '45678' }];
            renderComponent({ versions });
            const list = screen.getByRole('list');
            const listItems = screen.getAllByRole('listitem');

            expect(list).toBeInTheDocument();
            expect(listItems).toHaveLength(2);
            expect(screen.getByText('Version 12345')).toBeInTheDocument();
            expect(screen.getByText('Version 45678')).toBeInTheDocument();
        });

        test('should pass correct isCurrent prop based on currentId', () => {
            const versions = [{ id: '12345' }, { id: '67890' }];
            const currentId = '12345';
            renderComponent({ versions, currentId, routerDisabled: true });

            // Version 12345 should be marked as current
            const version12345Container = screen.getByTestId('versions-item-12345');
            expect(version12345Container).toBeInTheDocument();
            expect(screen.getByText('Current')).toBeInTheDocument();

            // Only one "Current" text should exist
            expect(screen.getAllByText('Current')).toHaveLength(1);
        });

        test('should use router selection when routerDisabled is false', () => {
            const versions = [{ id: '12345' }, { id: '67890' }];
            renderComponent({ versions, routerDisabled: false }, '/activity/versions/12345');

            // Version 12345 should be marked as selected based on route
            expect(screen.getByText('Selected')).toBeInTheDocument();
            expect(screen.getAllByText('Selected')).toHaveLength(1);
        });

        test('should use internalSidebarNavigation selection when routerDisabled is true', () => {
            const versions = [{ id: '12345' }, { id: '67890' }];
            const internalSidebarNavigation = { versionId: '67890', open: true };

            renderComponent({
                versions,
                routerDisabled: true,
                internalSidebarNavigation,
            });

            // Version 67890 should be marked as selected based on internal navigation
            expect(screen.getByText('Selected')).toBeInTheDocument();
            expect(screen.getAllByText('Selected')).toHaveLength(1);
        });

        test('should handle no selection when internalSidebarNavigation is not provided', () => {
            const versions = [{ id: '12345' }, { id: '67890' }];

            renderComponent({ versions, routerDisabled: true });

            // No version should be selected
            expect(screen.queryByText('Selected')).not.toBeInTheDocument();
        });

        test('should render items with correct version IDs', () => {
            const versions = [{ id: 'version-abc' }, { id: 'version-xyz' }];

            renderComponent({ versions, routerDisabled: true });

            expect(screen.getByText('Version version-abc')).toBeInTheDocument();
            expect(screen.getByText('Version version-xyz')).toBeInTheDocument();
        });

        test('should pass down other props to VersionsItem', () => {
            const versions = [{ id: '12345' }];
            const props = {
                versions,
                fileId: 'f_123',
                versionCount: 10,
                versionLimit: 100,
                routerDisabled: true,
            };
            renderComponent(props);

            expect(screen.getByText('FileID: f_123')).toBeInTheDocument();
            expect(screen.getByText('VersionCount: 10')).toBeInTheDocument();
            expect(screen.getByText('VersionLimit: 100')).toBeInTheDocument();
        });
    });
});

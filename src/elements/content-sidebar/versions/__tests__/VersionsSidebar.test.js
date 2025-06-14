import * as React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, userEvent } from 'src/test-utils/testing-library';
import messages from '../messages';
import VersionsSidebar from '../VersionsSidebar';

jest.mock('../../../common/nav-button', () => ({
    BackButton: ({ onClick, 'data-resin-target': dataResinTarget }) => (
        <button type="button" onClick={onClick} data-resin-target={dataResinTarget} data-testid="back-button">
            Back
        </button>
    ),
}));

jest.mock('../VersionsMenu', () => ({ versions, fileId, versionCount, versionLimit }) => (
    <div data-testid="versions-menu">
        Versions: {versions.length}, FileId: {fileId}, Count: {versionCount}, Limit: {versionLimit}
    </div>
));

jest.mock('../../../../components/loading-indicator', () => ({
    LoadingIndicatorWrapper: ({ children, isLoading, className, crawlerPosition }) => (
        <div
            className={className}
            data-testid="loading-wrapper"
            data-loading={isLoading}
            data-crawler-position={crawlerPosition}
        >
            {children}
        </div>
    ),
}));

jest.mock('../../../../components/inline-error', () => ({ title, children }) => (
    <div data-testid="inline-error">
        <div data-testid="error-title">{title}</div>
        <div data-testid="error-message">{children}</div>
    </div>
));

describe('elements/content-sidebar/versions/VersionsSidebar', () => {
    const defaultProps = {
        fileId: '123',
        isLoading: false,
        parentName: 'activity',
        versionCount: 1,
        versionLimit: 10,
        versions: [{ id: '12345' }],
    };

    const renderComponent = (props = {}) => {
        return render(
            <MemoryRouter initialEntries={['/versions']}>
                <VersionsSidebar {...defaultProps} {...props} />
            </MemoryRouter>,
        );
    };

    describe('render', () => {
        test('should show the versions list if no error prop is provided', () => {
            renderComponent({ versions: [{ id: '12345' }] });

            expect(screen.queryByTestId('inline-error')).not.toBeInTheDocument();
            expect(screen.getByTestId('versions-menu')).toBeInTheDocument();
            expect(screen.getByText('Version History')).toBeInTheDocument();
            expect(screen.getByTestId('back-button')).toBeInTheDocument();
        });

        test('should show an inline error if the prop is provided', () => {
            renderComponent({
                error: messages.versionFetchError,
                versions: [],
            });

            expect(screen.getByTestId('inline-error')).toBeInTheDocument();
            expect(screen.getByTestId('error-title')).toBeInTheDocument();
            expect(screen.getByTestId('error-message')).toBeInTheDocument();
        });

        test('should show max versions text if max versions provided', () => {
            const versions = Array.from({ length: 1000 }, (_, index) => ({ id: index }));
            renderComponent({ versions });

            expect(screen.getByTestId('max-versions')).toBeInTheDocument();
        });

        test('should show empty state when no versions and not loading', () => {
            renderComponent({
                versions: [],
                isLoading: false,
            });

            expect(screen.getByText('No prior versions are available for this file.')).toBeInTheDocument();
        });

        test('should pass loading state to LoadingIndicatorWrapper', () => {
            renderComponent({ isLoading: true });

            const loadingWrapper = screen.getByTestId('loading-wrapper');
            expect(loadingWrapper).toHaveAttribute('data-loading', 'true');
            expect(loadingWrapper).toHaveAttribute('data-crawler-position', 'top');
            expect(loadingWrapper).toHaveClass('bcs-Versions-content');
        });

        test('should pass correct props to VersionsMenu', () => {
            renderComponent();

            const versionsMenu = screen.getByTestId('versions-menu');
            expect(versionsMenu).toHaveTextContent('Versions: 1, FileId: 123, Count: 1, Limit: 10');
        });
    });

    describe('navigation', () => {
        test('should navigate to parent name when back button is clicked', async () => {
            render(
                <MemoryRouter initialEntries={['/versions']}>
                    <Route
                        path="*"
                        render={({ location }) => (
                            <>
                                <VersionsSidebar {...defaultProps} parentName="activity" />
                                <div data-testid="current-location">{location.pathname}</div>
                            </>
                        )}
                    />
                </MemoryRouter>,
            );

            expect(screen.getByTestId('current-location')).toHaveTextContent('/versions');

            const backButton = screen.getByTestId('back-button');
            await userEvent.click(backButton);

            expect(screen.getByTestId('current-location')).toHaveTextContent('/activity');
        });
    });
});

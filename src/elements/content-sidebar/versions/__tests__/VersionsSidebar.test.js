import * as React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, userEvent } from '../../../../test-utils/testing-library';
import FeatureProvider from '../../../common/feature-checking/FeatureProvider';
import messages from '../messages';
import VersionsSidebar from '../VersionsSidebar';

jest.mock('../../../common/back-button', () => ({ onClick, 'data-resin-target': dataResinTarget }) => (
    <button type="button" onClick={onClick} data-resin-target={dataResinTarget} data-testid="back-button">
        Back
    </button>
));

jest.mock('../VersionsMenu', () => ({ versions, fileId, versionCount, versionLimit }) => (
    <div data-testid="versions-menu">
        Versions: {versions.length}, FileId: {fileId}, Count: {versionCount}, Limit: {versionLimit}
    </div>
));

jest.mock('../VersionsExperienceMenu', () => ({ versions }) => (
    <div data-testid="versions-experience-menu">Versions: {versions.length}</div>
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
        expect(screen.queryByTestId('versions-menu')).not.toBeInTheDocument();
        expect(screen.queryByTestId('max-versions')).not.toBeInTheDocument();
        expect(screen.getByText('Version History')).toBeInTheDocument();
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    test('should show max versions text if max versions provided', () => {
        const versions = Array.from({ length: 1000 }, (_, index) => ({ id: index }));
        renderComponent({ versions });

        expect(screen.getByTestId('max-versions')).toBeInTheDocument();
        expect(screen.queryByTestId('inline-error')).not.toBeInTheDocument();
        expect(screen.getByText('Version History')).toBeInTheDocument();
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    test('should not show max versions text if few versions provided', () => {
        renderComponent({ versions: [{ id: '1' }, { id: '2' }] });

        expect(screen.queryByTestId('max-versions')).not.toBeInTheDocument();
        expect(screen.queryByTestId('inline-error')).not.toBeInTheDocument();
    });

    test('should show empty state when no versions and not loading', () => {
        renderComponent({
            versions: [],
            isLoading: false,
        });

        expect(screen.getByText('No prior versions are available for this file.')).toBeInTheDocument();
        expect(screen.queryByTestId('versions-menu')).not.toBeInTheDocument();
        expect(screen.queryByTestId('max-versions')).not.toBeInTheDocument();
        expect(screen.queryByTestId('inline-error')).not.toBeInTheDocument();
        expect(screen.getByText('Version History')).toBeInTheDocument();
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    test('should pass loading state to LoadingIndicatorWrapper', () => {
        renderComponent({ isLoading: true });

        const loadingWrapper = screen.getByTestId('loading-wrapper');
        expect(loadingWrapper).toHaveAttribute('data-loading', 'true');
        expect(loadingWrapper).toHaveAttribute('data-crawler-position', 'top');
        expect(loadingWrapper).toHaveClass('bcs-Versions-content');
        expect(screen.queryByTestId('inline-error')).not.toBeInTheDocument();
        expect(screen.getByText('Version History')).toBeInTheDocument();
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    test('should pass correct props to VersionsMenu', () => {
        renderComponent();

        const versionsMenu = screen.getByTestId('versions-menu');
        expect(versionsMenu).toHaveTextContent('Versions: 1, FileId: 123, Count: 1, Limit: 10');
        expect(screen.queryByTestId('inline-error')).not.toBeInTheDocument();
        expect(screen.getByText('Version History')).toBeInTheDocument();
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    test('should navigate to parent name when back button is clicked', async () => {
        const mockNavigationHandler = jest.fn();
        let currentLocation;

        const TestWrapper = ({ children }) => (
            <MemoryRouter initialEntries={['/versions']}>
                <Route
                    path="*"
                    render={({ location }) => {
                        currentLocation = location;
                        return children;
                    }}
                />
            </MemoryRouter>
        );

        render(
            <TestWrapper>
                <VersionsSidebar
                    {...defaultProps}
                    parentName="activity"
                    internalSidebarNavigationHandler={mockNavigationHandler}
                />
            </TestWrapper>,
        );

        expect(currentLocation.pathname).toBe('/versions');

        const backButton = screen.getByTestId('back-button');
        const user = userEvent();
        await user.click(backButton);

        expect(currentLocation.pathname).toBe('/activity');
        expect(mockNavigationHandler).not.toHaveBeenCalled();
    });

    describe('when routerDisabled is true', () => {
        const renderComponentWithoutRouter = (props = {}) => {
            return render(<VersionsSidebar {...defaultProps} routerDisabled {...props} />);
        };

        test('should render without React Router', () => {
            renderComponentWithoutRouter();

            expect(screen.getByText('Version History')).toBeInTheDocument();
            expect(screen.getByTestId('back-button')).toBeInTheDocument();
            expect(screen.getByTestId('versions-menu')).toBeInTheDocument();
        });

        test('should use internalSidebarNavigationHandler when BackButton is clicked', async () => {
            const mockNavigationHandler = jest.fn();
            const user = userEvent();

            renderComponentWithoutRouter({
                internalSidebarNavigationHandler: mockNavigationHandler,
                parentName: 'details',
            });

            const backButton = screen.getByTestId('back-button');
            await user.click(backButton);

            expect(mockNavigationHandler).toHaveBeenCalledTimes(1);
            expect(mockNavigationHandler).toHaveBeenCalledWith({ sidebar: 'details' });
        });

        test('should pass props to VersionsMenu when router is disabled', () => {
            const mockInternalSidebarNavigation = {
                sidebar: 'activity',
                open: true,
            };

            renderComponentWithoutRouter({
                internalSidebarNavigation: mockInternalSidebarNavigation,
            });

            expect(screen.getByTestId('versions-menu')).toBeInTheDocument();
        });
    });
    describe('versions.versionExperience feature', () => {
        const renderWithFeatures = features =>
            render(
                <MemoryRouter initialEntries={['/versions']}>
                    <FeatureProvider features={features}>
                        <VersionsSidebar {...defaultProps} />
                    </FeatureProvider>
                </MemoryRouter>,
            );

        test('should render the shared version experience list when the feature is enabled', () => {
            renderWithFeatures({ versions: { versionExperience: { enabled: true } } });

            expect(screen.getByTestId('versions-experience-menu')).toBeInTheDocument();
            expect(screen.queryByTestId('versions-menu')).not.toBeInTheDocument();
        });

        test('should keep rendering the existing list when the feature is disabled', () => {
            renderWithFeatures({ versions: { versionExperience: { enabled: false } } });

            expect(screen.getByTestId('versions-menu')).toBeInTheDocument();
            expect(screen.queryByTestId('versions-experience-menu')).not.toBeInTheDocument();
        });

        test('should not show the UI toggle when the feature is disabled', () => {
            renderWithFeatures({ versions: { versionExperience: { enabled: false } } });

            expect(screen.queryByTestId('versions-ui-toggle')).not.toBeInTheDocument();
        });

        test('should switch between the new and old list and remember the choice', async () => {
            const user = userEvent();
            window.localStorage.removeItem('bcs-versions-use-old-ui');
            const features = { versions: { versionExperience: { enabled: true } } };

            const { unmount } = renderWithFeatures(features);
            expect(screen.getByTestId('versions-experience-menu')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'Switch to old UI' }));
            expect(screen.getByTestId('versions-menu')).toBeInTheDocument();
            expect(screen.queryByTestId('versions-experience-menu')).not.toBeInTheDocument();

            unmount();
            renderWithFeatures(features);
            expect(screen.getByTestId('versions-menu')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'Switch to new UI' }));
            expect(screen.getByTestId('versions-experience-menu')).toBeInTheDocument();
            window.localStorage.removeItem('bcs-versions-use-old-ui');
        });
    });
});

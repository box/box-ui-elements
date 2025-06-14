import * as React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, userEvent } from '../../../../test-utils/testing-library';
import StaticVersionSidebar from '../StaticVersionSidebar';

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

jest.mock(
    '../../../../components/primary-button',
    () =>
        ({ children, onClick, className, 'data-resin-target': dataResinTarget, type }) => (
            <button
                className={className}
                onClick={onClick}
                data-resin-target={dataResinTarget}
                type={type}
                data-testid="upgrade-button"
            >
                {children}
            </button>
        ),
);

jest.mock('../../../../illustration/BoxDrive140', () => ({ className }) => (
    <div className={className} data-testid="box-drive-icon" />
));

describe('elements/content-sidebar/versions/StaticVersionSidebar', () => {
    const defaultProps = {
        isLoading: false,
        onUpgradeClick: jest.fn(),
        parentName: 'activity',
    };
    const renderComponent = (props = {}) => {
        return render(
            <MemoryRouter initialEntries={['/versions']}>
                <StaticVersionSidebar {...defaultProps} {...props} />
            </MemoryRouter>,
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render with all main sections', () => {
        renderComponent();

        expect(screen.getByRole('tabpanel')).toBeInTheDocument();
        expect(screen.getByRole('tabpanel')).toHaveClass('bcs-StaticVersionSidebar');
        expect(screen.getByRole('tabpanel')).toHaveAttribute('data-resin-component', 'preview');
        expect(screen.getByRole('tabpanel')).toHaveAttribute('data-resin-feature', 'versions');

        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
        expect(screen.getByText('Version History')).toBeInTheDocument();

        expect(screen.getByTestId('loading-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('versions-menu')).toBeInTheDocument();

        const boxDriveIcon = screen.getByTestId('box-drive-icon');
        expect(boxDriveIcon).toBeInTheDocument();
        expect(boxDriveIcon).toHaveClass('bcs-StaticVersionSidebar-upsell-icon');
        expect(screen.getByTestId('upgrade-button')).toBeInTheDocument();
        expect(screen.getByText('Upgrade Now')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Sorry, version history is not available with your current account plan. To access versioning, select from one of our paid plans.',
            ),
        ).toBeInTheDocument();
    });

    test('should pass correct props to BackButton', () => {
        renderComponent({ parentName: 'details' });

        const backButton = screen.getByTestId('back-button');
        expect(backButton).toHaveAttribute('data-resin-target', 'back');
    });

    test('should navigate when BackButton is clicked', async () => {
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
                <StaticVersionSidebar {...defaultProps} parentName="details" />
            </TestWrapper>,
        );

        expect(currentLocation.pathname).toBe('/versions');

        const backButton = screen.getByTestId('back-button');
        await userEvent.click(backButton);

        expect(currentLocation.pathname).toBe('/details');
    });

    test('should pass loading state to LoadingIndicatorWrapper', () => {
        renderComponent({ isLoading: true });

        const loadingWrapper = screen.getByTestId('loading-wrapper');
        expect(loadingWrapper).toHaveAttribute('data-loading', 'true');
        expect(loadingWrapper).toHaveAttribute('data-crawler-position', 'top');
        expect(loadingWrapper).toHaveClass('bcs-StaticVersionSidebar-content');
    });

    test('should render VersionsMenu with correct props', () => {
        renderComponent();

        const versionsMenu = screen.getByTestId('versions-menu');
        expect(versionsMenu).toHaveTextContent('Versions: 3, FileId: 1, Count: 3, Limit: 3');
    });

    test('should call onUpgradeClick when upgrade button is clicked', async () => {
        const mockOnUpgradeClick = jest.fn();
        renderComponent({ onUpgradeClick: mockOnUpgradeClick });

        const upgradeButton = screen.getByTestId('upgrade-button');
        await userEvent.click(upgradeButton);

        expect(mockOnUpgradeClick).toHaveBeenCalledTimes(1);
    });

    test('should render upgrade button with correct attributes', () => {
        renderComponent();

        const upgradeButton = screen.getByTestId('upgrade-button');
        expect(upgradeButton).toHaveClass('bcs-StaticVersionSidebar-upsell-button');
        expect(upgradeButton).toHaveAttribute('data-resin-target', 'versioning_error_upgrade_cta');
        expect(upgradeButton).toHaveAttribute('type', 'button');
        expect(upgradeButton).toHaveTextContent('Upgrade');
    });
});

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { FeatureProvider, useFeatureConfig } from '../../common/feature-checking';
import { SIDEBAR_VIEW_ACTIVITY } from '../../../constants';

import SidebarNav from '../SidebarNav';

// Mock all external dependencies
jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    useIntl: () => ({
        formatMessage: (message: { id: string }) => {
            const mockMessages = {
                'be.sidebarActivityTitle': 'Activity',
                'be.sidebarDetailsTitle': 'Details',
                'be.sidebarMetadataTitle': 'Metadata',
                'be.sidebarSkillsTitle': 'Skills',
                'be.sidebarBoxAITitle': 'Box AI',
                'be.sidebarDocGenTooltip': 'Box Doc Gen',
                'be.sidebarNavLabel': 'Sidebar Navigation',
            };
            return mockMessages[message.id] || message.id;
        },
    }),
}));

jest.mock('../../common/feature-checking', () => ({
    ...jest.requireActual('../../common/feature-checking'),
    useFeatureConfig: jest.fn((feature: string) => {
        if (feature === 'boxai.sidebar') {
            return { enabled: true, disabledTooltip: '', showOnlyNavButton: false };
        }
        if (feature === 'boxSign') {
            return { enabled: false };
        }
        return { enabled: false };
    }),
}));

jest.mock('@box/blueprint-web-assets/icons/Logo', () => ({
    BoxAiLogo: () => <div data-testid="mock-boxai-logo" />,
}));

jest.mock('@box/blueprint-web-assets/tokens/tokens', () => ({
    Size6: '16px',
}));

jest.mock('../../../icons/general/IconChatRound', () => () => <div data-testid="mock-chat-icon" />);
jest.mock('../../../icons/general/IconDocInfo', () => () => <div data-testid="mock-docinfo-icon" />);
jest.mock('../../../icons/general/IconMagicWand', () => () => <div data-testid="mock-magic-wand-icon" />);
jest.mock('../../../icons/general/IconMetadataThick', () => () => <div data-testid="mock-metadata-icon" />);
jest.mock('../../../icon/fill/DocGenIcon', () => () => <div data-testid="mock-docgen-icon" />);

jest.mock('../additional-tabs/AdditionalTabs', () => {
    return {
        __esModule: true,
        default: function AdditionalTabs({ tabs }) {
            return <div data-testid="mock-additional-tabs">{tabs?.length}</div>;
        },
    };
});

jest.mock('../additional-tabs', () => ({
    __esModule: true,
    default: jest.requireMock('../additional-tabs/AdditionalTabs').default,
}));

jest.mock('../SidebarToggle', () => {
    const SidebarToggleMock = jest.fn(({ isOpen }) => (
        <div data-testid="mock-sidebar-toggle">{isOpen ? 'open' : 'closed'}</div>
    ));
    return { __esModule: true, default: SidebarToggleMock };
});

jest.mock('../SidebarNavSign', () => {
    const SidebarNavSignMock = jest.fn(() => <div data-testid="mock-sidebar-nav-sign" />);
    return { __esModule: true, default: SidebarNavSignMock };
});

jest.mock('../SidebarNavTablist', () => ({
    __esModule: true,
    default: jest.fn(({ children }) => (
        <div data-testid="mock-sidebar-nav-tablist" role="tablist" aria-orientation="vertical">
            {children}
        </div>
    )),
}));

jest.mock('../SidebarNavButton', () => ({
    __esModule: true,
    default: jest.fn(({ children, 'data-testid': dataTestId, tooltip, isDisabled, onClick, sidebarView }) => (
        <button
            data-testid={dataTestId}
            disabled={isDisabled}
            aria-label={tooltip}
            onClick={() => onClick && onClick(sidebarView)}
        >
            {children}
        </button>
    )),
}));

describe('elements/content-sidebar/SidebarNav', () => {
    const defaultProps = {
        elementId: 'sidebar',
        fileId: '123',
        hasActivity: true,
        hasAdditionalTabs: false,
        hasBoxAI: true,
        hasDetails: true,
        hasDocGen: false,
        hasMetadata: true,
        hasSkills: true,
        isOpen: true,
        onNavigate: jest.fn(),
        onPanelChange: jest.fn(),
        additionalTabs: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Removed mockMessages and mockFormatMessage as they are now handled in the react-intl mock

    const renderComponent = (
        props = {},
        featureConfig: Record<string, { enabled: boolean; disabledTooltip?: string; showOnlyNavButton?: boolean }> = {},
    ) => {
        const features = {
            boxSign: { enabled: false },
            'boxai.sidebar': { enabled: true, disabledTooltip: '', showOnlyNavButton: false },
            ...featureConfig,
        };

        (useFeatureConfig as jest.Mock).mockImplementation((feature: string) => {
            if (feature === 'boxai.sidebar') {
                return features['boxai.sidebar'];
            }
            if (feature === 'boxSign') {
                return features.boxSign;
            }
            return { enabled: false };
        });

        const utils = render(
            <IntlProvider
                locale="en"
                messages={{
                    'be.sidebarActivityTitle': 'Activity',
                    'be.sidebarDetailsTitle': 'Details',
                    'be.sidebarMetadataTitle': 'Metadata',
                    'be.sidebarSkillsTitle': 'Skills',
                    'be.sidebarBoxAITitle': 'Box AI',
                    'be.sidebarDocGenTooltip': 'Box Doc Gen',
                    'be.sidebarNavLabel': 'Sidebar Navigation',
                }}
            >
                <FeatureProvider features={features}>
                    <MemoryRouter>
                        <SidebarNav {...defaultProps} {...props} />
                    </MemoryRouter>
                </FeatureProvider>
            </IntlProvider>,
        );

        return utils;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Removed duplicate renderWithProviders function

    test('renders component with all tabs', () => {
        renderComponent();

        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
        expect(nav).toHaveAttribute('aria-label', 'Sidebar Navigation');

        // Verify each tab button is present
        expect(screen.getByTestId('sidebarboxai')).toBeInTheDocument();
        expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
        expect(screen.getByTestId('sidebardetails')).toBeInTheDocument();
        expect(screen.getByTestId('sidebarskills')).toBeInTheDocument();
        expect(screen.getByTestId('sidebarmetadata')).toBeInTheDocument();
    });

    test('renders component with disabled Box AI tab and tooltip', () => {
        (useFeatureConfig as jest.Mock).mockImplementation(feature => {
            if (feature === 'boxai.sidebar') {
                return {
                    enabled: true,
                    disabledTooltip: 'Box AI is disabled',
                    showOnlyNavButton: true,
                };
            }
            return { enabled: false };
        });

        renderComponent(
            {
                hasBoxAI: true,
                hasActivity: false,
                hasDetails: false,
                hasMetadata: false,
                hasSkills: false,
            },
            {
                'boxai.sidebar': {
                    enabled: true,
                    disabledTooltip: 'Box AI is disabled',
                    showOnlyNavButton: true,
                },
            },
        );

        const boxAIButton = screen.getByTestId('sidebarboxai');
        expect(boxAIButton).toBeInTheDocument();
        expect(boxAIButton).toBeDisabled();
        expect(boxAIButton).toHaveAttribute('aria-label', 'Box AI is disabled');
    });

    test('renders component with DocGen tab', () => {
        renderComponent({
            hasDocGen: true,
        });

        const docGenButton = screen.getByRole('button', { name: 'Box Doc Gen' });
        expect(docGenButton).toBeInTheDocument();
    });

    test('handles tab click correctly', () => {
        const onPanelChange = jest.fn();
        renderComponent({ onPanelChange });

        const activityButton = screen.getByTestId('sidebaractivity');
        activityButton.click();

        expect(onPanelChange).toHaveBeenCalledWith(SIDEBAR_VIEW_ACTIVITY, false);
    });

    test('renders BoxSign section when enabled', () => {
        renderComponent(
            {},
            {
                boxSign: { enabled: true },
            },
        );

        const nav = screen.getByTestId('sidebar-nav');
        expect(nav).toBeInTheDocument();
        expect(nav.querySelector('.bcs-SidebarNav-secondary')).toBeInTheDocument();
    });

    test('handles navigation correctly', () => {
        const onNavigate = jest.fn();
        renderComponent({ onNavigate });

        const nav = screen.getByTestId('sidebar-nav');
        expect(nav).toBeInTheDocument();
        const tablist = screen.getByTestId('mock-sidebar-nav-tablist');
        expect(tablist).toHaveAttribute('role', 'tablist');
        expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    });

    test('renders component with additional tabs', () => {
        const mockCallback = jest.fn();
        const additionalTabs = [
            {
                id: 1,
                title: 'Custom Tab',
                callback: mockCallback,
            },
        ];

        renderComponent({
            hasAdditionalTabs: true,
            additionalTabs,
        });

        const nav = screen.getByTestId('sidebar-nav');
        expect(nav).toBeInTheDocument();
        expect(nav.querySelector('.bcs-SidebarNav-overflow')).toBeInTheDocument();
    });
});

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { usePromptFocus } from '@box/box-ai-content-answers';

import FeatureProvider from '../../common/feature-checking/FeatureProvider';
import SidebarNav from '../SidebarNav';

import { render, screen, userEvent, waitFor } from '../../../test-utils/testing-library';

jest.mock('@box/box-ai-content-answers');

describe('elements/content-sidebar/SidebarNav', () => {
    const focusBoxAISidebarPromptMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        usePromptFocus.mockReturnValue({
            focusPrompt: focusBoxAISidebarPromptMock,
        });
    });

    const renderSidebarNav = ({ path = '/', props = {}, features = {} } = {}) => {
        const defaultProps = {
            customSidebarPanels: [],
        };
        return render(
            <MemoryRouter initialEntries={[path]}>
                <FeatureProvider features={features}>
                    <SidebarNav {...defaultProps} {...props} />
                </FeatureProvider>
            </MemoryRouter>,
        );
    };

    // Mock icon component for testing
    const MockBoxAIIcon = () => <div data-testid="mock-boxai-icon">BoxAI Icon</div>;

    // Helper function to create Box AI custom tab
    const createBoxAIPanel = (overrides = {}) => ({
        id: 'boxai',
        path: 'boxai',
        title: 'Box AI',
        icon: MockBoxAIIcon,
        isDisabled: false,
        navButtonProps: {},
        ...overrides,
    });

    describe('individual tab rendering', () => {
        const TABS_CONFIG = {
            boxai: { testId: 'sidebarboxai', propName: 'hasNativeBoxAISidebar' },
            skills: { testId: 'sidebarskills', propName: 'hasSkills' },
            details: { testId: 'sidebardetails', propName: 'hasDetails' },
            activity: { testId: 'sidebaractivity', propName: 'hasActivity' },
            metadata: { testId: 'sidebarmetadata', propName: 'hasMetadata' },
            docgen: { testId: 'sidebardocgen', propName: 'hasDocGen' },
        };

        const tabNames = Object.keys(TABS_CONFIG);

        test.each(tabNames)('should render %s tab', tabName => {
            const { testId, propName } = TABS_CONFIG[tabName];

            renderSidebarNav({
                props: {
                    [propName]: true,
                },
            });

            expect(screen.getByTestId(testId)).toBeInTheDocument();

            tabNames
                .filter(name => name !== tabName)
                .forEach(otherTabName => {
                    const otherTab = TABS_CONFIG[otherTabName];
                    expect(screen.queryByTestId(otherTab.testId)).not.toBeInTheDocument();
                });
        });
    });

    describe('should render box ai tab with correct disabled state and tooltip', () => {
        test.each`
            disabledTooltip          | expectedTooltip
            ${'tooltip msg'}         | ${'tooltip msg'}
            ${'another tooltip msg'} | ${'another tooltip msg'}
        `(
            'given feature boxai.sidebar.showOnlyNavButton = true and boxai.sidebar.disabledTooltip = $disabledTooltip, should render box ai tab with disabled state and tooltip = $expectedTooltip',
            async ({ disabledTooltip, expectedTooltip }) => {
                const user = userEvent();

                renderSidebarNav({
                    features: { boxai: { sidebar: { disabledTooltip, showOnlyNavButton: true } } },
                    props: { hasNativeBoxAISidebar: true },
                });

                const button = screen.getByTestId('sidebarboxai');

                await user.hover(button);

                expect(button).toHaveAttribute('aria-disabled', 'true');
                await waitFor(() => {
                    expect(screen.getByRole('tooltip', { name: expectedTooltip })).toBeInTheDocument();
                });
            },
        );

        test('given feature boxai.sidebar.showOnlyNavButton = false, should render box ai tab with default tooltip', async () => {
            const user = userEvent();

            renderSidebarNav({
                features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                props: { hasNativeBoxAISidebar: true },
            });

            const button = screen.getByTestId('sidebarboxai');

            await user.hover(button);

            expect(button).not.toHaveAttribute('aria-disabled');
            await waitFor(() => {
                expect(screen.getByRole('tooltip', { name: 'Box AI' })).toBeInTheDocument();
            });
        });
    });

    test('should call focusBoxAISidebarPrompt when clicked on native Box AI Tab', async () => {
        const user = userEvent();

        renderSidebarNav({
            props: {
                hasNativeBoxAISidebar: true,
            },
        });

        const button = screen.getByTestId('sidebarboxai');

        await user.click(button);

        expect(usePromptFocus).toHaveBeenCalledTimes(1);
        expect(usePromptFocus).toHaveBeenCalledWith('.be.bcs');

        expect(focusBoxAISidebarPromptMock).toHaveBeenCalledTimes(1);
        expect(focusBoxAISidebarPromptMock).toHaveBeenCalledWith();
    });

    test('should have multiple tabs', () => {
        renderSidebarNav({
            path: '/activity',
            props: {
                hasNativeBoxAISidebar: true,
                hasActivity: true,
                hasMetadata: true,
                hasSkills: true,
            },
        });

        expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
        expect(screen.getByTestId('sidebarboxai')).toBeInTheDocument();
        expect(screen.getByTestId('sidebarmetadata')).toBeInTheDocument();
        expect(screen.getByTestId('sidebarskills')).toBeInTheDocument();

        expect(screen.queryByTestId('sidebardetails')).not.toBeInTheDocument();

        const navButtons = screen.getAllByRole('tab');
        expect(navButtons).toHaveLength(4);
    });

    test('should render the additional tabs loading state', () => {
        renderSidebarNav({
            props: {
                additionalTabs: [],
                hasAdditionalTabs: true,
            },
        });

        expect(screen.getByTestId('additional-tabs-overflow')).toBeInTheDocument();

        const placeholders = screen.getAllByTestId('additionaltabplaceholder');
        expect(placeholders).toHaveLength(5);
    });

    test('should render additional tabs with modernized class when previewModernization is enabled', () => {
        renderSidebarNav({
            features: {
                previewModernization: {
                    enabled: true,
                },
            },
            props: {
                additionalTabs: [],
                hasAdditionalTabs: true,
            },
        });

        const overflowContainer = screen.getByTestId('additional-tabs-overflow');
        expect(overflowContainer).toBeInTheDocument();
        expect(overflowContainer).toHaveClass('bcs-SidebarNav-overflow--modernized');
    });

    test('should render the Box Sign entry point if its feature is enabled', () => {
        renderSidebarNav({
            props: {
                signSidebarProps: {
                    enabled: true,
                    onClick: () => {},
                },
            },
        });

        const boxSignSection = screen.getByRole('button', { name: /sign/i });
        expect(boxSignSection).toBeInTheDocument();
    });

    describe('hasNativeBoxAISidebar and customSidebarPanels interaction', () => {
        test('should render native Box AI when hasNativeBoxAISidebar is true, ignoring custom boxai tab', () => {
            const boxAiPanel = createBoxAIPanel({ title: 'Custom Box AI' });

            renderSidebarNav({
                props: {
                    hasNativeBoxAISidebar: true,
                    customSidebarPanels: [boxAiPanel],
                },
            });

            // Should only render one Box AI tab (the native one)
            const boxAiButtons = screen.getAllByTestId('sidebarboxai');
            expect(boxAiButtons).toHaveLength(1);

            // The native Box AI button should have the default tooltip, not the custom one
            expect(boxAiButtons[0]).toHaveAttribute('aria-label', 'Box AI');
        });

        test('should render custom boxai tab when hasNativeBoxAISidebar is false', () => {
            const boxAiPanel = createBoxAIPanel({ title: 'Custom Box AI Title' });

            renderSidebarNav({
                props: {
                    hasNativeBoxAISidebar: false,
                    customSidebarPanels: [boxAiPanel],
                },
            });

            const button = screen.getByTestId('sidebarboxai');
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-label', 'Custom Box AI Title');
        });

        test('should not render any boxai tab when hasNativeBoxAISidebar is false and no custom boxai tab provided', () => {
            renderSidebarNav({
                props: {
                    hasNativeBoxAISidebar: false,
                    hasActivity: true,
                    customSidebarPanels: [],
                },
            });

            expect(screen.queryByTestId('sidebarboxai')).not.toBeInTheDocument();
            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
        });

        test('should render native Box AI AND other custom tabs when hasNativeBoxAISidebar is true', () => {
            // Mock icon component for custom tabs
            const MockCustomIcon = () => <div data-testid="mock-custom-icon">Custom Icon</div>;

            const boxAiPanel = createBoxAIPanel({ title: 'Custom Box AI' });
            const analyticsTab = {
                id: 'analytics',
                path: 'analytics',
                title: 'Analytics Tab',
                icon: MockCustomIcon,
                isDisabled: false,
                navButtonProps: {},
            };

            renderSidebarNav({
                props: {
                    hasNativeBoxAISidebar: true,
                    hasActivity: true,
                    customSidebarPanels: [boxAiPanel, analyticsTab],
                },
            });

            // Native Box AI should render (custom Box AI is ignored)
            const boxAiButtons = screen.getAllByTestId('sidebarboxai');
            expect(boxAiButtons).toHaveLength(1);
            expect(boxAiButtons[0]).toHaveAttribute('aria-label', 'Box AI');

            // Other custom tabs should still render alongside native Box AI
            expect(screen.getByTestId('sidebaranalytics')).toBeInTheDocument();
            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();

            // Verify order: Native Box AI first, then regular tabs, then custom tabs
            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(3);
            expect(navButtons[0]).toHaveAttribute('data-testid', 'sidebarboxai');
            expect(navButtons[1]).toHaveAttribute('data-testid', 'sidebaractivity');
            expect(navButtons[2]).toHaveAttribute('data-testid', 'sidebaranalytics');
        });
    });

    describe('multiple customSidebarPanels rendering', () => {
        // Mock icon component for custom tabs
        const MockCustomIcon = ({ testId }) => <div data-testid={testId || 'mock-custom-icon'}>Custom Icon</div>;

        // Helper function to create a generic custom tab (icon is required)
        const createCustomTab = (id, overrides = {}) => {
            const { icon = () => <MockCustomIcon testId={`mock-icon-${id}`} />, ...rest } = overrides;
            return {
                id,
                path: id,
                title: `${id.charAt(0).toUpperCase()}${id.slice(1)} Tab`,
                icon,
                isDisabled: false,
                navButtonProps: {},
                ...rest,
            };
        };

        test('should render multiple custom tabs including Box AI', () => {
            const customTab1 = createCustomTab('customtab1');
            const customTab2 = createCustomTab('customtab2');
            const boxAiPanel = createBoxAIPanel();

            renderSidebarNav({
                props: {
                    customSidebarPanels: [boxAiPanel, customTab1, customTab2],
                },
            });

            expect(screen.getByTestId('sidebarboxai')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarcustomtab1')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarcustomtab2')).toBeInTheDocument();

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(3);

            // Verify Box AI is rendered first in the DOM order
            expect(navButtons[0]).toHaveAttribute('data-testid', 'sidebarboxai');
            expect(navButtons[1]).toHaveAttribute('data-testid', 'sidebarcustomtab1');
            expect(navButtons[2]).toHaveAttribute('data-testid', 'sidebarcustomtab2');
        });

        test('should render Box AI first even when passed in different order', () => {
            const customTab1 = createCustomTab('customtab1');
            const customTab2 = createCustomTab('customtab2');
            const boxAiPanel = createBoxAIPanel();

            renderSidebarNav({
                props: {
                    customSidebarPanels: [customTab1, boxAiPanel, customTab2],
                },
            });

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(3);

            expect(navButtons[0]).toHaveAttribute('data-testid', 'sidebarboxai');
            expect(navButtons[1]).toHaveAttribute('data-testid', 'sidebarcustomtab1');
            expect(navButtons[2]).toHaveAttribute('data-testid', 'sidebarcustomtab2');
        });

        test('should render custom tabs with regular tabs', () => {
            const customTab1 = createCustomTab('analytics');
            const boxAiPanel = createBoxAIPanel();

            renderSidebarNav({
                props: {
                    hasActivity: true,
                    hasMetadata: true,
                    customSidebarPanels: [boxAiPanel, customTab1],
                },
            });

            expect(screen.getByTestId('sidebarboxai')).toBeInTheDocument();
            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarmetadata')).toBeInTheDocument();
            expect(screen.getByTestId('sidebaranalytics')).toBeInTheDocument();

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(4);

            // Verify order: Box AI first, regular tabs, then custom tabs at the end
            expect(navButtons[0]).toHaveAttribute('data-testid', 'sidebarboxai');
            expect(navButtons[3]).toHaveAttribute('data-testid', 'sidebaranalytics');
        });

        test('should handle custom tabs with different properties', () => {
            const disabledTab = createCustomTab('disabled', {
                isDisabled: true,
                title: 'Disabled Tab',
            });
            const customTitleTab = createCustomTab('customtitle', {
                title: 'Custom Title Tab',
            });

            renderSidebarNav({
                props: {
                    customSidebarPanels: [disabledTab, customTitleTab],
                },
            });

            const disabledButton = screen.getByTestId('sidebardisabled');
            const customTitleButton = screen.getByTestId('sidebarcustomtitle');

            expect(disabledButton).toBeInTheDocument();
            expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
            expect(disabledButton).toHaveAttribute('aria-label', 'Disabled Tab');

            expect(customTitleButton).toBeInTheDocument();
            expect(customTitleButton).toHaveAttribute('aria-label', 'Custom Title Tab');
        });

        test('should handle custom tabs without Box AI', () => {
            const customTab1 = createCustomTab('reports');
            const customTab2 = createCustomTab('settings');

            renderSidebarNav({
                props: {
                    hasActivity: true,
                    customSidebarPanels: [customTab1, customTab2],
                },
            });

            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarreports')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarsettings')).toBeInTheDocument();

            expect(screen.queryByTestId('sidebarboxai')).not.toBeInTheDocument();

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(3);
        });

        test('should handle empty customSidebarPanels array', () => {
            renderSidebarNav({
                props: {
                    hasActivity: true,
                    hasMetadata: true,
                    customSidebarPanels: [],
                },
            });

            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarmetadata')).toBeInTheDocument();

            expect(screen.queryByTestId('sidebarboxai')).not.toBeInTheDocument();

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(2);
        });

        test('should handle customSidebarPanels with icons', () => {
            const MockIcon = () => <div data-testid="mock-icon">Icon</div>;
            const tabWithIcon = createCustomTab('icontest', {
                icon: MockIcon,
                title: 'Tab with Icon',
            });

            renderSidebarNav({
                props: {
                    customSidebarPanels: [tabWithIcon],
                },
            });

            expect(screen.getByTestId('sidebaricontest')).toBeInTheDocument();
            expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
        });

        test('should call onPanelChange when custom tab is clicked', async () => {
            const user = userEvent();
            const onPanelChangeMock = jest.fn();
            const customTab = createCustomTab('testclick');

            renderSidebarNav({
                props: {
                    customSidebarPanels: [customTab],
                    onPanelChange: onPanelChangeMock,
                },
            });

            const button = screen.getByTestId('sidebartestclick');
            await user.click(button);

            expect(onPanelChangeMock).toHaveBeenCalledWith('testclick', false);
        });
    });

    describe('custom panel icon rendering', () => {
        const MockIconComponent = () => <div data-testid="mock-icon-component">Icon Component</div>;
        const MockIconComponent2 = () => <div data-testid="mock-icon-component-2">Icon Component 2</div>;
        const mockIconElement = <div data-testid="mock-icon-element">Icon Element</div>;

        const createCustomTab = (id, overrides = {}) => ({
            id,
            path: id,
            title: `${id.charAt(0).toUpperCase()}${id.slice(1)} Tab`,
            icon: MockIconComponent,
            isDisabled: false,
            navButtonProps: {},
            ...overrides,
        });

        test('should render custom Box AI tab with provided icon component', () => {
            const boxAiPanel = createBoxAIPanel({ icon: MockIconComponent });

            renderSidebarNav({
                props: {
                    hasNativeBoxAISidebar: false,
                    customSidebarPanels: [boxAiPanel],
                },
            });

            expect(screen.getByTestId('sidebarboxai')).toBeInTheDocument();
            expect(screen.getByTestId('mock-icon-component')).toBeInTheDocument();
        });

        test('should render custom Box AI tab with provided React element icon', () => {
            const boxAiPanel = createBoxAIPanel({ icon: mockIconElement });

            renderSidebarNav({
                props: {
                    hasNativeBoxAISidebar: false,
                    customSidebarPanels: [boxAiPanel],
                },
            });

            expect(screen.getByTestId('sidebarboxai')).toBeInTheDocument();
            expect(screen.getByTestId('mock-icon-element')).toBeInTheDocument();
        });

        test('should render other custom tab with provided icon component', () => {
            const customTab = createCustomTab('analytics', { icon: MockIconComponent });

            renderSidebarNav({
                props: {
                    customSidebarPanels: [customTab],
                },
            });

            expect(screen.getByTestId('sidebaranalytics')).toBeInTheDocument();
            expect(screen.getByTestId('mock-icon-component')).toBeInTheDocument();
        });

        test('should render other custom tab with provided React element icon', () => {
            const customTab = createCustomTab('reports', { icon: mockIconElement });

            renderSidebarNav({
                props: {
                    customSidebarPanels: [customTab],
                },
            });

            expect(screen.getByTestId('sidebarreports')).toBeInTheDocument();
            expect(screen.getByTestId('mock-icon-element')).toBeInTheDocument();
        });

        test('should render multiple custom tabs with mixed icon types', () => {
            const tabWithComponent = createCustomTab('tab1', { icon: MockIconComponent });
            const tabWithElement = createCustomTab('tab2', { icon: mockIconElement });
            const tabWithComponent2 = createCustomTab('tab3', { icon: MockIconComponent2 });

            renderSidebarNav({
                props: {
                    customSidebarPanels: [tabWithComponent, tabWithElement, tabWithComponent2],
                },
            });

            expect(screen.getByTestId('sidebartab1')).toBeInTheDocument();
            expect(screen.getByTestId('sidebartab2')).toBeInTheDocument();
            expect(screen.getByTestId('sidebartab3')).toBeInTheDocument();

            expect(screen.getByTestId('mock-icon-component')).toBeInTheDocument();
            expect(screen.getByTestId('mock-icon-element')).toBeInTheDocument();
            expect(screen.getByTestId('mock-icon-component-2')).toBeInTheDocument();
        });
    });
});

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
        return render(
            <MemoryRouter initialEntries={[path]}>
                <FeatureProvider features={features}>
                    <SidebarNav {...props} />
                </FeatureProvider>
            </MemoryRouter>,
        );
    };

    // Mock icon component for testing
    const MockBoxAIIcon = () => <div data-testid="mock-boxai-icon">BoxAI Icon</div>;

    // Helper function to create Box AI custom tab
    const createBoxAITab = (overrides = {}) => ({
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

    test('should call focusBoxAISidebarPrompt when clicked on custom Box AI Tab', async () => {
        const user = userEvent();

        renderSidebarNav({
            props: {
                customTabs: [createBoxAITab()],
            },
        });

        const button = screen.getByTestId('sidebarboxai');

        await user.click(button);

        expect(usePromptFocus).toHaveBeenCalledTimes(1);
        expect(usePromptFocus).toHaveBeenCalledWith('.be.bcs');

        expect(focusBoxAISidebarPromptMock).toHaveBeenCalledTimes(1);
        expect(focusBoxAISidebarPromptMock).toHaveBeenCalledWith();
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
                hasActivity: true,
                hasMetadata: true,
                hasSkills: true,
                customTabs: [createBoxAITab()],
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

    describe('hasNativeBoxAISidebar and customTabs interaction', () => {
        test('should render native Box AI when hasNativeBoxAISidebar is true, ignoring custom boxai tab', () => {
            const boxAiTab = createBoxAITab({ title: 'Custom Box AI' });

            renderSidebarNav({
                props: {
                    hasNativeBoxAISidebar: true,
                    customTabs: [boxAiTab],
                },
            });

            // Should only render one Box AI tab (the native one)
            const boxAiButtons = screen.getAllByTestId('sidebarboxai');
            expect(boxAiButtons).toHaveLength(1);

            // The native Box AI button should have the default tooltip, not the custom one
            expect(boxAiButtons[0]).toHaveAttribute('aria-label', 'Box AI');
        });

        test('should render custom boxai tab when hasNativeBoxAISidebar is false', () => {
            const boxAiTab = createBoxAITab({ title: 'Custom Box AI Title' });

            renderSidebarNav({
                props: {
                    hasNativeBoxAISidebar: false,
                    customTabs: [boxAiTab],
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
                    customTabs: [],
                },
            });

            expect(screen.queryByTestId('sidebarboxai')).not.toBeInTheDocument();
            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
        });

        test('should render native Box AI AND other custom tabs when hasNativeBoxAISidebar is true', () => {
            // Mock icon component for custom tabs
            const MockCustomIcon = () => <div data-testid="mock-custom-icon">Custom Icon</div>;

            const boxAiTab = createBoxAITab({ title: 'Custom Box AI' });
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
                    customTabs: [boxAiTab, analyticsTab],
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

    describe('multiple customTabs rendering', () => {
        // Mock icon component for custom tabs
        const MockCustomIcon = ({ testId }) => <div data-testid={testId || 'mock-custom-icon'}>Custom Icon</div>;

        // Helper function to create a generic custom tab
        const createCustomTab = (id, overrides = {}) => ({
            id,
            path: id,
            title: `${id.charAt(0).toUpperCase()}${id.slice(1)} Tab`,
            icon: () => <MockCustomIcon testId={`mock-icon-${id}`} />,
            isDisabled: false,
            navButtonProps: {},
            ...overrides,
        });

        test('should render multiple custom tabs including Box AI', () => {
            const customTab1 = createCustomTab('customtab1');
            const customTab2 = createCustomTab('customtab2');
            const boxAiTab = createBoxAITab();

            renderSidebarNav({
                props: {
                    customTabs: [boxAiTab, customTab1, customTab2],
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
            const boxAiTab = createBoxAITab();

            renderSidebarNav({
                props: {
                    customTabs: [customTab1, boxAiTab, customTab2],
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
            const boxAiTab = createBoxAITab();

            renderSidebarNav({
                props: {
                    hasActivity: true,
                    hasMetadata: true,
                    customTabs: [boxAiTab, customTab1],
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
                    customTabs: [disabledTab, customTitleTab],
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
                    customTabs: [customTab1, customTab2],
                },
            });

            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarreports')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarsettings')).toBeInTheDocument();

            expect(screen.queryByTestId('sidebarboxai')).not.toBeInTheDocument();

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(3);
        });

        test('should handle empty customTabs array', () => {
            renderSidebarNav({
                props: {
                    hasActivity: true,
                    hasMetadata: true,
                    customTabs: [],
                },
            });

            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarmetadata')).toBeInTheDocument();

            expect(screen.queryByTestId('sidebarboxai')).not.toBeInTheDocument();

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(2);
        });

        test('should handle customTabs with icons', () => {
            const MockIcon = () => <div data-testid="mock-icon">Icon</div>;
            const tabWithIcon = createCustomTab('icontest', {
                icon: MockIcon,
                title: 'Tab with Icon',
            });

            renderSidebarNav({
                props: {
                    customTabs: [tabWithIcon],
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
                    customTabs: [customTab],
                    onPanelChange: onPanelChangeMock,
                },
            });

            const button = screen.getByTestId('sidebartestclick');
            await user.click(button);

            expect(onPanelChangeMock).toHaveBeenCalledWith('testclick', false);
        });
    });
});

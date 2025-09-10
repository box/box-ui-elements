import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { usePromptFocus } from '@box/box-ai-content-answers';

import FeatureProvider from '../../common/feature-checking/FeatureProvider';
import SidebarNav from '../SidebarNav';

import { render, screen, userEvent } from '../../../test-utils/testing-library';

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

    // Helper function to create Box AI custom tab
    const createBoxAITab = (overrides = {}) => ({
        id: 'boxai',
        path: 'boxai',
        title: 'Box AI',
        icon: null,
        isDisabled: false,
        navButtonProps: {},
        ...overrides,
    });

    describe('individual tab rendering', () => {
        const TABS_CONFIG = {
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

    test('should call focusBoxAISidebarPrompt when clicked on Box AI Tab', async () => {
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

    describe('multiple customTabs rendering', () => {
        // Helper function to create a generic custom tab
        const createCustomTab = (id, overrides = {}) => ({
            id,
            path: id,
            title: `${id.charAt(0).toUpperCase()}${id.slice(1)} Tab`,
            icon: null,
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

            // Box AI should be rendered first (special handling)
            expect(screen.getByTestId('sidebarboxai')).toBeInTheDocument();

            // Other custom tabs should be rendered at the end
            expect(screen.getByTestId('sidebarcustomtab1')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarcustomtab2')).toBeInTheDocument();

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(3);
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

            // Box AI should be first
            expect(screen.getByTestId('sidebarboxai')).toBeInTheDocument();

            // Regular tabs
            expect(screen.getByTestId('sidebaractivity')).toBeInTheDocument();
            expect(screen.getByTestId('sidebarmetadata')).toBeInTheDocument();

            // Custom tab should be at the end
            expect(screen.getByTestId('sidebaranalytics')).toBeInTheDocument();

            const navButtons = screen.getAllByRole('tab');
            expect(navButtons).toHaveLength(4);
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

            // Box AI should not be present
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

            // No custom tabs should be present
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

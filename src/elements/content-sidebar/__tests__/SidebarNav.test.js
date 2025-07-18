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

    describe('individual tab rendering', () => {
        const TABS_CONFIG = {
            skills: { testId: 'sidebarskills', propName: 'hasSkills' },
            details: { testId: 'sidebardetails', propName: 'hasDetails' },
            activity: { testId: 'sidebaractivity', propName: 'hasActivity' },
            metadata: { testId: 'sidebarmetadata', propName: 'hasMetadata' },
            boxai: { testId: 'sidebarboxai', propName: 'hasBoxAI' },
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
                    props: { hasBoxAI: true },
                });

                const button = screen.getByTestId('sidebarboxai');

                await user.hover(button);

                expect(button).toHaveAttribute('aria-disabled', 'true');
                expect(screen.getByText(expectedTooltip)).toBeInTheDocument();
            },
        );

        test('given feature boxai.sidebar.showOnlyNavButton = false, should render box ai tab with default tooltip', async () => {
            const user = userEvent();

            renderSidebarNav({
                features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                props: { hasBoxAI: true },
            });

            const button = screen.getByTestId('sidebarboxai');

            await user.hover(button);

            expect(button).not.toHaveAttribute('aria-disabled');
            expect(screen.getByText('Box AI')).toBeInTheDocument();
        });
    });

    test('should call focusBoxAISidebarPrompt when clicked on Box AI Tab', async () => {
        const user = userEvent();

        renderSidebarNav({
            features: {
                boxai: {
                    sidebar: {
                        showOnlyNavButton: false,
                    },
                },
            },
            props: { hasBoxAI: true },
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
                hasBoxAI: true,
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

    describe('customTab functionality', () => {
        const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;

        test('should render custom tab with basic configuration', () => {
            const props = {
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel',
                    component: () => <div>Custom Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            // Should render the custom tab
            const customButton = wrapper.find('Button[data-testid="sidebarcustom-panel"]');
            expect(customButton).toHaveLength(1);
            expect(customButton.at(0).prop('aria-label')).toBe('Custom Panel');
        });

        test('should render custom tab with custom icon', () => {
            const props = {
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel',
                    icon: CustomIcon,
                    component: () => <div>Custom Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            // Should render the custom icon
            expect(wrapper.find('[data-testid="custom-icon"]')).toHaveLength(1);
        });

        test('should not render custom tab icon when no icon provided', () => {
            const props = {
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel',
                    component: () => <div>Custom Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            // Should not render icon
            expect(wrapper.find('[data-testid="custom-icon"]')).toHaveLength(0);
        });

        test('should render custom tab with string title as tooltip', () => {
            const props = {
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel Title',
                    component: () => <div>Custom Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            const customButton = wrapper.find('Button[data-testid="sidebarcustom-panel"]');
            expect(customButton).toHaveLength(1);
            expect(customButton.at(0).prop('aria-label')).toBe('Custom Panel Title');
        });

        test('should position custom tab at specified index', () => {
            const props = {
                hasActivity: true,
                hasDetails: true,
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Box AI Panel',
                    index: 1, // Should be inserted between activity and details
                    component: () => <div>Custom Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            const buttons = wrapper.find('Button[role="tab"]');
            expect(buttons).toHaveLength(3);
            // Check order: activity, custom-panel, details
            expect(buttons.at(0).prop('data-testid')).toBe('sidebaractivity');
            expect(buttons.at(1).prop('data-testid')).toBe('sidebarcustom-panel');
            expect(buttons.at(2).prop('data-testid')).toBe('sidebardetails');
        });

        test('should position custom tab at beginning when index is 0', () => {
            const props = {
                hasActivity: true,
                hasDetails: true,
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel',
                    index: 0,
                    component: () => <div>Custom Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            const buttons = wrapper.find('Button');
            expect(buttons.at(0).prop('data-testid')).toBe('sidebarcustom-panel');
        });

        test('should position custom tab at end when index is greater than available positions', () => {
            const props = {
                hasActivity: true,
                hasDetails: true,
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel',
                    index: 10, // Greater than available positions
                    component: () => <div>Custom Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            const buttons = wrapper.find('Button');
            expect(buttons.at(buttons.length - 1).prop('data-testid')).toBe('sidebarcustom-panel');
        });

        test('should not render BoxAI tab when custom tab replaces it', () => {
            const props = {
                hasBoxAI: true,
                customTab: {
                    id: 'boxai', // Same ID as BoxAI
                    title: 'Custom BoxAI',
                },
            };
            const wrapper = getWrapper(props);
            // Should not render the default BoxAI button
            expect(wrapper.find('Button[data-testid="sidebarboxai"]')).toHaveLength(1);
        });

        test('should apply additional nav button props to custom tab', () => {
            const props = {
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel',
                    navButtonProps: {
                        'data-resin-target': 'custom-resin-target',
                    },
                },
            };
            const wrapper = getWrapper(props);
            const customButton = wrapper.find('Button[data-testid="sidebarcustom-panel"]');
            expect(customButton).toHaveLength(1);
            expect(customButton.at(0).prop('data-resin-target')).toBe('custom-resin-target');
        });

        test('should handle custom tab click and call onPanelChange', async () => {
            const onPanelChangeMock = jest.fn();
            const props = {
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel',
                    component: () => <div>Custom Component</div>,
                },
                onPanelChange: onPanelChangeMock,
            };
            render(getSidebarNav({ props }));
            const button = screen.getByTestId('sidebarcustom-panel');
            await userEvent.click(button);
            expect(onPanelChangeMock).toHaveBeenCalledWith('custom-panel', false);
        });

        test('should render custom tab with complex configuration', () => {
            const props = {
                hasActivity: true,
                hasBoxAI: true,
                customTab: {
                    id: 'advanced-panel',
                    title: 'Advanced Custom Panel',
                    icon: CustomIcon,
                    index: 2,
                    navButtonProps: {
                        isDisabled: true,
                    },
                    component: () => <div>Advanced Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            const customButton = wrapper.find('Button[data-testid="sidebaradvanced-panel"]');
            expect(customButton).toHaveLength(1);
            expect(customButton.at(0).prop('disabled')).toBe(true);
            expect(customButton.at(0).prop('aria-label')).toBe('Advanced Custom Panel');
            expect(wrapper.find('[data-testid="custom-icon"]')).toHaveLength(1);
        });

        test('should handle custom tab with undefined optional properties', () => {
            const props = {
                customTab: {
                    id: 'minimal-panel',
                    component: () => <div>Minimal Component</div>,
                    // No title, icon, index, or navButtonProps
                },
            };
            const wrapper = getWrapper(props);
            const customButton = wrapper.find('Button[data-testid="sidebarminimal-panel"]');
            expect(customButton).toHaveLength(1);
            expect(customButton.at(0).prop('aria-label')).toBe('minimal-panel');
            // Should use default BoxAI logo
            expect(customButton.at(0).find(BoxAiLogo)).toHaveLength(0);
        });
    });
});

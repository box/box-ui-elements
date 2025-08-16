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

        // Test fixtures for common custom tab configurations
        const createCustomTab = (overrides = {}) => ({
            id: 'custom-panel',
            title: 'Custom Panel',
            path: 'custom-panel',
            ...overrides,
        });

        describe('basic rendering', () => {
            test('should render custom tab with basic configuration', async () => {
                const user = userEvent();
                renderSidebarNav({
                    props: {
                        customTab: createCustomTab(),
                    },
                });

                const customButton = screen.getByTestId('sidebarcustom-panel');
                expect(customButton).toBeInTheDocument();
                expect(customButton).toHaveAttribute('role', 'tab');

                await user.hover(customButton);
                expect(screen.getByText('Custom Panel')).toBeInTheDocument();
            });

            test('should render custom tab with custom icon', async () => {
                const user = userEvent();
                renderSidebarNav({
                    props: {
                        customTab: createCustomTab({
                            icon: CustomIcon,
                        }),
                    },
                });

                const customButton = screen.getByTestId('sidebarcustom-panel');
                expect(screen.getByTestId('custom-icon')).toBeInTheDocument();

                await user.hover(customButton);
                expect(screen.getByText('Custom Panel')).toBeInTheDocument();
            });

            test('should not render custom tab icon when no icon provided', () => {
                renderSidebarNav({
                    props: {
                        customTab: createCustomTab(),
                    },
                });

                expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
            });

            test('should render custom tab with string title as tooltip', async () => {
                const user = userEvent();
                renderSidebarNav({
                    props: {
                        customTab: createCustomTab({
                            title: 'Custom Panel Title',
                        }),
                    },
                });

                const customButton = screen.getByTestId('sidebarcustom-panel');
                expect(customButton).toBeInTheDocument();

                await user.hover(customButton);
                expect(screen.getByText('Custom Panel Title')).toBeInTheDocument();
            });

            test('should handle custom tab with undefined optional properties', () => {
                renderSidebarNav({
                    props: {
                        customTab: {
                            id: 'minimal-panel',
                            path: 'minimal-panel',
                            // No title, icon, index, or navButtonProps
                        },
                    },
                });

                const customButton = screen.getByTestId('sidebarminimal-panel');
                expect(customButton).toBeInTheDocument();
                expect(customButton).toHaveAttribute('aria-label', 'minimal-panel');
                expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
            });
        });

        describe('positioning and ordering', () => {
            test('should position custom tab at specified index', () => {
                renderSidebarNav({
                    props: {
                        hasActivity: true,
                        hasDetails: true,
                        customTab: createCustomTab({
                            title: 'Custom Box AI Panel',
                            index: 1, // Should be inserted between activity and details
                        }),
                    },
                });

                const buttons = screen.getAllByRole('tab');
                expect(buttons).toHaveLength(3);
                // Check order: activity, custom-panel, details
                expect(buttons[0]).toHaveAttribute('data-testid', 'sidebaractivity');
                expect(buttons[1]).toHaveAttribute('data-testid', 'sidebarcustom-panel');
                expect(buttons[2]).toHaveAttribute('data-testid', 'sidebardetails');
            });

            test('should position custom tab at beginning when index is 0', () => {
                renderSidebarNav({
                    props: {
                        hasActivity: true,
                        hasDetails: true,
                        customTab: createCustomTab({ index: 0 }),
                    },
                });

                const buttons = screen.getAllByRole('tab');
                expect(buttons[0]).toHaveAttribute('data-testid', 'sidebarcustom-panel');
            });

            test('should position custom tab at end when index is greater than available positions', () => {
                renderSidebarNav({
                    props: {
                        hasActivity: true,
                        hasDetails: true,
                        customTab: createCustomTab({ index: 10 }), // Greater than available positions
                    },
                });

                const buttons = screen.getAllByRole('tab');
                expect(buttons[buttons.length - 1]).toHaveAttribute('data-testid', 'sidebarcustom-panel');
            });

            test('should handle custom tab with undefined index', () => {
                renderSidebarNav({
                    props: {
                        hasActivity: true,
                        hasDetails: true,
                        customTab: createCustomTab({
                            // index is undefined
                        }),
                    },
                });

                const buttons = screen.getAllByRole('tab');
                // Should default to end when index is undefined
                expect(buttons[buttons.length - 1]).toHaveAttribute('data-testid', 'sidebarcustom-panel');
            });

            test('should handle single custom tab (no multiple tabs support)', () => {
                renderSidebarNav({
                    props: {
                        hasActivity: true,
                        customTab: createCustomTab({ id: 'single-tab', index: 1 }),
                    },
                });

                const buttons = screen.getAllByRole('tab');
                expect(buttons).toHaveLength(2);
                // Check order: activity, single-tab
                expect(buttons[0]).toHaveAttribute('data-testid', 'sidebaractivity');
                expect(buttons[1]).toHaveAttribute('data-testid', 'sidebarsingle-tab');
            });
        });

        describe('navigation and interaction', () => {
            test('should handle custom tab click and call onPanelChange', async () => {
                const user = userEvent();
                const onPanelChangeMock = jest.fn();

                renderSidebarNav({
                    props: {
                        customTab: createCustomTab(),
                        onPanelChange: onPanelChangeMock,
                    },
                });

                const button = screen.getByTestId('sidebarcustom-panel');
                await user.click(button);

                expect(onPanelChangeMock).toHaveBeenCalledWith('custom-panel', false);
            });

            test('should render custom tab with complex configuration', async () => {
                const user = userEvent();
                renderSidebarNav({
                    props: {
                        hasActivity: true,
                        hasBoxAI: true,
                        customTab: createCustomTab({
                            id: 'advanced-panel',
                            title: 'Advanced Custom Panel',
                            icon: CustomIcon,
                            index: 2,
                            navButtonProps: {
                                isDisabled: true,
                            },
                        }),
                    },
                });

                const customButton = screen.getByTestId('sidebaradvanced-panel');
                expect(customButton).toBeInTheDocument();
                expect(customButton).toHaveAttribute('aria-disabled', 'true');
                expect(customButton).toHaveAttribute('aria-label', 'Advanced Custom Panel');
                expect(screen.getByTestId('custom-icon')).toBeInTheDocument();

                await user.hover(customButton);
                expect(screen.getByText('Advanced Custom Panel')).toBeInTheDocument();
            });

            test('should handle custom tab with string path', async () => {
                const user = userEvent();
                const onPanelChangeMock = jest.fn();

                renderSidebarNav({
                    props: {
                        customTab: createCustomTab({
                            path: 'custom-path',
                        }),
                        onPanelChange: onPanelChangeMock,
                    },
                });

                const button = screen.getByTestId('sidebarcustom-panel');
                await user.click(button);

                // Should use the path as-is
                expect(onPanelChangeMock).toHaveBeenCalledWith('custom-path', false);
            });
        });

        describe('accessibility', () => {
            test('should have proper ARIA attributes', () => {
                renderSidebarNav({
                    props: {
                        customTab: createCustomTab(),
                    },
                });

                const customButton = screen.getByTestId('sidebarcustom-panel');
                expect(customButton).toHaveAttribute('role', 'tab');
                expect(customButton).toHaveAttribute('aria-label', 'Custom Panel');
            });

            test('should be keyboard accessible', async () => {
                const user = userEvent();
                const onPanelChangeMock = jest.fn();

                renderSidebarNav({
                    props: {
                        customTab: createCustomTab(),
                        onPanelChange: onPanelChangeMock,
                    },
                });

                const button = screen.getByTestId('sidebarcustom-panel');

                // Focus the button directly since tablist has tabindex="0"
                button.focus();
                expect(button).toHaveFocus();

                // Should respond to Enter key
                await user.keyboard('{Enter}');
                expect(onPanelChangeMock).toHaveBeenCalledWith('custom-panel', false);
            });
        });

        describe('integration with other features', () => {
            test('should work with additional tabs', () => {
                renderSidebarNav({
                    props: {
                        customTab: createCustomTab(),
                        hasAdditionalTabs: true,
                        additionalTabs: [],
                    },
                });

                const customButton = screen.getByTestId('sidebarcustom-panel');
                expect(customButton).toBeInTheDocument();

                // Additional tabs should still be rendered
                expect(screen.getByTestId('additional-tabs-overflow')).toBeInTheDocument();
            });

            test('should work with Box Sign feature', () => {
                renderSidebarNav({
                    props: {
                        customTab: createCustomTab(),
                        signSidebarProps: {
                            enabled: true,
                            onClick: () => {},
                        },
                    },
                });

                const customButton = screen.getByTestId('sidebarcustom-panel');
                expect(customButton).toBeInTheDocument();

                // Box Sign should still be rendered
                expect(screen.getByRole('button', { name: /sign/i })).toBeInTheDocument();
            });
        });
    });
});

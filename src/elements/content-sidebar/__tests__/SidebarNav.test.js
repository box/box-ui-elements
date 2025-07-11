import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mount } from 'enzyme';
import { BoxAiLogo } from '@box/blueprint-web-assets/icons/Logo';
import { usePromptFocus } from '@box/box-ai-content-answers';
import AdditionalTabPlaceholder from '../additional-tabs/AdditionalTabPlaceholder';
import AdditionalTabs from '../additional-tabs';
import AdditionalTabsLoading from '../additional-tabs/AdditionalTabsLoading';
import FeatureProvider from '../../common/feature-checking/FeatureProvider';
import DocGenIcon from '../../../icon/fill/DocGenIcon';
import IconChatRound from '../../../icons/general/IconChatRound';
import IconDocInfo from '../../../icons/general/IconDocInfo';
import IconMagicWand from '../../../icons/general/IconMagicWand';
import IconMetadataThick from '../../../icons/general/IconMetadataThick';
import SidebarNav from '../SidebarNav';
import SidebarNavButton from '../SidebarNavButton';
import SidebarNavSignButton from '../SidebarNavSignButton';
import { render, screen } from '../../../test-utils/testing-library';

jest.mock('@box/box-ai-content-answers');

describe('elements/content-sidebar/SidebarNav', () => {
    const focusBoxAISidebarPromptMock = jest.fn();

    beforeEach(() => {
        usePromptFocus.mockReturnValue({
            focusPrompt: focusBoxAISidebarPromptMock,
        });
    });

    const getWrapper = (props = {}, active = '', features = {}) =>
        mount(
            <MemoryRouter initialEntries={[`/${active}`]}>
                <FeatureProvider features={features}>
                    <SidebarNav {...props} />
                </FeatureProvider>
            </MemoryRouter>,
        )
            .find('SidebarNav')
            .at(1);

    const getSidebarNav = ({ path = '/', props, features }) => (
        <MemoryRouter initialEntries={[path]}>
            <FeatureProvider features={features}>
                <SidebarNav {...props} />
            </FeatureProvider>
        </MemoryRouter>
    );

    test('should render skills tab', () => {
        const props = {
            hasSkills: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(IconMagicWand)).toHaveLength(1);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should render details tab', () => {
        const props = {
            hasDetails: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(1);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should render activity tab', () => {
        const props = {
            hasActivity: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(1);
    });

    test('should render metadata tab', () => {
        const props = {
            hasMetadata: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(1);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should render box ai tab', () => {
        const props = {
            hasBoxAI: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(1);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    describe('should render box ai tab with correct disabled state and tooltip', () => {
        test.each`
            disabledTooltip          | expectedTooltip
            ${'tooltip msg'}         | ${'tooltip msg'}
            ${'another tooltip msg'} | ${'another tooltip msg'}
        `(
            'given feature boxai.sidebar.showOnlyNavButton = true and boxai.sidebar.disabledTooltip = $disabledTooltip, should render box ai tab with disabled state and tooltip = $expectedTooltip',
            async ({ disabledTooltip, expectedTooltip }) => {
                render(
                    getSidebarNav({
                        features: { boxai: { sidebar: { disabledTooltip, showOnlyNavButton: true } } },
                        props: { hasBoxAI: true },
                    }),
                );

                const button = screen.getByTestId('sidebarboxai');

                await userEvent.hover(button);

                expect(button).toHaveAttribute('aria-disabled', 'true');
                expect(screen.getByText(expectedTooltip)).toBeInTheDocument();
            },
        );

        test('given feature boxai.sidebar.showOnlyNavButton = false, should render box ai tab with default tooltip', async () => {
            render(
                getSidebarNav({
                    features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                    props: { hasBoxAI: true },
                }),
            );

            const button = screen.getByTestId('sidebarboxai');

            await userEvent.hover(button);

            expect(button).not.toHaveAttribute('aria-disabled');
            expect(screen.getByText('Box AI')).toBeInTheDocument();
        });
    });

    test('should call focusBoxAISidebarPrompt when clicked on Box AI Tab', async () => {
        render(
            getSidebarNav({
                features: {
                    boxai: {
                        sidebar: {
                            showOnlyNavButton: false,
                        },
                    },
                },
                props: { hasBoxAI: true },
            }),
        );

        const button = screen.getByTestId('sidebarboxai');

        await userEvent.click(button);

        expect(usePromptFocus).toHaveBeenCalledTimes(1);
        expect(usePromptFocus).toHaveBeenCalledWith('.be.bcs');

        expect(focusBoxAISidebarPromptMock).toHaveBeenCalledTimes(1);
        expect(focusBoxAISidebarPromptMock).toHaveBeenCalledWith();
    });

    test('should have multiple tabs', () => {
        const props = {
            hasActivity: true,
            hasBoxAI: true,
            hasMetadata: true,
            hasSkills: true,
        };
        const wrapper = getWrapper(props, 'activity');
        expect(wrapper.find(IconMagicWand)).toHaveLength(1);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(1);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(1);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(1);
        expect(wrapper.find(SidebarNavButton)).toHaveLength(4);
    });

    test('should render the additional tabs loading state', () => {
        const props = {
            additionalTabs: [],
            hasAdditionalTabs: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(AdditionalTabs)).toHaveLength(1);
        expect(wrapper.find(AdditionalTabsLoading)).toHaveLength(1);
        expect(wrapper.find(AdditionalTabPlaceholder)).toHaveLength(5);
    });

    test('should render the Box Sign entry point if its feature is enabled', () => {
        const props = {
            signSidebarProps: {
                enabled: true,
                onClick: () => {},
            },
        };
        const wrapper = getWrapper(props);

        expect(wrapper.exists(SidebarNavSignButton)).toBe(true);
    });
    test('should render docgen tab', () => {
        const props = {
            hasDocGen: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(DocGenIcon)).toHaveLength(1);
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
            expect(wrapper.find('Button[data-testid="sidebarcustom-panel"]')).toHaveLength(1);
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

        test('should render custom tab with default BoxAI logo when no icon provided', () => {
            const props = {
                customTab: {
                    id: 'custom-panel',
                    title: 'Custom Panel',
                    component: () => <div>Custom Component</div>,
                },
            };
            const wrapper = getWrapper(props);
            // Should render BoxAI logo as default icon
            expect(wrapper.find(BoxAiLogo)).toHaveLength(1);
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
            expect(customButton.at(0).find(BoxAiLogo)).toHaveLength(1);
        });
    });
});

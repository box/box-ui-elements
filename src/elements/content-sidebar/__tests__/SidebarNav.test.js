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
});

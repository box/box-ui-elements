import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '../../../test-utils/testing-library';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT, FEED_ITEM_TYPE_TASK } from '../../../constants';
import {
    SidebarPanelsComponent as SidebarPanelsRouter,
    SidebarPanelsDispatcherComponent as SidebarPanelsDispatcher,
    SidebarPanelsRouterDisabledComponent as SidebarPanelsRouterDisabled,
} from '../SidebarPanels';

jest.mock('../SidebarUtils');

describe('elements/content-sidebar/SidebarPanels', () => {
    const onPanelChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const createBoxAIPanel = (overrides = {}) => {
        const BoxAISidebar = () => <div data-testid="boxai-sidebar" />;
        BoxAISidebar.displayName = 'BoxAISidebar';

        return {
            id: 'boxai',
            path: 'boxai',
            component: BoxAISidebar,
            isDisabled: false,
            ...overrides,
        };
    };

    const getSidebarPanels = ({ path = '/', ...props }) => (
        <MemoryRouter initialEntries={[path]}>
            <SidebarPanelsRouter
                customSidebarPanels={[]}
                file={{ id: '1234' }}
                hasDocGen
                hasActivity
                hasDetails
                hasMetadata
                hasNativeBoxAISidebar
                hasSkills
                hasVersions
                isOpen
                onPanelChange={onPanelChange}
                {...props}
            />
        </MemoryRouter>
    );

    const renderSidebarPanels = ({ path = '/', ...props } = {}) => render(getSidebarPanels({ path, ...props }));

    describe('render', () => {
        test.each`
            path                                 | sidebar
            ${'/activity'}                       | ${'activity-sidebar'}
            ${'/activity/comments'}              | ${'activity-sidebar'}
            ${'/activity/comments/1234'}         | ${'activity-sidebar'}
            ${'/activity/tasks'}                 | ${'activity-sidebar'}
            ${'/activity/tasks/1234'}            | ${'activity-sidebar'}
            ${'/activity/annotations/1234/5678'} | ${'activity-sidebar'}
            ${'/activity/annotations/1234'}      | ${'activity-sidebar'}
            ${'/activity/versions'}              | ${'versions-sidebar'}
            ${'/activity/versions/1234'}         | ${'versions-sidebar'}
            ${'/details'}                        | ${'details-sidebar'}
            ${'/details/versions'}               | ${'versions-sidebar'}
            ${'/details/versions/1234'}          | ${'versions-sidebar'}
            ${'/metadata'}                       | ${'metadata-sidebar'}
            ${'/metadata/filteredTemplates/1,3'} | ${'metadata-sidebar'}
            ${'/skills'}                         | ${'skills-sidebar'}
            ${'/boxai'}                          | ${'boxai-sidebar'}
            ${'/docgen'}                         | ${'docgen-sidebar'}
            ${'/nonsense'}                       | ${'boxai-sidebar'}
            ${'/'}                               | ${'boxai-sidebar'}
        `('should render $sidebar given the path $path', ({ path, sidebar }) => {
            renderSidebarPanels({ path });
            expect(screen.getByTestId(sidebar)).toBeInTheDocument();
        });

        test.each`
            defaultPanel  | sidebar               | expectedPanelName
            ${'activity'} | ${'activity-sidebar'} | ${'activity'}
            ${'docgen'}   | ${'docgen-sidebar'}   | ${'docgen'}
            ${'details'}  | ${'details-sidebar'}  | ${'details'}
            ${'metadata'} | ${'metadata-sidebar'} | ${'metadata'}
            ${'skills'}   | ${'skills-sidebar'}   | ${'skills'}
            ${'boxai'}    | ${'boxai-sidebar'}    | ${'boxai'}
            ${'nonsense'} | ${'boxai-sidebar'}    | ${'boxai'}
            ${undefined}  | ${'boxai-sidebar'}    | ${'boxai'}
        `(
            'should render $sidebar and call onPanelChange with $expectedPanelName given the path = "/" and defaultPanel = $defaultPanel',
            ({ defaultPanel, sidebar, expectedPanelName }) => {
                renderSidebarPanels({
                    defaultPanel,
                });
                expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        test.each`
            defaultPanel  | expectedSidebar     | hasActivity | hasDetails | hasMetadata | hasSkills | hasDocGen | hasNativeBoxAISidebar | showOnlyBoxAINavButton | expectedPanelName
            ${'activity'} | ${'boxai-sidebar'}  | ${false}    | ${true}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'details'}  | ${'boxai-sidebar'}  | ${true}     | ${false}   | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'metadata'} | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'skills'}   | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${true}     | ${false}  | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'docgen'}   | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${true}     | ${false}  | ${false}  | ${true}               | ${false}               | ${'boxai'}
            ${'boxai'}    | ${'docgen-sidebar'} | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${false}              | ${false}               | ${'docgen'}
            ${'boxai'}    | ${'docgen-sidebar'} | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${true}               | ${true}                | ${'docgen'}
        `(
            'should render first available panel and call onPanelChange with $expectedPanelName for users without rights to render default panel, given the path = "/" and defaultPanel = $defaultPanel',
            ({
                defaultPanel,
                expectedSidebar,
                hasActivity,
                hasDetails,
                hasMetadata,
                hasSkills,
                hasDocGen,
                hasNativeBoxAISidebar,
                showOnlyBoxAINavButton,
                expectedPanelName,
            }) => {
                renderSidebarPanels({
                    features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                    defaultPanel,
                    hasActivity,
                    hasDetails,
                    hasMetadata,
                    hasSkills,
                    hasDocGen,
                    hasNativeBoxAISidebar,
                });
                expect(screen.getByTestId(expectedSidebar)).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        describe('sidebar selected with path should take precedence over default panel', () => {
            test.each`
                path                                 | sidebar               | defaultPanel  | expectedPanelName
                ${'/activity'}                       | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                ${'/activity/comments'}              | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                ${'/activity/comments/1234'}         | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                ${'/activity/tasks'}                 | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                ${'/activity/tasks/1234'}            | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                ${'/activity/annotations/1234/5678'} | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                ${'/activity/annotations/1234'}      | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                ${'/activity/versions'}              | ${'versions-sidebar'} | ${'details'}  | ${'activity'}
                ${'/activity/versions/1234'}         | ${'versions-sidebar'} | ${'details'}  | ${'activity'}
                ${'/details'}                        | ${'details-sidebar'}  | ${'activity'} | ${'details'}
                ${'/details/versions'}               | ${'versions-sidebar'} | ${'activity'} | ${'details'}
                ${'/details/versions/1234'}          | ${'versions-sidebar'} | ${'activity'} | ${'details'}
                ${'/metadata'}                       | ${'metadata-sidebar'} | ${'details'}  | ${'metadata'}
                ${'/metadata/filteredTemplates/1,3'} | ${'metadata-sidebar'} | ${'details'}  | ${'metadata'}
                ${'/skills'}                         | ${'skills-sidebar'}   | ${'details'}  | ${'skills'}
                ${'/boxai'}                          | ${'boxai-sidebar'}    | ${'details'}  | ${'boxai'}
                ${'/docgen'}                         | ${'docgen-sidebar'}   | ${'details'}  | ${'docgen'}
            `(
                'should render $sidebar and call onPanelChange with $expectedPanelName given the path = $path and defaultPanel = $defaultPanel',
                ({ path, sidebar, defaultPanel, expectedPanelName }) => {
                    renderSidebarPanels({
                        defaultPanel,
                        path,
                    });
                    expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                    expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                },
            );
        });

        test.each`
            path                                 | expectedPanelName
            ${'/activity'}                       | ${'activity'}
            ${'/activity/comments'}              | ${'activity'}
            ${'/activity/comments/1234'}         | ${'activity'}
            ${'/activity/tasks'}                 | ${'activity'}
            ${'/activity/tasks/1234'}            | ${'activity'}
            ${'/activity/annotations/1234/5678'} | ${'activity'}
            ${'/activity/annotations/1234'}      | ${'activity'}
            ${'/activity/versions'}              | ${'activity'}
            ${'/activity/versions/1234'}         | ${'activity'}
            ${'/details'}                        | ${'details'}
            ${'/details/versions'}               | ${'details'}
            ${'/details/versions/1234'}          | ${'details'}
            ${'/metadata'}                       | ${'metadata'}
            ${'/metadata/filteredTemplates/1,3'} | ${'metadata'}
            ${'/skills'}                         | ${'skills'}
            ${'/boxai'}                          | ${'boxai'}
            ${'/docgen'}                         | ${'docgen'}
            ${'/nonsense'}                       | ${'boxai'}
            ${'/'}                               | ${'boxai'}
        `('should call onPanelChange with $expectedPanelName given the path = $path', ({ path, expectedPanelName }) => {
            renderSidebarPanels({
                path,
            });
            expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
        });

        test.each`
            path                                 | hasActivity | hasDetails | hasVersions | hasMetadata | hasSkills | hasDocGen | hasNativeBoxAISidebar | showOnlyBoxAINavButton | expectedPanelName
            ${'/activity'}                       | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/activity/comments'}              | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/activity/comments/1234'}         | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/activity/tasks'}                 | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/activity/tasks/1234'}            | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/activity/annotations/1234/5678'} | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/activity/annotations/1234'}      | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/activity/versions'}              | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/activity/versions/1234'}         | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/details'}                        | ${true}     | ${false}   | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/details/versions'}               | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/details/versions/1234'}          | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/metadata'}                       | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/metadata/filteredTemplates/1,3'} | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/skills'}                         | ${true}     | ${true}    | ${true}     | ${true}     | ${false}  | ${true}   | ${true}               | ${false}               | ${'boxai'}
            ${'/docgen'}                         | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${false}  | ${true}               | ${false}               | ${'boxai'}
            ${'/boxai'}                          | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${false}              | ${false}               | ${'docgen'}
            ${'/boxai'}                          | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${true}                | ${'docgen'}
        `(
            'should call onPanelChange with $expectedPanelName given the path = $path for users without rights to render the panel for given path',
            ({
                path,
                hasActivity,
                hasDetails,
                hasVersions,
                hasMetadata,
                hasSkills,
                hasDocGen,
                hasNativeBoxAISidebar,
                showOnlyBoxAINavButton,
                expectedPanelName,
            }) => {
                renderSidebarPanels({
                    features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                    hasActivity,
                    hasDetails,
                    hasDocGen,
                    hasMetadata,
                    hasSkills,
                    hasVersions,
                    hasNativeBoxAISidebar,
                    path,
                });
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        test('should call onPanelChange only once with the initial panel value', () => {
            const { rerender } = renderSidebarPanels({
                path: '/details',
            });
            rerender(
                getSidebarPanels({
                    path: '/activity',
                }),
            );
            expect(onPanelChange).toHaveBeenCalledWith('details', true);
            expect(onPanelChange).toHaveBeenCalledTimes(1);
        });

        test('should render nothing if the sidebar is closed', () => {
            const { container } = renderSidebarPanels({
                isOpen: false,
            });
            expect(container.firstChild).toBeNull();
        });

        test('should render nothing if all sidebars are disabled', () => {
            const { container } = renderSidebarPanels({
                hasActivity: false,
                hasDetails: false,
                hasMetadata: false,
                hasNativeBoxAISidebar: false,
                hasSkills: false,
                hasVersions: false,
                hasDocGen: false,
            });
            expect(container.firstChild).toBeNull();
        });

        test('should render nothing when showOnlyNavButton is true and no other panels are available', () => {
            const { container } = renderSidebarPanels({
                features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                hasActivity: false,
                hasDetails: false,
                hasMetadata: false,
                hasSkills: false,
                hasVersions: false,
                hasDocGen: false,
            });
            expect(container.firstChild).toBeNull();
        });

        describe('activity sidebar', () => {
            test('should render with tasks deeplink', () => {
                renderSidebarPanels({ path: '/activity/tasks/12345' });
                const activitySidebar = screen.getByTestId('activity-sidebar');
                expect(activitySidebar).toHaveAttribute('data-active-feed-entry-type', FEED_ITEM_TYPE_TASK);
                expect(activitySidebar).toHaveAttribute('data-active-feed-entry-id', '12345');
            });

            test('should render with comments deeplink', () => {
                renderSidebarPanels({ path: '/activity/comments/12345' });
                const activitySidebar = screen.getByTestId('activity-sidebar');
                expect(activitySidebar).toHaveAttribute('data-active-feed-entry-type', FEED_ITEM_TYPE_COMMENT);
                expect(activitySidebar).toHaveAttribute('data-active-feed-entry-id', '12345');
            });

            test('should render with versions deeplink', () => {
                renderSidebarPanels({ path: '/activity/versions/12345' });
                const versionsSidebar = screen.getByTestId('versions-sidebar');
                expect(versionsSidebar).toHaveAttribute('data-version-id', '12345');
            });

            test('should render with annotations deeplink', () => {
                renderSidebarPanels({ path: '/activity/annotations/12345/67890' });
                const activitySidebar = screen.getByTestId('activity-sidebar');
                expect(activitySidebar).toHaveAttribute('data-active-feed-entry-type', FEED_ITEM_TYPE_ANNOTATION);
                expect(activitySidebar).toHaveAttribute('data-active-feed-entry-id', '67890');
            });

            test('should not pass down activeFeedEntry props with partial annotations deeplink', () => {
                renderSidebarPanels({ path: '/activity/annotations/12345' });
                const activitySidebar = screen.getByTestId('activity-sidebar');
                expect(activitySidebar).not.toHaveAttribute('data-active-feed-entry-type');
                expect(activitySidebar).not.toHaveAttribute('data-active-feed-entry-id');
            });
        });

        describe('metadata sidebar', () => {
            test('should render with filteredTemplates deeplink', () => {
                renderSidebarPanels({
                    path: '/metadata/filteredTemplates/123,124',
                    features: { metadata: { redesign: { enabled: true } } },
                });
                const metadataSidebar = screen.getByTestId('metadata-sidebar-redesigned');
                expect(metadataSidebar).toHaveAttribute('data-filtered-template-ids', JSON.stringify(['123', '124']));
            });

            test('should render redesigned sidebar if it is enabled', () => {
                renderSidebarPanels({
                    path: '/metadata',
                    features: { metadata: { redesign: { enabled: true } } },
                });
                expect(screen.getByTestId('metadata-sidebar-redesigned')).toBeInTheDocument();
            });
        });

        describe('details sidebar', () => {
            test('should render with versions deeplink', () => {
                renderSidebarPanels({ path: '/details/versions/12345' });
                const versionsSidebar = screen.getByTestId('versions-sidebar');
                expect(versionsSidebar).toHaveAttribute('data-version-id', '12345');
            });
        });

        describe('boxai sidebar', () => {
            test('should render native Box AI as default panel', () => {
                renderSidebarPanels({
                    features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                });
                expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
            });

            test.each`
                hasNativeBoxAISidebar | showOnlyNavButton
                ${true}               | ${true}
                ${false}              | ${true}
                ${false}              | ${false}
            `(
                'should not render native Box AI, given hasNativeBoxAISidebar = $hasNativeBoxAISidebar and feature boxai.sidebar.showOnlyNavButton = $showOnlyNavButton',
                ({ hasNativeBoxAISidebar, showOnlyNavButton }) => {
                    renderSidebarPanels({
                        features: { boxai: { sidebar: { showOnlyNavButton } } },
                        hasNativeBoxAISidebar,
                    });
                    expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                },
            );

            describe('canShowBoxAISidebarPanel eligibility', () => {
                test.each`
                    hasNativeBoxAISidebar | showOnlyNavButton | expectedEligible | description
                    ${true}               | ${false}          | ${true}          | ${'native Box AI enabled and showOnlyNavButton is false'}
                    ${true}               | ${true}           | ${false}         | ${'native Box AI enabled but showOnlyNavButton is true'}
                    ${false}              | ${false}          | ${false}         | ${'native Box AI disabled'}
                    ${false}              | ${true}           | ${false}         | ${'native Box AI disabled and showOnlyNavButton is true'}
                `(
                    'should set Box AI panel eligibility to $expectedEligible when $description',
                    ({ hasNativeBoxAISidebar, showOnlyNavButton, expectedEligible }) => {
                        renderSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton } } },
                            hasNativeBoxAISidebar,
                        });
                        if (expectedEligible) {
                            expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                        } else {
                            expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                        }
                    },
                );

                test('should redirect to first available panel when Box AI is not eligible due to showOnlyNavButton', () => {
                    renderSidebarPanels({
                        path: '/boxai',
                        features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                    });
                    // Should redirect to docgen (first in DEFAULT_SIDEBAR_VIEWS)
                    expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
                });

                test('should render custom Box AI panel when hasNativeBoxAISidebar is false and custom panel is provided', () => {
                    renderSidebarPanels({
                        path: '/boxai',
                        features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                        hasNativeBoxAISidebar: false,
                        customSidebarPanels: [createBoxAIPanel()],
                    });
                    expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                });

                test('should render custom Box AI panel when native cannot show (showOnlyNavButton)', () => {
                    const CustomBoxAIComponent = () => <div data-testid="custom-boxai-component" />;
                    renderSidebarPanels({
                        path: '/boxai',
                        features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                        customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAIComponent })],
                    });
                    // Custom Box AI renders since native route is not in Switch (canShowBoxAISidebarPanel is false)
                    expect(screen.getByTestId('custom-boxai-component')).toBeInTheDocument();
                    expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
                });
            });

            describe('custom boxai sidebar', () => {
                const CustomBoxAI = () => <div data-testid="custom-boxai-sidebar" />;

                test('should render custom Box AI sidebar as default panel', () => {
                    renderSidebarPanels({
                        hasNativeBoxAISidebar: false,
                        customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                    });
                    expect(screen.getByTestId('custom-boxai-sidebar')).toBeInTheDocument();
                    expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
                });

                test('should NOT render custom Box AI sidebar when it is disabled', () => {
                    renderSidebarPanels({
                        path: '/boxai',
                        hasNativeBoxAISidebar: false,
                        customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled: true })],
                    });
                    expect(screen.queryByTestId('custom-boxai-sidebar')).not.toBeInTheDocument();
                });

                test('should redirect to first available panel when custom Box AI sidebar is disabled', () => {
                    renderSidebarPanels({
                        path: '/boxai',
                        hasNativeBoxAISidebar: false,
                        customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled: true })],
                    });
                    // Should redirect to docgen (first in DEFAULT_SIDEBAR_VIEWS)
                    expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
                });

                test('should render custom Box AI sidebar alongside other sidebars', () => {
                    renderSidebarPanels({
                        path: '/boxai',
                        hasNativeBoxAISidebar: false,
                        hasActivity: true,
                        hasDetails: true,
                        customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                    });
                    expect(screen.getByTestId('custom-boxai-sidebar')).toBeInTheDocument();
                });

                // Matching test.each patterns for custom Box AI sidebar
                test.each`
                    path           | expectedPanelName
                    ${'/boxai'}    | ${'boxai'}
                    ${'/nonsense'} | ${'boxai'}
                    ${'/'}         | ${'boxai'}
                `(
                    'should render custom Box AI sidebar and call onPanelChange with $expectedPanelName given path = $path',
                    ({ path, expectedPanelName }) => {
                        renderSidebarPanels({
                            path,
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                        });
                        expect(screen.getByTestId('custom-boxai-sidebar')).toBeInTheDocument();
                        expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                    },
                );

                test.each`
                    defaultPanel  | sidebar                   | expectedPanelName
                    ${'boxai'}    | ${'custom-boxai-sidebar'} | ${'boxai'}
                    ${'nonsense'} | ${'custom-boxai-sidebar'} | ${'boxai'}
                    ${undefined}  | ${'custom-boxai-sidebar'} | ${'boxai'}
                `(
                    'should render $sidebar and call onPanelChange with $expectedPanelName given custom Box AI and defaultPanel = $defaultPanel',
                    ({ defaultPanel, sidebar, expectedPanelName }) => {
                        renderSidebarPanels({
                            defaultPanel,
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                        });
                        expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                        expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                    },
                );

                test.each`
                    path           | sidebar                   | defaultPanel  | expectedPanelName
                    ${'/boxai'}    | ${'custom-boxai-sidebar'} | ${'details'}  | ${'boxai'}
                    ${'/boxai'}    | ${'custom-boxai-sidebar'} | ${'activity'} | ${'boxai'}
                    ${'/activity'} | ${'activity-sidebar'}     | ${'boxai'}    | ${'activity'}
                    ${'/details'}  | ${'details-sidebar'}      | ${'boxai'}    | ${'details'}
                `(
                    'should render $sidebar given custom Box AI with path = $path and defaultPanel = $defaultPanel (path takes precedence)',
                    ({ path, sidebar, defaultPanel, expectedPanelName }) => {
                        renderSidebarPanels({
                            path,
                            defaultPanel,
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                        });
                        expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                        expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                    },
                );

                test.each`
                    isDisabled | hasDocGen | expectedSidebar           | expectedPanelName
                    ${false}   | ${true}   | ${'custom-boxai-sidebar'} | ${'boxai'}
                    ${true}    | ${true}   | ${'docgen-sidebar'}       | ${'docgen'}
                    ${true}    | ${false}  | ${'skills-sidebar'}       | ${'skills'}
                `(
                    'should render $expectedSidebar when custom Box AI isDisabled = $isDisabled and hasDocGen = $hasDocGen',
                    ({ isDisabled, hasDocGen, expectedSidebar, expectedPanelName }) => {
                        renderSidebarPanels({
                            path: '/boxai',
                            hasNativeBoxAISidebar: false,
                            hasDocGen,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled })],
                        });
                        expect(screen.getByTestId(expectedSidebar)).toBeInTheDocument();
                        expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                    },
                );
            });
        });

        describe('first loaded behavior', () => {
            test('should update isInitialized state on mount', () => {
                renderSidebarPanels({ path: '/activity' });
                const activitySidebar = screen.getByTestId('activity-sidebar');
                expect(activitySidebar).toHaveAttribute('data-has-sidebar-initialized', 'true');
            });
        });
    });

    describe('refresh()', () => {
        test.each([true, false])('should call the sidebars with the appropriate argument', shouldRefreshCache => {
            const sidebarPanelsRef = React.createRef();

            renderSidebarPanels({
                path: '/activity',
                ref: sidebarPanelsRef,
            });

            // Create mock refresh functions for each sidebar
            const mockRefreshFunctions = {
                boxAISidebar: jest.fn(),
                activitySidebar: jest.fn(),
                detailsSidebar: jest.fn(),
                metadataSidebar: jest.fn(),
                versionsSidebar: jest.fn(),
            };

            // Mock the sidebar refs
            Object.keys(mockRefreshFunctions).forEach(sidebarName => {
                sidebarPanelsRef.current[sidebarName] = {
                    current: { refresh: mockRefreshFunctions[sidebarName] },
                };
            });

            // Call the refresh method
            sidebarPanelsRef.current.refresh(shouldRefreshCache);

            // Verify the calls
            expect(mockRefreshFunctions.activitySidebar).toHaveBeenCalledWith(shouldRefreshCache);
            expect(mockRefreshFunctions.boxAISidebar).toHaveBeenCalledWith();
            expect(mockRefreshFunctions.detailsSidebar).toHaveBeenCalledWith();
            expect(mockRefreshFunctions.metadataSidebar).toHaveBeenCalledWith();
            expect(mockRefreshFunctions.versionsSidebar).toHaveBeenCalledWith();
        });

        test('should not throw when custom sidebar does not implement refresh', () => {
            const sidebarPanelsRef = React.createRef();

            renderSidebarPanels({
                hasNativeBoxAISidebar: false,
                ref: sidebarPanelsRef,
            });

            // Custom sidebar without refresh method
            sidebarPanelsRef.current.customSidebars.set('customPanel', { current: {} });

            expect(() => sidebarPanelsRef.current.refresh()).not.toThrow();
        });

        test('should call refresh on custom sidebars that implement it', () => {
            const sidebarPanelsRef = React.createRef();
            const mockRefresh = jest.fn();

            renderSidebarPanels({
                hasNativeBoxAISidebar: false,
                ref: sidebarPanelsRef,
            });

            sidebarPanelsRef.current.customSidebars.set('customPanel', { current: { refresh: mockRefresh } });

            sidebarPanelsRef.current.refresh();

            expect(mockRefresh).toHaveBeenCalled();
        });
    });

    describe('componentDidUpdate', () => {
        const mockOnVersionChange = jest.fn();

        test.each([
            ['/activity/versions/123', '/activity/versions/456'],
            ['/activity/versions/123', '/details/versions/456'],
            ['/activity/versions', '/activity/versions/123'],
            ['/activity/versions', '/details/versions'],
        ])('should not reset the current version if the versions route is still active', (prevPathname, pathname) => {
            const { rerender } = renderSidebarPanels({
                path: prevPathname,
                onVersionChange: mockOnVersionChange,
                location: { pathname: prevPathname },
            });

            rerender(
                getSidebarPanels({
                    path: pathname,
                    onVersionChange: mockOnVersionChange,
                    location: { pathname },
                }),
            );

            expect(mockOnVersionChange).not.toHaveBeenCalled();
        });

        test.each([true, false])('should not reset the current version if the sidebar is toggled', isOpen => {
            const { rerender } = renderSidebarPanels({
                path: '/details/versions/123',
                isOpen,
                onVersionChange: mockOnVersionChange,
                location: { pathname: '/details/versions/123' },
            });

            rerender(
                getSidebarPanels({
                    path: '/details/versions/123',
                    isOpen: !isOpen,
                    onVersionChange: mockOnVersionChange,
                    location: { pathname: '/details/versions/123' },
                }),
            );

            expect(mockOnVersionChange).not.toHaveBeenCalled();
        });

        test.each([
            ['/activity/versions/123', '/metadata'],
            ['/activity/versions/123', '/activity'],
            ['/activity/versions', '/metadata'],
            ['/details/versions/123', '/metadata'],
            ['/details/versions/123', '/details'],
            ['/details/versions', '/metadata'],
        ])('should reset the current version if the versions route is no longer active', (prevPathname, pathname) => {
            const { rerender } = renderSidebarPanels({
                path: prevPathname,
                onVersionChange: mockOnVersionChange,
                location: { pathname: prevPathname },
            });

            rerender(
                getSidebarPanels({
                    path: pathname,
                    onVersionChange: mockOnVersionChange,
                    location: { pathname },
                }),
            );

            expect(mockOnVersionChange).toHaveBeenCalledWith(null);
        });

        test.each([
            ['/activity/versions/123', '/activity/annotations/123/456'],
            ['/activity/versions/123', '/activity/annotations/123'],
            ['/details/versions/123', '/activity/annotations/456/789'],
        ])(
            'should tag the version reset as triggered by an annotation when transitioning to an annotations path',
            (prevPathname, pathname) => {
                const { rerender } = renderSidebarPanels({
                    path: prevPathname,
                    onVersionChange: mockOnVersionChange,
                    location: { pathname: prevPathname },
                });

                rerender(
                    getSidebarPanels({
                        path: pathname,
                        onVersionChange: mockOnVersionChange,
                        location: { pathname },
                    }),
                );

                expect(mockOnVersionChange).toHaveBeenCalledWith(null, { triggeredBy: 'annotation' });
            },
        );
    });

    describe('multiple customSidebarPanels rendering', () => {
        const createCustomPanel = (id, overrides = {}) => ({
            id,
            path: id,
            component: () => <div data-testid={`${id}-sidebar`} />,
            isDisabled: false,
            ...overrides,
        });

        test('should render multiple custom panels including Box AI', () => {
            const customSidebarPanels = [
                createBoxAIPanel(),
                createCustomPanel('custom1', { title: 'Custom Panel 1' }),
                createCustomPanel('custom2', { title: 'Custom Panel 2' }),
            ];

            renderSidebarPanels({
                path: '/boxai',
                customSidebarPanels,
            });

            expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
            expect(screen.queryByTestId('custom1-sidebar')).not.toBeInTheDocument();
            expect(screen.queryByTestId('custom2-sidebar')).not.toBeInTheDocument();
        });

        test('should render custom panels with regular panels', () => {
            const customSidebarPanels = [
                createCustomPanel('analytics', { title: 'Analytics Panel' }),
                createCustomPanel('reports', { title: 'Reports Panel' }),
            ];

            const { unmount } = renderSidebarPanels({
                path: '/analytics',
                customSidebarPanels,
                hasActivity: true,
                hasMetadata: true,
            });

            expect(screen.getByTestId('analytics-sidebar')).toBeInTheDocument();

            unmount();

            renderSidebarPanels({
                path: '/reports',
                customSidebarPanels,
                hasActivity: true,
                hasMetadata: true,
            });

            expect(screen.getByTestId('reports-sidebar')).toBeInTheDocument();
        });

        test('should handle custom panels with different properties', () => {
            const disabledPanel = createCustomPanel('disabled', {
                isDisabled: true,
                title: 'Disabled Panel',
            });
            const enabledPanel = createCustomPanel('enabled', {
                title: 'Enabled Panel',
            });

            const { unmount } = renderSidebarPanels({
                path: '/enabled',
                customSidebarPanels: [disabledPanel, enabledPanel],
            });

            expect(screen.getByTestId('enabled-sidebar')).toBeInTheDocument();

            unmount();

            renderSidebarPanels({
                path: '/disabled',
                customSidebarPanels: [disabledPanel, enabledPanel],
            });

            expect(screen.queryByTestId('disabled-sidebar')).not.toBeInTheDocument();
        });

        test('should handle empty custom panels array', () => {
            renderSidebarPanels({
                path: '/activity',
                customSidebarPanels: [],
                hasActivity: true,
            });

            expect(screen.getByTestId('activity-sidebar')).toBeInTheDocument();
        });

        test('should handle custom panels with Box AI in different positions', () => {
            const customSidebarPanels = [
                createCustomPanel('before', { title: 'Before Box AI' }),
                createBoxAIPanel(),
                createCustomPanel('after', { title: 'After Box AI' }),
            ];

            const { unmount: unmountBoxAI } = renderSidebarPanels({
                path: '/boxai',
                customSidebarPanels,
            });
            expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
            unmountBoxAI();

            const { unmount: unmountBefore } = renderSidebarPanels({
                path: '/before',
                customSidebarPanels,
            });
            expect(screen.getByTestId('before-sidebar')).toBeInTheDocument();
            unmountBefore();

            renderSidebarPanels({
                path: '/after',
                customSidebarPanels,
            });
            expect(screen.getByTestId('after-sidebar')).toBeInTheDocument();
        });

        test('should call onPanelChange with correct panel names for custom panels', () => {
            const customSidebarPanels = [createCustomPanel('dashboard', { title: 'Dashboard' }), createBoxAIPanel()];

            renderSidebarPanels({
                path: '/dashboard',
                customSidebarPanels,
            });
            expect(onPanelChange).toHaveBeenCalledWith('dashboard', true);

            onPanelChange.mockClear();

            renderSidebarPanels({
                path: '/boxai',
                customSidebarPanels,
            });
            expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
        });

        test('should render other custom panels alongside native Box AI', () => {
            const analyticsPanel = createCustomPanel('analytics', { title: 'Analytics Panel' });
            const boxAiPanel = createBoxAIPanel();

            renderSidebarPanels({
                path: '/analytics',
                customSidebarPanels: [boxAiPanel, analyticsPanel],
            });

            expect(screen.getByTestId('analytics-sidebar')).toBeInTheDocument();
        });
    });

    describe('routerDisabled mode', () => {
        const mockInternalSidebarNavigationHandler = jest.fn();

        beforeEach(() => {
            mockInternalSidebarNavigationHandler.mockClear();
        });

        const getSidebarPanelsRouterDisabled = (props = {}) => (
            <SidebarPanelsRouterDisabled
                customSidebarPanels={[]}
                file={{ id: '1234' }}
                hasDocGen
                hasActivity
                hasDetails
                hasMetadata
                hasNativeBoxAISidebar
                hasSkills
                hasVersions
                isOpen
                onPanelChange={onPanelChange}
                internalSidebarNavigationHandler={mockInternalSidebarNavigationHandler}
                {...props}
            />
        );

        const renderSidebarPanelsRouterDisabled = (props = {}) => render(getSidebarPanelsRouterDisabled(props));

        describe('render', () => {
            test.each`
                internalSidebarNavigation                                                                                        | sidebar
                ${{ sidebar: 'activity' }}                                                                                       | ${'activity-sidebar'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'comments' }}                                                      | ${'activity-sidebar'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'comments', activeFeedEntryId: '1234' }}                           | ${'activity-sidebar'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'tasks' }}                                                         | ${'activity-sidebar'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'tasks', activeFeedEntryId: '1234' }}                              | ${'activity-sidebar'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', activeFeedEntryId: '5678', fileVersionId: '1234' }} | ${'activity-sidebar'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', fileVersionId: '1234' }}                            | ${'activity-sidebar'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'versions' }}                                                      | ${'versions-sidebar'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '1234' }}                                   | ${'versions-sidebar'}
                ${{ sidebar: 'details' }}                                                                                        | ${'details-sidebar'}
                ${{ sidebar: 'details', activeFeedEntryType: 'versions' }}                                                       | ${'versions-sidebar'}
                ${{ sidebar: 'details', activeFeedEntryType: 'versions', versionId: '1234' }}                                    | ${'versions-sidebar'}
                ${{ sidebar: 'metadata' }}                                                                                       | ${'metadata-sidebar'}
                ${{ sidebar: 'metadata', filteredTemplateIds: ['1', '3'] }}                                                      | ${'metadata-sidebar'}
                ${{ sidebar: 'skills' }}                                                                                         | ${'skills-sidebar'}
                ${{ sidebar: 'boxai' }}                                                                                          | ${'boxai-sidebar'}
                ${{ sidebar: 'docgen' }}                                                                                         | ${'docgen-sidebar'}
                ${{ sidebar: 'nonsense' }}                                                                                       | ${'boxai-sidebar'}
                ${undefined}                                                                                                     | ${'boxai-sidebar'}
            `(
                'should render $sidebar given internalSidebarNavigation = $internalSidebarNavigation',
                ({ internalSidebarNavigation, sidebar }) => {
                    renderSidebarPanelsRouterDisabled({ internalSidebarNavigation });
                    expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                },
            );

            test.each`
                defaultPanel  | sidebar               | expectedPanelName
                ${'activity'} | ${'activity-sidebar'} | ${'activity'}
                ${'docgen'}   | ${'docgen-sidebar'}   | ${'docgen'}
                ${'details'}  | ${'details-sidebar'}  | ${'details'}
                ${'metadata'} | ${'metadata-sidebar'} | ${'metadata'}
                ${'skills'}   | ${'skills-sidebar'}   | ${'skills'}
                ${'boxai'}    | ${'boxai-sidebar'}    | ${'boxai'}
                ${'nonsense'} | ${'boxai-sidebar'}    | ${'boxai'}
                ${undefined}  | ${'boxai-sidebar'}    | ${'boxai'}
            `(
                'should render $sidebar and call onPanelChange with $expectedPanelName given internalSidebarNavigation = undefined and defaultPanel = $defaultPanel',
                ({ defaultPanel, sidebar, expectedPanelName }) => {
                    renderSidebarPanelsRouterDisabled({
                        defaultPanel,
                        internalSidebarNavigation: undefined,
                    });
                    expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                    expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                },
            );

            test.each`
                defaultPanel  | expectedSidebar     | hasActivity | hasDetails | hasMetadata | hasSkills | hasDocGen | hasNativeBoxAISidebar | showOnlyBoxAINavButton | expectedPanelName
                ${'activity'} | ${'boxai-sidebar'}  | ${false}    | ${true}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${'details'}  | ${'boxai-sidebar'}  | ${true}     | ${false}   | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${'metadata'} | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${'skills'}   | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${true}     | ${false}  | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${'docgen'}   | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${true}     | ${false}  | ${false}  | ${true}               | ${false}               | ${'boxai'}
                ${'boxai'}    | ${'docgen-sidebar'} | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${false}              | ${false}               | ${'docgen'}
                ${'boxai'}    | ${'docgen-sidebar'} | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${true}               | ${true}                | ${'docgen'}
            `(
                'should render first available panel and call onPanelChange with $expectedPanelName for users without rights to render default panel, given internalSidebarNavigation = undefined and defaultPanel = $defaultPanel',
                ({
                    defaultPanel,
                    expectedSidebar,
                    hasActivity,
                    hasDetails,
                    hasMetadata,
                    hasSkills,
                    hasDocGen,
                    hasNativeBoxAISidebar,
                    showOnlyBoxAINavButton,
                    expectedPanelName,
                }) => {
                    renderSidebarPanelsRouterDisabled({
                        features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                        defaultPanel,
                        hasActivity,
                        hasDetails,
                        hasMetadata,
                        hasSkills,
                        hasDocGen,
                        hasNativeBoxAISidebar,
                        internalSidebarNavigation: undefined,
                    });

                    expect(screen.getByTestId(expectedSidebar)).toBeInTheDocument();
                    expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                },
            );

            describe('sidebar selected with internalSidebarNavigation should take precedence over default panel', () => {
                test.each`
                    internalSidebarNavigation                                                                                        | sidebar               | defaultPanel  | expectedPanelName
                    ${{ sidebar: 'activity' }}                                                                                       | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'activity', activeFeedEntryType: 'comments' }}                                                      | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'activity', activeFeedEntryType: 'comments', activeFeedEntryId: '1234' }}                           | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'activity', activeFeedEntryType: 'tasks' }}                                                         | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'activity', activeFeedEntryType: 'tasks', activeFeedEntryId: '1234' }}                              | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', activeFeedEntryId: '5678', fileVersionId: '1234' }} | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', fileVersionId: '1234' }}                            | ${'activity-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'activity', activeFeedEntryType: 'versions' }}                                                      | ${'versions-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '1234' }}                                   | ${'versions-sidebar'} | ${'details'}  | ${'activity'}
                    ${{ sidebar: 'details' }}                                                                                        | ${'details-sidebar'}  | ${'activity'} | ${'details'}
                    ${{ sidebar: 'details', activeFeedEntryType: 'versions' }}                                                       | ${'versions-sidebar'} | ${'activity'} | ${'details'}
                    ${{ sidebar: 'details', activeFeedEntryType: 'versions', versionId: '1234' }}                                    | ${'versions-sidebar'} | ${'activity'} | ${'details'}
                    ${{ sidebar: 'metadata' }}                                                                                       | ${'metadata-sidebar'} | ${'details'}  | ${'metadata'}
                    ${{ sidebar: 'metadata', filteredTemplateIds: ['1', '3'] }}                                                      | ${'metadata-sidebar'} | ${'details'}  | ${'metadata'}
                    ${{ sidebar: 'skills' }}                                                                                         | ${'skills-sidebar'}   | ${'details'}  | ${'skills'}
                    ${{ sidebar: 'boxai' }}                                                                                          | ${'boxai-sidebar'}    | ${'details'}  | ${'boxai'}
                    ${{ sidebar: 'docgen' }}                                                                                         | ${'docgen-sidebar'}   | ${'details'}  | ${'docgen'}
                `(
                    'should render $sidebar and call onPanelChange with $expectedPanelName given internalSidebarNavigation = $internalSidebarNavigation and defaultPanel = $defaultPanel',
                    ({ internalSidebarNavigation, sidebar, defaultPanel, expectedPanelName }) => {
                        renderSidebarPanelsRouterDisabled({
                            defaultPanel,
                            internalSidebarNavigation,
                        });
                        expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                        expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                    },
                );
            });

            test.each`
                internalSidebarNavigation                                                                                        | expectedPanelName
                ${{ sidebar: 'activity' }}                                                                                       | ${'activity'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'comments' }}                                                      | ${'activity'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'comments', activeFeedEntryId: '1234' }}                           | ${'activity'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'tasks' }}                                                         | ${'activity'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'tasks', activeFeedEntryId: '1234' }}                              | ${'activity'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', activeFeedEntryId: '5678', fileVersionId: '1234' }} | ${'activity'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', fileVersionId: '1234' }}                            | ${'activity'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'versions' }}                                                      | ${'activity'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '1234' }}                                   | ${'activity'}
                ${{ sidebar: 'details' }}                                                                                        | ${'details'}
                ${{ sidebar: 'details', activeFeedEntryType: 'versions' }}                                                       | ${'details'}
                ${{ sidebar: 'details', activeFeedEntryType: 'versions', versionId: '1234' }}                                    | ${'details'}
                ${{ sidebar: 'metadata' }}                                                                                       | ${'metadata'}
                ${{ sidebar: 'metadata', filteredTemplateIds: ['1', '3'] }}                                                      | ${'metadata'}
                ${{ sidebar: 'skills' }}                                                                                         | ${'skills'}
                ${{ sidebar: 'boxai' }}                                                                                          | ${'boxai'}
                ${{ sidebar: 'docgen' }}                                                                                         | ${'docgen'}
                ${{ sidebar: 'nonsense' }}                                                                                       | ${'boxai'}
                ${undefined}                                                                                                     | ${'boxai'}
            `(
                'should call onPanelChange with $expectedPanelName given internalSidebarNavigation = $internalSidebarNavigation',
                ({ internalSidebarNavigation, expectedPanelName }) => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation,
                    });
                    expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                },
            );

            test.each`
                internalSidebarNavigation                                                                                        | hasActivity | hasDetails | hasVersions | hasMetadata | hasSkills | hasDocGen | hasNativeBoxAISidebar | showOnlyBoxAINavButton | expectedPanelName
                ${{ sidebar: 'activity' }}                                                                                       | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'comments' }}                                                      | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'comments', activeFeedEntryId: '1234' }}                           | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'tasks' }}                                                         | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'tasks', activeFeedEntryId: '1234' }}                              | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', activeFeedEntryId: '5678', fileVersionId: '1234' }} | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', fileVersionId: '1234' }}                            | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'versions' }}                                                      | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '1234' }}                                   | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'details' }}                                                                                        | ${true}     | ${false}   | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'details', activeFeedEntryType: 'versions' }}                                                       | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'details', activeFeedEntryType: 'versions', versionId: '1234' }}                                    | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'metadata' }}                                                                                       | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'metadata', filteredTemplateIds: ['1', '3'] }}                                                      | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'skills' }}                                                                                         | ${true}     | ${true}    | ${true}     | ${true}     | ${false}  | ${true}   | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'docgen' }}                                                                                         | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${false}  | ${true}               | ${false}               | ${'boxai'}
                ${{ sidebar: 'boxai' }}                                                                                          | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${false}              | ${false}               | ${'docgen'}
                ${{ sidebar: 'boxai' }}                                                                                          | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${true}                | ${'docgen'}
            `(
                'should call onPanelChange with $expectedPanelName given internalSidebarNavigation = $internalSidebarNavigation for users without rights to render the panel for given navigation',
                ({
                    internalSidebarNavigation,
                    hasActivity,
                    hasDetails,
                    hasVersions,
                    hasMetadata,
                    hasSkills,
                    hasDocGen,
                    hasNativeBoxAISidebar,
                    showOnlyBoxAINavButton,
                    expectedPanelName,
                }) => {
                    renderSidebarPanelsRouterDisabled({
                        features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                        hasActivity,
                        hasNativeBoxAISidebar,
                        hasDetails,
                        hasDocGen,
                        hasMetadata,
                        hasSkills,
                        hasVersions,
                        internalSidebarNavigation,
                    });
                    expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                },
            );

            test('should call onPanelChange only once with the initial panel value', () => {
                const { rerender } = renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'details' },
                });
                rerender(
                    getSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: { sidebar: 'activity' },
                    }),
                );
                expect(onPanelChange).toHaveBeenCalledWith('details', true);
                expect(onPanelChange).toHaveBeenCalledTimes(1);
            });

            test('should render nothing if the sidebar is closed', () => {
                const { container } = renderSidebarPanelsRouterDisabled({
                    isOpen: false,
                });
                expect(container.firstChild).toBeNull();
            });

            test('should render nothing if all sidebars are disabled', () => {
                const { container } = renderSidebarPanelsRouterDisabled({
                    hasNativeBoxAISidebar: false,
                    hasActivity: false,
                    hasDetails: false,
                    hasMetadata: false,
                    hasSkills: false,
                    hasVersions: false,
                    hasDocGen: false,
                });
                expect(container.firstChild).toBeNull();
            });

            test('should render nothing when showOnlyNavButton is true and no other panels are available', () => {
                const { container } = renderSidebarPanelsRouterDisabled({
                    features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                    hasActivity: false,
                    hasDetails: false,
                    hasMetadata: false,
                    hasSkills: false,
                    hasVersions: false,
                    hasDocGen: false,
                });
                expect(container.firstChild).toBeNull();
            });

            describe('activity sidebar', () => {
                test('should render with tasks deeplink', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'activity',
                            activeFeedEntryType: 'tasks',
                            activeFeedEntryId: '12345',
                        },
                    });
                    const activitySidebar = screen.getByTestId('activity-sidebar');
                    expect(activitySidebar).toHaveAttribute('data-active-feed-entry-type', FEED_ITEM_TYPE_TASK);
                    expect(activitySidebar).toHaveAttribute('data-active-feed-entry-id', '12345');
                });

                test('should render with comments deeplink', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'activity',
                            activeFeedEntryType: 'comments',
                            activeFeedEntryId: '12345',
                        },
                    });
                    const activitySidebar = screen.getByTestId('activity-sidebar');
                    expect(activitySidebar).toHaveAttribute('data-active-feed-entry-type', FEED_ITEM_TYPE_COMMENT);
                    expect(activitySidebar).toHaveAttribute('data-active-feed-entry-id', '12345');
                });

                test('should render with versions deeplink', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'activity',
                            activeFeedEntryType: 'versions',
                            versionId: '12345',
                        },
                    });
                    const versionsSidebar = screen.getByTestId('versions-sidebar');
                    expect(versionsSidebar).toHaveAttribute('data-version-id', '12345');
                });

                test('should render with annotations deeplink', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'activity',
                            activeFeedEntryType: 'annotations',
                            fileVersionId: '12345',
                            activeFeedEntryId: '67890',
                        },
                    });
                    const activitySidebar = screen.getByTestId('activity-sidebar');
                    expect(activitySidebar).toHaveAttribute('data-active-feed-entry-type', FEED_ITEM_TYPE_ANNOTATION);
                    expect(activitySidebar).toHaveAttribute('data-active-feed-entry-id', '67890');
                });

                test('should not pass down activeFeedEntry props with partial annotations deeplink', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'activity',
                            activeFeedEntryType: 'annotations',
                            fileVersionId: '12345',
                        },
                    });
                    const activitySidebar = screen.getByTestId('activity-sidebar');
                    expect(activitySidebar).not.toHaveAttribute('data-active-feed-entry-type');
                    expect(activitySidebar).not.toHaveAttribute('data-active-feed-entry-id');
                });
            });

            describe('metadata sidebar', () => {
                test('should render with filteredTemplates deeplink', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'metadata',
                            filteredTemplateIds: ['123', '124'],
                        },
                        features: { metadata: { redesign: { enabled: true } } },
                    });
                    const metadataSidebar = screen.getByTestId('metadata-sidebar-redesigned');
                    expect(metadataSidebar).toHaveAttribute(
                        'data-filtered-template-ids',
                        JSON.stringify(['123', '124']),
                    );
                });

                test('should render redesigned sidebar if it is enabled', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'metadata',
                        },
                        features: { metadata: { redesign: { enabled: true } } },
                    });
                    expect(screen.getByTestId('metadata-sidebar-redesigned')).toBeInTheDocument();
                });
            });

            describe('details sidebar', () => {
                test('should render with versions deeplink', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'details',
                            activeFeedEntryType: 'versions',
                            versionId: '12345',
                        },
                    });
                    const versionsSidebar = screen.getByTestId('versions-sidebar');
                    expect(versionsSidebar).toHaveAttribute('data-version-id', '12345');
                });
            });

            describe('boxai sidebar', () => {
                test('should render native Box AI as default panel', () => {
                    renderSidebarPanelsRouterDisabled({
                        features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                    });
                    expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                });

                test.each`
                    hasNativeBoxAISidebar | showOnlyNavButton
                    ${true}               | ${true}
                    ${false}              | ${true}
                    ${false}              | ${false}
                `(
                    'should not render native Box AI, given hasNativeBoxAISidebar = $hasNativeBoxAISidebar and feature boxai.sidebar.showOnlyNavButton = $showOnlyNavButton',
                    ({ hasNativeBoxAISidebar, showOnlyNavButton }) => {
                        renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: {
                                sidebar: 'boxai',
                            },
                            features: { boxai: { sidebar: { showOnlyNavButton } } },
                            hasNativeBoxAISidebar,
                        });
                        expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                    },
                );

                describe('canShowBoxAISidebarPanel eligibility', () => {
                    test.each`
                        hasNativeBoxAISidebar | showOnlyNavButton | expectedEligible | description
                        ${true}               | ${false}          | ${true}          | ${'native Box AI enabled and showOnlyNavButton is false'}
                        ${true}               | ${true}           | ${false}         | ${'native Box AI enabled but showOnlyNavButton is true'}
                        ${false}              | ${false}          | ${false}         | ${'native Box AI disabled'}
                        ${false}              | ${true}           | ${false}         | ${'native Box AI disabled and showOnlyNavButton is true'}
                    `(
                        'should set Box AI panel eligibility to $expectedEligible when $description',
                        ({ hasNativeBoxAISidebar, showOnlyNavButton, expectedEligible }) => {
                            renderSidebarPanelsRouterDisabled({
                                internalSidebarNavigation: { sidebar: 'boxai' },
                                features: { boxai: { sidebar: { showOnlyNavButton } } },
                                hasNativeBoxAISidebar,
                            });
                            if (expectedEligible) {
                                expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                            } else {
                                expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                            }
                        },
                    );

                    test('should fall back to first available panel when Box AI is not eligible due to showOnlyNavButton', () => {
                        renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: { sidebar: 'boxai' },
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                        });
                        // Should fall back to docgen (first in DEFAULT_SIDEBAR_VIEWS)
                        expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
                    });

                    test('should render custom Box AI panel when hasNativeBoxAISidebar is false and custom panel is provided', () => {
                        renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: { sidebar: 'boxai' },
                            features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel()],
                        });
                        expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                    });

                    test('should render custom Box AI panel when native cannot show (showOnlyNavButton)', () => {
                        const CustomBoxAIComponent = () => <div data-testid="custom-boxai-component" />;
                        renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: { sidebar: 'boxai' },
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAIComponent })],
                        });
                        // Custom Box AI renders since native Box AI cannot be shown (canShowBoxAISidebarPanel is false)
                        expect(screen.getByTestId('custom-boxai-component')).toBeInTheDocument();
                        expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
                    });
                });

                describe('custom boxai sidebar', () => {
                    const CustomBoxAI = () => <div data-testid="custom-boxai-sidebar" />;

                    test('should render custom Box AI sidebar as default panel', () => {
                        renderSidebarPanelsRouterDisabled({
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                        });
                        expect(screen.getByTestId('custom-boxai-sidebar')).toBeInTheDocument();
                        expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
                    });

                    test('should NOT render custom Box AI sidebar when it is disabled', () => {
                        renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: { sidebar: 'boxai' },
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled: true })],
                        });
                        expect(screen.queryByTestId('custom-boxai-sidebar')).not.toBeInTheDocument();
                    });

                    test('should fall back to first available panel when custom Box AI sidebar is disabled', () => {
                        renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: { sidebar: 'boxai' },
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled: true })],
                        });
                        // Should fall back to docgen (first in DEFAULT_SIDEBAR_VIEWS)
                        expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
                    });

                    test.each`
                        internalSidebarNavigation  | expectedPanelName
                        ${{ sidebar: 'boxai' }}    | ${'boxai'}
                        ${{ sidebar: 'nonsense' }} | ${'boxai'}
                        ${undefined}               | ${'boxai'}
                    `(
                        'should render custom Box AI sidebar and call onPanelChange with $expectedPanelName given internalSidebarNavigation = $internalSidebarNavigation',
                        ({ internalSidebarNavigation, expectedPanelName }) => {
                            renderSidebarPanelsRouterDisabled({
                                internalSidebarNavigation,
                                hasNativeBoxAISidebar: false,
                                customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                            });
                            expect(screen.getByTestId('custom-boxai-sidebar')).toBeInTheDocument();
                            expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                        },
                    );

                    test.each`
                        defaultPanel  | sidebar                   | expectedPanelName
                        ${'boxai'}    | ${'custom-boxai-sidebar'} | ${'boxai'}
                        ${'nonsense'} | ${'custom-boxai-sidebar'} | ${'boxai'}
                        ${undefined}  | ${'custom-boxai-sidebar'} | ${'boxai'}
                    `(
                        'should render $sidebar and call onPanelChange with $expectedPanelName given custom Box AI and defaultPanel = $defaultPanel',
                        ({ defaultPanel, sidebar, expectedPanelName }) => {
                            renderSidebarPanelsRouterDisabled({
                                defaultPanel,
                                hasNativeBoxAISidebar: false,
                                customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                            });
                            expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                            expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                        },
                    );

                    test.each`
                        internalSidebarNavigation  | sidebar                   | defaultPanel  | expectedPanelName
                        ${{ sidebar: 'boxai' }}    | ${'custom-boxai-sidebar'} | ${'details'}  | ${'boxai'}
                        ${{ sidebar: 'boxai' }}    | ${'custom-boxai-sidebar'} | ${'activity'} | ${'boxai'}
                        ${{ sidebar: 'activity' }} | ${'activity-sidebar'}     | ${'boxai'}    | ${'activity'}
                        ${{ sidebar: 'details' }}  | ${'details-sidebar'}      | ${'boxai'}    | ${'details'}
                    `(
                        'should render $sidebar given custom Box AI with internalSidebarNavigation = $internalSidebarNavigation and defaultPanel = $defaultPanel (navigation takes precedence)',
                        ({ internalSidebarNavigation, sidebar, defaultPanel, expectedPanelName }) => {
                            renderSidebarPanelsRouterDisabled({
                                internalSidebarNavigation,
                                defaultPanel,
                                hasNativeBoxAISidebar: false,
                                customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                            });
                            expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                            expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                        },
                    );

                    test.each`
                        isDisabled | hasDocGen | expectedSidebar           | expectedPanelName
                        ${false}   | ${true}   | ${'custom-boxai-sidebar'} | ${'boxai'}
                        ${true}    | ${true}   | ${'docgen-sidebar'}       | ${'docgen'}
                        ${true}    | ${false}  | ${'skills-sidebar'}       | ${'skills'}
                    `(
                        'should render $expectedSidebar when custom Box AI isDisabled = $isDisabled and hasDocGen = $hasDocGen',
                        ({ isDisabled, hasDocGen, expectedSidebar, expectedPanelName }) => {
                            renderSidebarPanelsRouterDisabled({
                                internalSidebarNavigation: { sidebar: 'boxai' },
                                hasNativeBoxAISidebar: false,
                                hasDocGen,
                                customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled })],
                            });
                            expect(screen.getByTestId(expectedSidebar)).toBeInTheDocument();
                            expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                        },
                    );
                });
            });

            describe('first loaded behavior', () => {
                test('should update isInitialized state on mount', () => {
                    renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'activity',
                        },
                    });
                    const activitySidebar = screen.getByTestId('activity-sidebar');
                    expect(activitySidebar).toHaveAttribute('data-has-sidebar-initialized', 'true');
                });
            });

            describe('refresh()', () => {
                test.each([true, false])(
                    'should call the sidebars with the appropriate argument',
                    shouldRefreshCache => {
                        const sidebarPanelsRef = React.createRef();

                        renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: {
                                sidebar: 'activity',
                            },
                            ref: sidebarPanelsRef,
                        });

                        // Create mock refresh functions for each sidebar
                        const mockRefreshFunctions = {
                            boxAISidebar: jest.fn(),
                            activitySidebar: jest.fn(),
                            detailsSidebar: jest.fn(),
                            metadataSidebar: jest.fn(),
                            versionsSidebar: jest.fn(),
                        };

                        // Mock the sidebar refs
                        Object.keys(mockRefreshFunctions).forEach(sidebarName => {
                            sidebarPanelsRef.current[sidebarName] = {
                                current: { refresh: mockRefreshFunctions[sidebarName] },
                            };
                        });

                        // Call the refresh method
                        sidebarPanelsRef.current.refresh(shouldRefreshCache);

                        // Verify the calls
                        expect(mockRefreshFunctions.activitySidebar).toHaveBeenCalledWith(shouldRefreshCache);
                        expect(mockRefreshFunctions.boxAISidebar).toHaveBeenCalledWith();
                        expect(mockRefreshFunctions.detailsSidebar).toHaveBeenCalledWith();
                        expect(mockRefreshFunctions.metadataSidebar).toHaveBeenCalledWith();
                        expect(mockRefreshFunctions.versionsSidebar).toHaveBeenCalledWith();
                    },
                );

                test('should not throw when custom sidebar does not implement refresh', () => {
                    const sidebarPanelsRef = React.createRef();

                    renderSidebarPanelsRouterDisabled({
                        hasNativeBoxAISidebar: false,
                        ref: sidebarPanelsRef,
                    });

                    // Custom sidebar without refresh method
                    sidebarPanelsRef.current.customSidebars.set('customPanel', { current: {} });

                    expect(() => sidebarPanelsRef.current.refresh()).not.toThrow();
                });

                test('should call refresh on custom sidebars that implement it', () => {
                    const sidebarPanelsRef = React.createRef();
                    const mockRefresh = jest.fn();

                    renderSidebarPanelsRouterDisabled({
                        hasNativeBoxAISidebar: false,
                        ref: sidebarPanelsRef,
                    });

                    sidebarPanelsRef.current.customSidebars.set('customPanel', { current: { refresh: mockRefresh } });

                    sidebarPanelsRef.current.refresh();

                    expect(mockRefresh).toHaveBeenCalled();
                });
            });

            describe('componentDidUpdate', () => {
                const mockOnVersionChange = jest.fn();

                beforeEach(() => {
                    mockOnVersionChange.mockClear();
                });

                test.each([
                    [
                        { sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '123' },
                        { sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '456' },
                    ],
                    [
                        { sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '123' },
                        { sidebar: 'details', activeFeedEntryType: 'versions', versionId: '456' },
                    ],
                    [
                        { sidebar: 'activity', activeFeedEntryType: 'versions' },
                        { sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '123' },
                    ],
                    [
                        { sidebar: 'activity', activeFeedEntryType: 'versions' },
                        { sidebar: 'details', activeFeedEntryType: 'versions' },
                    ],
                ])(
                    'should not reset the current version if the versions route is still active',
                    (prevInternalSidebarNavigation, internalSidebarNavigation) => {
                        const { rerender } = renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: prevInternalSidebarNavigation,
                            onVersionChange: mockOnVersionChange,
                        });

                        rerender(
                            getSidebarPanelsRouterDisabled({
                                internalSidebarNavigation,
                                onVersionChange: mockOnVersionChange,
                            }),
                        );

                        expect(mockOnVersionChange).not.toHaveBeenCalled();
                    },
                );

                test.each([true, false])('should not reset the current version if the sidebar is toggled', isOpen => {
                    const { rerender } = renderSidebarPanelsRouterDisabled({
                        internalSidebarNavigation: {
                            sidebar: 'details',
                            activeFeedEntryType: 'versions',
                            versionId: '123',
                        },
                        isOpen,
                        onVersionChange: mockOnVersionChange,
                    });

                    rerender(
                        getSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: {
                                sidebar: 'details',
                                activeFeedEntryType: 'versions',
                                versionId: '123',
                            },
                            isOpen: !isOpen,
                            onVersionChange: mockOnVersionChange,
                        }),
                    );

                    expect(mockOnVersionChange).not.toHaveBeenCalled();
                });

                test.each([
                    [
                        { sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '123' },
                        { sidebar: 'metadata' },
                    ],
                    [
                        { sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '123' },
                        { sidebar: 'activity' },
                    ],
                    [{ sidebar: 'activity', activeFeedEntryType: 'versions' }, { sidebar: 'metadata' }],
                    [
                        { sidebar: 'details', activeFeedEntryType: 'versions', versionId: '123' },
                        { sidebar: 'metadata' },
                    ],
                    [{ sidebar: 'details', activeFeedEntryType: 'versions', versionId: '123' }, { sidebar: 'details' }],
                    [{ sidebar: 'details', activeFeedEntryType: 'versions' }, { sidebar: 'metadata' }],
                ])(
                    'should reset the current version if the versions route is no longer active',
                    (prevInternalSidebarNavigation, internalSidebarNavigation) => {
                        const { rerender } = renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: prevInternalSidebarNavigation,
                            onVersionChange: mockOnVersionChange,
                        });

                        rerender(
                            getSidebarPanelsRouterDisabled({
                                internalSidebarNavigation,
                                onVersionChange: mockOnVersionChange,
                            }),
                        );

                        expect(mockOnVersionChange).toHaveBeenCalledWith(null);
                    },
                );

                test.each([
                    [
                        { sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '123' },
                        {
                            sidebar: 'activity',
                            activeFeedEntryType: 'annotations',
                            fileVersionId: '123',
                            activeFeedEntryId: '456',
                        },
                    ],
                    [
                        { sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '123' },
                        { sidebar: 'activity', activeFeedEntryType: 'annotations', fileVersionId: '123' },
                    ],
                    [
                        { sidebar: 'details', activeFeedEntryType: 'versions', versionId: '123' },
                        {
                            sidebar: 'activity',
                            activeFeedEntryType: 'annotations',
                            fileVersionId: '456',
                            activeFeedEntryId: '789',
                        },
                    ],
                ])(
                    'should tag the version reset as triggered by an annotation when transitioning to an annotations navigation',
                    (prevInternalSidebarNavigation, internalSidebarNavigation) => {
                        const { rerender } = renderSidebarPanelsRouterDisabled({
                            internalSidebarNavigation: prevInternalSidebarNavigation,
                            onVersionChange: mockOnVersionChange,
                        });

                        rerender(
                            getSidebarPanelsRouterDisabled({
                                internalSidebarNavigation,
                                onVersionChange: mockOnVersionChange,
                            }),
                        );

                        expect(mockOnVersionChange).toHaveBeenCalledWith(null, { triggeredBy: 'annotation' });
                    },
                );
            });
        });

        describe('multiple customSidebarPanels rendering', () => {
            const createCustomPanel = (id, overrides = {}) => ({
                id,
                path: id,
                component: () => <div data-testid={`${id}-sidebar`} />,
                isDisabled: false,
                ...overrides,
            });

            test('should render multiple custom panels including Box AI', () => {
                const customSidebarPanels = [
                    createBoxAIPanel(),
                    createCustomPanel('custom1', { title: 'Custom Panel 1' }),
                    createCustomPanel('custom2', { title: 'Custom Panel 2' }),
                ];

                renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'boxai' },
                    customSidebarPanels,
                });

                expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                expect(screen.queryByTestId('custom1-sidebar')).not.toBeInTheDocument();
                expect(screen.queryByTestId('custom2-sidebar')).not.toBeInTheDocument();
            });

            test('should render custom panels with regular panels', () => {
                const customSidebarPanels = [
                    createCustomPanel('analytics', { title: 'Analytics Panel' }),
                    createCustomPanel('reports', { title: 'Reports Panel' }),
                ];

                const { unmount } = renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'analytics' },
                    customSidebarPanels,
                    hasActivity: true,
                    hasMetadata: true,
                });

                expect(screen.getByTestId('analytics-sidebar')).toBeInTheDocument();

                unmount();

                renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'reports' },
                    customSidebarPanels,
                    hasActivity: true,
                    hasMetadata: true,
                });

                expect(screen.getByTestId('reports-sidebar')).toBeInTheDocument();
            });

            test('should handle custom panels with different properties', () => {
                const disabledPanel = createCustomPanel('disabled', {
                    isDisabled: true,
                    title: 'Disabled Panel',
                });
                const enabledPanel = createCustomPanel('enabled', {
                    title: 'Enabled Panel',
                });

                const { unmount } = renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'enabled' },
                    customSidebarPanels: [disabledPanel, enabledPanel],
                });

                expect(screen.getByTestId('enabled-sidebar')).toBeInTheDocument();

                unmount();

                renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'disabled' },
                    customSidebarPanels: [disabledPanel, enabledPanel],
                });

                expect(screen.queryByTestId('disabled-sidebar')).not.toBeInTheDocument();
            });

            test('should handle empty custom panels array', () => {
                renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'activity' },
                    customSidebarPanels: [],
                    hasActivity: true,
                });

                expect(screen.getByTestId('activity-sidebar')).toBeInTheDocument();
            });

            test('should handle custom panels with Box AI in different positions', () => {
                const customSidebarPanels = [
                    createCustomPanel('before', { title: 'Before Box AI' }),
                    createBoxAIPanel(),
                    createCustomPanel('after', { title: 'After Box AI' }),
                ];

                const { unmount: unmountBoxAI } = renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'boxai' },
                    customSidebarPanels,
                });
                expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                unmountBoxAI();

                const { unmount: unmountBefore } = renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'before' },
                    customSidebarPanels,
                });
                expect(screen.getByTestId('before-sidebar')).toBeInTheDocument();
                unmountBefore();

                renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'after' },
                    customSidebarPanels,
                });
                expect(screen.getByTestId('after-sidebar')).toBeInTheDocument();
            });

            test('should call onPanelChange with correct panel names for custom panels', () => {
                const customSidebarPanels = [
                    createCustomPanel('dashboard', { title: 'Dashboard' }),
                    createBoxAIPanel(),
                ];

                renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'dashboard' },
                    customSidebarPanels,
                });
                expect(onPanelChange).toHaveBeenCalledWith('dashboard', true);

                onPanelChange.mockClear();

                renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'boxai' },
                    customSidebarPanels,
                });
                expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
            });

            test('should render other custom panels alongside native Box AI', () => {
                const analyticsPanel = createCustomPanel('analytics', { title: 'Analytics Panel' });
                const boxAiPanel = createBoxAIPanel();

                renderSidebarPanelsRouterDisabled({
                    internalSidebarNavigation: { sidebar: 'analytics' },
                    customSidebarPanels: [boxAiPanel, analyticsPanel],
                });

                expect(screen.getByTestId('analytics-sidebar')).toBeInTheDocument();
            });
        });

        describe('default sidebar redirect', () => {
            test.each`
                internalSidebarNavigation                                      | expectedSidebar
                ${undefined}                                                   | ${'boxai'}
                ${{}}                                                          | ${'boxai'}
                ${{ sidebar: 'nonsense' }}                                     | ${'boxai'}
                ${{ sidebar: 'activity', activeFeedEntryType: 'annotations' }} | ${'boxai'}
            `(
                'should replace the navigation with $expectedSidebar given internalSidebarNavigation = $internalSidebarNavigation',
                ({ internalSidebarNavigation, expectedSidebar }) => {
                    renderSidebarPanelsRouterDisabled({ internalSidebarNavigation });

                    expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledTimes(1);
                    expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith(
                        { sidebar: expectedSidebar, silent: true },
                        true,
                    );
                },
            );

            test('should replace the navigation with the default panel when the navigated sidebar is not eligible', () => {
                renderSidebarPanelsRouterDisabled({
                    defaultPanel: 'details',
                    hasActivity: false,
                    internalSidebarNavigation: { sidebar: 'activity' },
                });

                expect(screen.getByTestId('details-sidebar')).toBeInTheDocument();
                expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith(
                    { sidebar: 'details', silent: true },
                    true,
                );
            });

            test.each`
                internalSidebarNavigation
                ${{ sidebar: 'activity' }}
                ${{ sidebar: 'activity', activeFeedEntryType: 'versions', versionId: '123' }}
                ${{ sidebar: 'boxai' }}
            `(
                'should not replace the navigation given internalSidebarNavigation = $internalSidebarNavigation pointing to an eligible sidebar',
                ({ internalSidebarNavigation }) => {
                    renderSidebarPanelsRouterDisabled({ internalSidebarNavigation });

                    expect(mockInternalSidebarNavigationHandler).not.toHaveBeenCalled();
                },
            );

            test('should not replace the navigation when the sidebar is closed', () => {
                renderSidebarPanelsRouterDisabled({ isOpen: false });

                expect(mockInternalSidebarNavigationHandler).not.toHaveBeenCalled();
            });

            test('should replace the navigation once the navigated sidebar is no longer eligible', () => {
                const internalSidebarNavigation = { sidebar: 'activity' };
                const { rerender } = renderSidebarPanelsRouterDisabled({ internalSidebarNavigation });

                expect(mockInternalSidebarNavigationHandler).not.toHaveBeenCalled();

                rerender(getSidebarPanelsRouterDisabled({ hasActivity: false, internalSidebarNavigation }));

                expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith(
                    { sidebar: 'boxai', silent: true },
                    true,
                );
            });

            test('should render the default sidebar when navigation handler is not provided', () => {
                renderSidebarPanelsRouterDisabled({ internalSidebarNavigationHandler: undefined });

                expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
            });
        });
    });

    describe('SidebarPanels dispatcher', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        const getSidebarPanelsDispatcher = (props = {}) => (
            <SidebarPanelsDispatcher
                customSidebarPanels={[]}
                file={{ id: '1234' }}
                hasActivity
                internalSidebarNavigation={{ sidebar: 'activity' }}
                isOpen
                {...props}
            />
        );

        test.each`
            routerDisabled | SidebarPanelsImplementation
            ${false}       | ${SidebarPanelsRouter}
            ${true}        | ${SidebarPanelsRouterDisabled}
        `(
            'should forward refresh() to the rendered implementation given routerDisabled = $routerDisabled',
            ({ routerDisabled, SidebarPanelsImplementation }) => {
                const refreshSpy = jest.spyOn(SidebarPanelsImplementation.prototype, 'refresh').mockImplementation();
                const sidebarPanelsRef = React.createRef();

                render(
                    <MemoryRouter initialEntries={['/activity']}>
                        {getSidebarPanelsDispatcher({ ref: sidebarPanelsRef, routerDisabled })}
                    </MemoryRouter>,
                );

                sidebarPanelsRef.current.refresh(false);

                expect(refreshSpy).toHaveBeenCalledWith(false);
            },
        );

        test('should render without a Router when routerDisabled is true', () => {
            render(getSidebarPanelsDispatcher({ routerDisabled: true }));

            expect(screen.getByTestId('activity-sidebar')).toBeInTheDocument();
        });
    });
});

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '../../../test-utils/testing-library';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT, FEED_ITEM_TYPE_TASK } from '../../../constants';
import { SidebarPanelsComponent as SidebarPanels } from '../SidebarPanels';

// mock lazy imports
jest.mock('../SidebarUtils');

describe('elements/content-sidebar/SidebarPanels', () => {
    const onPanelChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const getSidebarPanels = ({ path = '/', ...props }) => (
        <MemoryRouter initialEntries={[path]}>
            <SidebarPanels
                file={{ id: '1234' }}
                hasBoxAI
                hasDocGen
                hasActivity
                hasDetails
                hasMetadata
                hasSkills
                hasVersions
                isOpen
                onPanelChange={onPanelChange}
                {...props}
            />
        </MemoryRouter>
    );

    const renderSidebarPanels = ({ path = '/', ...props } = {}) =>
        render(getSidebarPanels({ path, ...props }));

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
            ${'/nonsense'}                       | ${'docgen-sidebar'}
            ${'/'}                               | ${'docgen-sidebar'}
        `('should render $sidebar given the path $path', ({ path, sidebar }) => {
            renderSidebarPanels({ path });
            expect(screen.getByTestId(sidebar)).toBeInTheDocument();
        });

        test.each`
            path           | sidebar
            ${'/nonsense'} | ${'boxai-sidebar'}
            ${'/'}         | ${'boxai-sidebar'}
        `(
            'should render $sidebar given feature boxai.sidebar.shouldBeDefaultPanel = true and the path $path',
            ({ path, sidebar }) => {
                renderSidebarPanels({
                    features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                    path,
                });
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
            ${'nonsense'} | ${'docgen-sidebar'}   | ${'docgen'}
            ${undefined}  | ${'docgen-sidebar'}   | ${'docgen'}
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
            defaultPanel  | sidebar            | expectedPanelName
            ${'nonsense'} | ${'boxai-sidebar'} | ${'boxai'}
            ${undefined}  | ${'boxai-sidebar'} | ${'boxai'}
        `(
            'should render $sidebar and call onPanelChange with $expectedPanelName given feature boxai.sidebar.shouldBeDefaultPanel = true and the path = "/" and defaultPanel = $defaultPanel',
            ({ defaultPanel, sidebar, expectedPanelName }) => {
                renderSidebarPanels({
                    defaultPanel,
                    features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },

                });
                expect(screen.getByTestId(sidebar)).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        test.each`
            defaultPanel  | expectedSidebar       | hasActivity | hasDetails | hasMetadata | hasSkills | hasDocGen | hasBoxAI | showOnlyBoxAINavButton | expectedPanelName
            ${'activity'} | ${'docgen-sidebar'}   | ${false}    | ${true}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'details'}  | ${'docgen-sidebar'}   | ${true}     | ${false}   | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'metadata'} | ${'docgen-sidebar'}   | ${true}     | ${true}    | ${false}    | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'skills'}   | ${'docgen-sidebar'}   | ${true}     | ${true}    | ${true}     | ${false}  | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'docgen'}   | ${'activity-sidebar'} | ${true}     | ${true}    | ${true}     | ${false}  | ${false}  | ${true}  | ${false}               | ${'activity'}
            ${'boxai'}    | ${'docgen-sidebar'}   | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${false} | ${false}               | ${'docgen'}
            ${'boxai'}    | ${'docgen-sidebar'}   | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${true}  | ${true}                | ${'docgen'}
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
                hasBoxAI,
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
                    hasBoxAI,

                });
                expect(screen.getByTestId(expectedSidebar)).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        test.each`
            defaultPanel  | expectedSidebar     | hasActivity | hasDetails | hasMetadata | hasSkills | hasDocGen | hasBoxAI | showOnlyBoxAINavButton | expectedPanelName
            ${'activity'} | ${'boxai-sidebar'}  | ${false}    | ${true}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'details'}  | ${'boxai-sidebar'}  | ${true}     | ${false}   | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'metadata'} | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${false}    | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'skills'}   | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${true}     | ${false}  | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'docgen'}   | ${'boxai-sidebar'}  | ${true}     | ${true}    | ${true}     | ${false}  | ${false}  | ${true}  | ${false}               | ${'boxai'}
            ${'boxai'}    | ${'docgen-sidebar'} | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${false} | ${false}               | ${'docgen'}
            ${'boxai'}    | ${'docgen-sidebar'} | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${true}  | ${true}                | ${'docgen'}
        `(
            'should render first available panel and call onPanelChange with $expectedPanelName for users without rights to render default panel, given feature boxai.sidebar.shouldBeDefaultPanel = true and the path = "/" and defaultPanel = $defaultPanel',
            ({
                defaultPanel,
                expectedSidebar,
                hasActivity,
                hasDetails,
                hasMetadata,
                hasSkills,
                hasDocGen,
                hasBoxAI,
                showOnlyBoxAINavButton,
                expectedPanelName,
            }) => {

                renderSidebarPanels({
                    features: {
                        boxai: {
                            sidebar: {
                                shouldBeDefaultPanel: true,
                                showOnlyNavButton: showOnlyBoxAINavButton,
                            },
                        },
                    },
                    defaultPanel,
                    hasActivity,
                    hasDetails,
                    hasMetadata,
                    hasSkills,
                    hasDocGen,
                    hasBoxAI,

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
            ${'/nonsense'}                       | ${'docgen'}
            ${'/'}                               | ${'docgen'}
        `('should call onPanelChange with $expectedPanelName given the path = $path', ({ path, expectedPanelName }) => {
            renderSidebarPanels({
                path,
            });
            expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
        });

        test.each`
            path           | expectedPanelName
            ${'/nonsense'} | ${'boxai'}
            ${'/'}         | ${'boxai'}
        `(
            'should call onPanelChange with $expectedPanelName given feature boxai.sidebar.shouldBeDefaultPanel = true and the path = $path',
            ({ path, expectedPanelName }) => {

                renderSidebarPanels({
                    features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                    path,

                });
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        test.each`
            path                                 | hasActivity | hasDetails | hasVersions | hasMetadata | hasSkills | hasDocGen | hasBoxAI | showOnlyBoxAINavButton | expectedPanelName
            ${'/activity'}                       | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/activity/comments'}              | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/activity/comments/1234'}         | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/activity/tasks'}                 | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/activity/tasks/1234'}            | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/activity/annotations/1234/5678'} | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/activity/annotations/1234'}      | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/activity/versions'}              | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/activity/versions/1234'}         | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/details'}                        | ${true}     | ${false}   | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/details/versions'}               | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/details/versions/1234'}          | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/metadata'}                       | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/metadata/filteredTemplates/1,3'} | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/skills'}                         | ${true}     | ${true}    | ${true}     | ${true}     | ${false}  | ${true}   | ${true}  | ${false}               | ${'docgen'}
            ${'/docgen'}                         | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${false}  | ${true}  | ${false}               | ${'skills'}
            ${'/boxai'}                          | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${false} | ${false}               | ${'docgen'}
            ${'/boxai'}                          | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${true}                | ${'docgen'}
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
                hasBoxAI,
                showOnlyBoxAINavButton,
                expectedPanelName,
            }) => {

                renderSidebarPanels({
                    features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                    hasActivity,
                    hasBoxAI,
                    hasDetails,
                    hasDocGen,
                    hasMetadata,
                    hasSkills,
                    hasVersions,
                    path,
                });
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        test.each`
            path                                 | hasActivity | hasDetails | hasVersions | hasMetadata | hasSkills | hasDocGen | hasBoxAI | showOnlyBoxAINavButton | expectedPanelName
            ${'/activity'}                       | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/activity/comments'}              | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/activity/comments/1234'}         | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/activity/tasks'}                 | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/activity/tasks/1234'}            | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/activity/annotations/1234/5678'} | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/activity/annotations/1234'}      | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/activity/versions'}              | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/activity/versions/1234'}         | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/details'}                        | ${true}     | ${false}   | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/details/versions'}               | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/details/versions/1234'}          | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/metadata'}                       | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/metadata/filteredTemplates/1,3'} | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/skills'}                         | ${true}     | ${true}    | ${true}     | ${true}     | ${false}  | ${true}   | ${true}  | ${false}               | ${'boxai'}
            ${'/docgen'}                         | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${false}  | ${true}  | ${false}               | ${'boxai'}
            ${'/boxai'}                          | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${false} | ${false}               | ${'docgen'}
            ${'/boxai'}                          | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}  | ${true}                | ${'docgen'}
        `(
            'should call onPanelChange with $expectedPanelName given feature boxai.sidebar.shouldBeDefaultPanel = true and the path = $path for users without rights to render the panel for given path',
            ({
                path,
                hasActivity,
                hasDetails,
                hasVersions,
                hasMetadata,
                hasSkills,
                hasDocGen,
                hasBoxAI,
                showOnlyBoxAINavButton,
                expectedPanelName,
            }) => {

                renderSidebarPanels({
                    features: {
                        boxai: {
                            sidebar: {
                                shouldBeDefaultPanel: true,
                                showOnlyNavButton: showOnlyBoxAINavButton,
                            },
                        },
                    },
                    hasActivity,
                    hasBoxAI,
                    hasDetails,
                    hasDocGen,
                    hasMetadata,
                    hasSkills,
                    hasVersions,
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
                hasBoxAI: false,
                hasActivity: false,
                hasDetails: false,
                hasMetadata: false,
                hasSkills: false,
                hasVersions: false,
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
            test('should render, given feature boxai.sidebar.shouldBeDefaultPanel = true and hasBoxAI = true and feature boxai.sidebar.showOnlyNavButton = false', () => {
                renderSidebarPanels({
                    features: { boxai: { sidebar: { shouldBeDefaultPanel: true, showOnlyNavButton: false } } },
                    hasBoxAI: true,
                });
                expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
            });

            test.each`
                hasBoxAI | showOnlyNavButton
                ${true}  | ${true}
                ${false} | ${true}
                ${false} | ${false}
            `(
                'should not render, given hasBoxAI = $hasBoxAI and feature boxai.sidebar.showOnlyNavButton = $showOnlyNavButton',
                ({ hasBoxAI, showOnlyNavButton }) => {
                    renderSidebarPanels({
                        features: { boxai: { sidebar: { showOnlyNavButton } } },
                        hasBoxAI,
                    });
                    expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                },
            );
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
                    current: { refresh: mockRefreshFunctions[sidebarName] } 
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


    });

    describe('componentDidUpdate', () => {
        const mockOnVersionChange = jest.fn();

        beforeEach(() => {
            mockOnVersionChange.mockClear();
        });

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

            rerender(getSidebarPanels({
                path: pathname,
                onVersionChange: mockOnVersionChange,
                location: { pathname },
            }));

            expect(mockOnVersionChange).not.toHaveBeenCalled();
        });

        test.each([true, false])('should not reset the current version if the sidebar is toggled', isOpen => {
            const { rerender } = renderSidebarPanels({
                path: '/details/versions/123',
                isOpen,
                onVersionChange: mockOnVersionChange,
                location: { pathname: '/details/versions/123' },
            });

            rerender(getSidebarPanels({
                path: '/details/versions/123',
                isOpen: !isOpen,
                onVersionChange: mockOnVersionChange,
                location: { pathname: '/details/versions/123' },
            }));

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

            rerender(getSidebarPanels({
                path: pathname,
                onVersionChange: mockOnVersionChange,
                location: { pathname },
            }));

            expect(mockOnVersionChange).toHaveBeenCalledWith(null);
        });
    });
});

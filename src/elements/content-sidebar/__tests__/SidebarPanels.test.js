import * as React from 'react';
import { createMemoryHistory } from 'history';
import { render, screen } from '../../../test-utils/testing-library';
import { NavRouter } from '../../common/nav-router';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT, FEED_ITEM_TYPE_TASK } from '../../../constants';
import { SidebarPanelsComponent as SidebarPanels } from '../SidebarPanels';

// mock lazy imports
jest.mock('../SidebarUtils');

describe('elements/content-sidebar/SidebarPanels', () => {
    const renderComponent = ({ path = '/', ...props } = {}) => {
        const history = createMemoryHistory({ initialEntries: [path] });
        return render(
            <NavRouter history={history}>
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
                    {...props}
                />
            </NavRouter>,
        );
    };

    describe('render', () => {
        test.each`
            path                                 | sidebar
            ${'/activity'}                       | ${'ActivitySidebar'}
            ${'/activity/comments'}              | ${'ActivitySidebar'}
            ${'/activity/comments/1234'}         | ${'ActivitySidebar'}
            ${'/activity/tasks'}                 | ${'ActivitySidebar'}
            ${'/activity/tasks/1234'}            | ${'ActivitySidebar'}
            ${'/activity/annotations/1234/5678'} | ${'ActivitySidebar'}
            ${'/activity/annotations/1234'}      | ${'ActivitySidebar'}
            ${'/activity/versions'}              | ${'VersionsSidebar'}
            ${'/activity/versions/1234'}         | ${'VersionsSidebar'}
            ${'/details'}                        | ${'DetailsSidebar'}
            ${'/details/versions'}               | ${'VersionsSidebar'}
            ${'/details/versions/1234'}          | ${'VersionsSidebar'}
            ${'/metadata'}                       | ${'MetadataSidebar'}
            ${'/metadata/filteredTemplates/1,3'} | ${'MetadataSidebar'}
            ${'/skills'}                         | ${'SkillsSidebar'}
            ${'/boxai'}                          | ${'BoxAISidebar'}
            ${'/docgen'}                         | ${'DocGenSidebar'}
            ${'/nonsense'}                       | ${'BoxAISidebar'}
            ${'/'}                               | ${'BoxAISidebar'}
        `('should render $sidebar given the path $path', ({ path, sidebar }) => {
            renderComponent({ path });
            expect(screen.getByTestId(`${sidebar.toLowerCase()}`)).toBeInTheDocument();
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
                const onPanelChange = jest.fn();
                renderComponent({
                    defaultPanel,
                    onPanelChange,
                });
                expect(screen.getByTestId(sidebar)).toBeInTheDocument();
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
                const onPanelChange = jest.fn();
                renderComponent({
                    features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                    defaultPanel,
                    hasActivity,
                    hasDetails,
                    hasMetadata,
                    hasSkills,
                    hasDocGen,
                    hasBoxAI,
                    onPanelChange,
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
                    const onPanelChange = jest.fn();
                    render(
                        getSidebarPanels({
                            defaultPanel,
                            onPanelChange,
                            path,
                        }),
                    );
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
            const onPanelChange = jest.fn();
            renderComponent({
                path,
                onPanelChange,
            });
            expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
        });

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
                const onPanelChange = jest.fn();
                renderComponent({
                    features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                    hasActivity,
                    hasBoxAI,
                    hasDetails,
                    hasDocGen,
                    hasMetadata,
                    hasSkills,
                    hasVersions,
                    onPanelChange,
                    path,
                });
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        test('should call onPanelChange only once with the initial panel value', () => {
            const onPanelChange = jest.fn();
            const { rerender } = renderComponent({
                onPanelChange,
                path: '/details',
            });
            rerender(
                <NavRouter history={createMemoryHistory({ initialEntries: ['/activity'] })}>
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
                    />
                </NavRouter>,
            );
            expect(onPanelChange).toHaveBeenCalledWith('details', true);
            expect(onPanelChange).toHaveBeenCalledTimes(1);
        });

        test('should render nothing if the sidebar is closed', () => {
            renderComponent({
                isOpen: false,
            });
            expect(screen.queryByTestId('preview-sidebar')).not.toBeInTheDocument();
        });

        test('should render nothing if all sidebars are disabled', () => {
            renderComponent({
                hasBoxAI: false,
                hasActivity: false,
                hasDetails: false,
                hasMetadata: false,
                hasSkills: false,
                hasVersions: false,
            });
            expect(screen.queryByTestId('preview-sidebar')).not.toBeInTheDocument();
        });

        describe('activity sidebar', () => {
            test('should render with tasks deeplink', () => {
                renderComponent({ path: '/activity/tasks/12345' });
                const sidebar = screen.getByTestId('activity-sidebar');
                expect(sidebar).toHaveAttribute('data-feed-entry-type', FEED_ITEM_TYPE_TASK);
                expect(sidebar).toHaveAttribute('data-feed-entry-id', '12345');
            });

            test('should render with comments deeplink', () => {
                renderComponent({ path: '/activity/comments/12345' });
                const sidebar = screen.getByTestId('activity-sidebar');
                expect(sidebar).toHaveAttribute('data-feed-entry-type', FEED_ITEM_TYPE_COMMENT);
                expect(sidebar).toHaveAttribute('data-feed-entry-id', '12345');
            });

            test('should render with versions deeplink', () => {
                renderComponent({ path: '/activity/versions/12345' });
                const sidebar = screen.getByTestId('versions-sidebar');
                expect(sidebar).toHaveAttribute('data-version-id', '12345');
            });

            test('should render with annotations deeplink', () => {
                renderComponent({ path: '/activity/annotations/12345/67890' });
                const sidebar = screen.getByTestId('activity-sidebar');
                expect(sidebar).toHaveAttribute('data-feed-entry-type', FEED_ITEM_TYPE_ANNOTATION);
                expect(sidebar).toHaveAttribute('data-feed-entry-id', '67890');
            });

            test('should not pass down activeFeedEntry props with partial annotations deeplink', () => {
                renderComponent({ path: '/activity/annotations/12345' });
                const sidebar = screen.getByTestId('activity-sidebar');
                expect(sidebar).not.toHaveAttribute('data-feed-entry-type');
                expect(sidebar).not.toHaveAttribute('data-feed-entry-id');
            });
        });

        describe('metadata sidebar', () => {
            test('should render with filteredTemplates deeplink', () => {
                renderComponent({
                    path: '/metadata/filteredTemplates/123,124',
                    features: { metadata: { redesign: { enabled: true } } },
                });
                const sidebar = screen.getByTestId('metadata-sidebar');
                expect(sidebar).toHaveAttribute('data-filtered-template-ids', '123,124');
            });
            test('should render redesigned sidebar if it is enabled', () => {
                renderComponent({
                    path: '/metadata',
                    features: { metadata: { redesign: { enabled: true } } },
                });
                expect(screen.getByTestId('metadata-sidebar')).toBeInTheDocument();
            });
        });

        describe('details sidebar', () => {
            test('should render with versions deeplink', () => {
                const wrapper = getWrapper({ path: '/details/versions/12345' });
                expect(wrapper.find('VersionsSidebar').props()).toMatchObject({
                    versionId: '12345',
                });
            });
        });

        describe('boxai sidebar', () => {
            test('should render, given hasBoxAI = true and feature boxai.sidebar.showOnlyNavButton = false', () => {
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                        hasBoxAI: true,
                    }),
                );
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
                    render(
                        getSidebarPanels({
                            features: { boxai: { sidebar: { showOnlyNavButton } } },
                            hasBoxAI,
                        }),
                    );
                    expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                },
            );
        });

        describe('first loaded behavior', () => {
            test('should update isInitialized state on mount', () => {
                const wrapper = getWrapper({ path: '/activity' });
                const sidebarPanels = wrapper.find(SidebarPanels);
                expect(sidebarPanels.state('isInitialized')).toBe(true);
            });
        });
    });

    describe('refresh()', () => {
        test.each([true, false])('should call the sidebars with the appropriate argument', shouldRefreshCache => {
            const instance = getWrapper().find(SidebarPanels).instance();

            ['boxAISidebar', 'activitySidebar', 'detailsSidebar', 'metadataSidebar', 'versionsSidebar'].forEach(
                sidebar => {
                    instance[sidebar] = { current: { refresh: jest.fn() } };
                },
            );

            instance.refresh(shouldRefreshCache);

            expect(instance.activitySidebar.current.refresh).toHaveBeenCalledWith(shouldRefreshCache);
            expect(instance.boxAISidebar.current.refresh).toHaveBeenCalledWith();
            expect(instance.detailsSidebar.current.refresh).toHaveBeenCalledWith();
            expect(instance.metadataSidebar.current.refresh).toHaveBeenCalledWith();
            expect(instance.versionsSidebar.current.refresh).toHaveBeenCalledWith();
        });
    });

    describe('componentDidUpdate', () => {
        const onVersionChange = jest.fn();

        test.each([
            ['/activity/versions/123', '/activity/versions/456'],
            ['/activity/versions/123', '/details/versions/456'],
            ['/activity/versions', '/activity/versions/123'],
            ['/activity/versions', '/details/versions'],
        ])('should not reset the current version if the versions route is still active', (prevPathname, pathname) => {
            const history = createMemoryHistory({ initialEntries: [prevPathname] });
            const { rerender } = renderComponent({ location: history.location, onVersionChange });
            history.push(pathname);
            rerender(
                <NavRouter history={history}>
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
                        location={history.location}
                        onVersionChange={onVersionChange}
                    />
                </NavRouter>,
            );
            expect(onVersionChange).not.toBeCalled();
        });

        test.each([true, false])('should not reset the current version if the sidebar is toggled', isOpen => {
            const history = createMemoryHistory({ initialEntries: ['/details/versions/123'] });
            const { rerender } = renderComponent({
                isOpen,
                location: history.location,
                onVersionChange,
            });
            rerender(
                <NavRouter history={history}>
                    <SidebarPanels
                        file={{ id: '1234' }}
                        hasBoxAI
                        hasDocGen
                        hasActivity
                        hasDetails
                        hasMetadata
                        hasSkills
                        hasVersions
                        isOpen={!isOpen}
                        location={history.location}
                        onVersionChange={onVersionChange}
                    />
                </NavRouter>,
            );
            expect(onVersionChange).not.toBeCalled();
        });

        test.each([
            ['/activity/versions/123', '/metadata'],
            ['/activity/versions/123', '/activity'],
            ['/activity/versions', '/metadata'],
            ['/details/versions/123', '/metadata'],
            ['/details/versions/123', '/details'],
            ['/details/versions', '/metadata'],
        ])('should reset the current version if the versions route is no longer active', (prevPathname, pathname) => {
            const history = createMemoryHistory({ initialEntries: [prevPathname] });
            const { rerender } = renderComponent({ location: history.location, onVersionChange });
            history.push(pathname);
            rerender(
                <NavRouter history={history}>
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
                        location={history.location}
                        onVersionChange={onVersionChange}
                    />
                </NavRouter>,
            );
            expect(onVersionChange).toBeCalledWith(null);
        });
    });
});

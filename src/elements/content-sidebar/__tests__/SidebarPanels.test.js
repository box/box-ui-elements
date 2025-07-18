import * as React from 'react';
import { mount } from 'enzyme/build';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT, FEED_ITEM_TYPE_TASK } from '../../../constants';
import { SidebarPanelsComponent as SidebarPanels } from '../SidebarPanels';

// mock lazy imports
jest.mock('../SidebarUtils');

describe('elements/content-sidebar/SidebarPanels', () => {
    const getWrapper = ({ path = '/', ...rest } = {}) =>
        mount(
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
                {...rest}
            />,
            {
                wrappingComponent: MemoryRouter,
                wrappingComponentProps: {
                    initialEntries: [path],
                    keyLength: 0,
                },
            },
        );

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
                {...props}
            />
            ,
        </MemoryRouter>
    );

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
            ${'/nonsense'}                       | ${'DocGenSidebar'}
            ${'/'}                               | ${'DocGenSidebar'}
        `('should render $sidebar given the path $path', ({ path, sidebar }) => {
            const wrapper = getWrapper({ path });
            expect(wrapper.exists(sidebar)).toBe(true);
        });

        test.each`
            path           | sidebar
            ${'/nonsense'} | ${'BoxAISidebar'}
            ${'/'}         | ${'BoxAISidebar'}
        `(
            'should render $sidebar given feature boxai.sidebar.shouldBeDefaultPanel = true and the path $path',
            ({ path, sidebar }) => {
                const wrapper = getWrapper({
                    features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                    path,
                });
                expect(wrapper.exists(sidebar)).toBe(true);
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
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        defaultPanel,
                        onPanelChange,
                    }),
                );
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
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        defaultPanel,
                        features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                        onPanelChange,
                    }),
                );
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
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                        defaultPanel,
                        hasActivity,
                        hasDetails,
                        hasMetadata,
                        hasSkills,
                        hasDocGen,
                        hasBoxAI,
                        onPanelChange,
                    }),
                );
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
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
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
                        onPanelChange,
                    }),
                );
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
            ${'/nonsense'}                       | ${'docgen'}
            ${'/'}                               | ${'docgen'}
        `('should call onPanelChange with $expectedPanelName given the path = $path', ({ path, expectedPanelName }) => {
            const onPanelChange = jest.fn();
            render(
                getSidebarPanels({
                    path,
                    onPanelChange,
                }),
            );
            expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
        });

        test.each`
            path           | expectedPanelName
            ${'/nonsense'} | ${'boxai'}
            ${'/'}         | ${'boxai'}
        `(
            'should call onPanelChange with $expectedPanelName given feature boxai.sidebar.shouldBeDefaultPanel = true and the path = $path',
            ({ path, expectedPanelName }) => {
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                        path,
                        onPanelChange,
                    }),
                );
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
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
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
                    }),
                );
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
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
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
                        onPanelChange,
                        path,
                    }),
                );
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

        test('should call onPanelChange only once with the initial panel value', () => {
            const onPanelChange = jest.fn();
            const { rerender } = render(
                getSidebarPanels({
                    onPanelChange,
                    path: '/details',
                }),
            );
            rerender(
                getSidebarPanels({
                    onPanelChange,
                    path: '/activity',
                }),
            );
            expect(onPanelChange).toHaveBeenCalledWith('details', true);
            expect(onPanelChange).toHaveBeenCalledTimes(1);
        });

        test('should render nothing if the sidebar is closed', () => {
            const wrapper = getWrapper({
                isOpen: false,
            });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        test('should render nothing if all sidebars are disabled', () => {
            const wrapper = getWrapper({
                hasBoxAI: false,
                hasActivity: false,
                hasDetails: false,
                hasMetadata: false,
                hasSkills: false,
                hasVersions: false,
            });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        describe('activity sidebar', () => {
            test('should render with tasks deeplink', () => {
                const wrapper = getWrapper({ path: '/activity/tasks/12345' });
                expect(wrapper.find('ActivitySidebar').props()).toMatchObject({
                    activeFeedEntryType: FEED_ITEM_TYPE_TASK,
                    activeFeedEntryId: '12345',
                });
            });

            test('should render with comments deeplink', () => {
                const wrapper = getWrapper({ path: '/activity/comments/12345' });
                expect(wrapper.find('ActivitySidebar').props()).toMatchObject({
                    activeFeedEntryType: FEED_ITEM_TYPE_COMMENT,
                    activeFeedEntryId: '12345',
                });
            });

            test('should render with versions deeplink', () => {
                const wrapper = getWrapper({ path: '/activity/versions/12345' });
                expect(wrapper.find('VersionsSidebar').props()).toMatchObject({
                    versionId: '12345',
                });
            });

            test('should render with annotations deeplink', () => {
                const wrapper = getWrapper({ path: '/activity/annotations/12345/67890' });
                expect(wrapper.find('ActivitySidebar').props()).toMatchObject({
                    activeFeedEntryType: FEED_ITEM_TYPE_ANNOTATION,
                    activeFeedEntryId: '67890',
                });
            });

            test('should not pass down activeFeedEntry props with partial annotations deeplink', () => {
                const wrapper = getWrapper({ path: '/activity/annotations/12345' });
                expect(wrapper.find('ActivitySidebar').props()).toMatchObject({
                    activeFeedEntryType: undefined,
                    activeFeedEntryId: undefined,
                });
            });
        });

        describe('metadata sidebar', () => {
            test('should render with filteredTemplates deeplink', () => {
                const wrapper = getWrapper({
                    path: '/metadata/filteredTemplates/123,124',
                    features: { metadata: { redesign: { enabled: true } } },
                });
                expect(wrapper.find('MetadataSidebarRedesigned').props().filteredTemplateIds).toEqual(['123', '124']);
            });
            test('should render redesigned  sidebar if it is enabled', () => {
                const wrapper = getWrapper({
                    path: '/metadata',
                    features: { metadata: { redesign: { enabled: true } } },
                });
                expect(wrapper.exists('MetadataSidebarRedesigned')).toBe(true);
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
            test('should render, given feature boxai.sidebar.shouldBeDefaultPanel = true and hasBoxAI = true and feature boxai.sidebar.showOnlyNavButton = false', () => {
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { shouldBeDefaultPanel: true, showOnlyNavButton: false } } },
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
            const wrapper = getWrapper({ location: { pathname: prevPathname }, onVersionChange });
            wrapper.setProps({ location: { pathname } });
            expect(onVersionChange).not.toBeCalled();
        });

        test.each([true, false])('should not reset the current version if the sidebar is toggled', isOpen => {
            const wrapper = getWrapper({ isOpen, location: { pathname: '/details/versions/123' }, onVersionChange });
            wrapper.setProps({ isOpen: !isOpen });
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
            const wrapper = getWrapper({ location: { pathname: prevPathname }, onVersionChange });
            wrapper.setProps({ location: { pathname } });
            expect(onVersionChange).toBeCalledWith(null);
        });
    });

    describe('customPanel', () => {
        const MockCustomPanel = React.forwardRef(({ elementId, fileExtension, hasSidebarInitialized }, ref) => (
            <div data-testid="custom-panel" ref={ref}>
                Custom Panel Content
                <div data-testid="element-id">{elementId}</div>
                <div data-testid="file-extension">{fileExtension}</div>
                <div data-testid="sidebar-initialized">{hasSidebarInitialized.toString()}</div>
            </div>
        ));

        const customPanel = {
            id: 'custom',
            component: MockCustomPanel,
            title: 'Custom Panel',
        };

        describe('rendering', () => {
            test('should render custom panel when provided and path matches', () => {
                render(
                    getSidebarPanels({
                        customPanel,
                        path: '/custom',
                    }),
                );
                expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
            });

            test('should not render custom panel when path does not match', () => {
                render(
                    getSidebarPanels({
                        customPanel,
                        path: '/activity',
                    }),
                );
                expect(screen.queryByTestId('custom-panel')).not.toBeInTheDocument();
            });

            test('should pass correct props to custom panel component', () => {
                render(
                    getSidebarPanels({
                        customPanel,
                        path: '/custom',
                        elementId: 'test-element',
                    }),
                );
                expect(screen.getByTestId('element-id')).toHaveTextContent('test-element');
                expect(screen.getByTestId('sidebar-initialized')).toHaveTextContent('true');
            });

            test('should call onPanelChange with custom panel id when rendered', () => {
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel,
                        onPanelChange,
                        path: '/custom',
                    }),
                );
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });

            test('should render custom panel even when other sidebars are disabled', () => {
                render(
                    getSidebarPanels({
                        customPanel,
                        path: '/custom',
                        hasBoxAI: false,
                        hasActivity: false,
                        hasDetails: false,
                        hasMetadata: false,
                        hasSkills: false,
                        hasVersions: false,
                        hasDocGen: false,
                    }),
                );
                expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
            });
        });

        describe('panel order logic', () => {
            test('should include custom panel in panel eligibility when provided', () => {
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should not redirect to custom panel as first eligible panel when shouldBeDefaultPanel is undefined
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should place custom panel first when shouldBeDefaultPanel is true', () => {
                const customPanelAsDefault = {
                    ...customPanel,
                    shouldBeDefaultPanel: true,
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelAsDefault,
                        onPanelChange,
                        path: '/',
                    }),
                );
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });

            test('should insert custom panel at specified index when shouldBeDefaultPanel is false', () => {
                const customPanelWithIndex = {
                    ...customPanel,
                    index: 2,
                    shouldBeDefaultPanel: false,
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithIndex,
                        onPanelChange,
                        path: '/',
                        hasDocGen: false, // Disable docgen to test insertion order
                    }),
                );
                // Should redirect to skills (first available panel) since custom is at index 2
                expect(onPanelChange).toHaveBeenCalledWith('skills', true);
            });

            test('should clamp custom panel index to valid range', () => {
                const customPanelWithHighIndex = {
                    ...customPanel,
                    index: 999,
                    shouldBeDefaultPanel: false,
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithHighIndex,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should still redirect to custom panel as it's eligible
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should place custom panel at end when index is negative or 0 and shouldBeDefaultPanel is false', () => {
                const customPanelWithZeroIndex = {
                    ...customPanel,
                    index: 0,
                    shouldBeDefaultPanel: false,
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithZeroIndex,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should redirect to custom panel as it's eligible
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });
        });

        describe('BoxAI custom panel replacement', () => {
            test('should not render default BoxAI panel when custom panel has BoxAI id', () => {
                const boxAICustomPanel = {
                    id: 'boxai',
                    component: MockCustomPanel,
                    title: 'Custom BoxAI Panel',
                };
                render(
                    getSidebarPanels({
                        customPanel: boxAICustomPanel,
                        path: '/boxai',
                    }),
                );
                expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
                // The default BoxAI panel should not be rendered
                expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
            });

            test('should exclude BoxAI from panel eligibility when custom panel replaces it', () => {
                const boxAICustomPanel = {
                    id: 'boxai',
                    component: MockCustomPanel,
                    title: 'Custom BoxAI Panel',
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: boxAICustomPanel,
                        onPanelChange,
                        path: '/',
                        hasDocGen: false, // Disable docgen to test fallback
                    }),
                );
                // Should redirect to skills (first available panel) since BoxAI is replaced
                expect(onPanelChange).toHaveBeenCalledWith('skills', true);
            });

            test('should handle BoxAI custom panel with shouldBeDefaultPanel feature flag', () => {
                const boxAICustomPanel = {
                    id: 'boxai',
                    component: MockCustomPanel,
                    title: 'Custom BoxAI Panel',
                    shouldBeDefaultPanel: true,
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: boxAICustomPanel,
                        features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should redirect to custom BoxAI panel
                expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
            });
        });

        describe('refresh functionality', () => {
            test('should call refresh on custom panel when refresh method is called', () => {
                const mockRefresh = jest.fn();
                const CustomPanelWithRefresh = React.forwardRef((props, ref) => {
                    React.useImperativeHandle(ref, () => ({
                        refresh: mockRefresh,
                    }));
                    return <div data-testid="custom-panel">Custom Panel</div>;
                });

                const customPanelWithRefresh = {
                    ...customPanel,
                    component: CustomPanelWithRefresh,
                };

                const wrapper = getWrapper({ customPanel: customPanelWithRefresh });
                const instance = wrapper.find(SidebarPanels).instance();
                instance.customSidebar = { current: { refresh: mockRefresh } };

                instance.refresh();

                expect(mockRefresh).toHaveBeenCalled();
            });

            test('should not call refresh on custom panel when ref is null', () => {
                const wrapper = getWrapper({ customPanel });
                const instance = wrapper.find(SidebarPanels).instance();
                instance.customSidebar = { current: null };

                expect(() => instance.refresh()).not.toThrow();
            });
        });

        describe('path precedence', () => {
            test('should render custom panel when path matches even with defaultPanel set', () => {
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel,
                        defaultPanel: 'activity',
                        onPanelChange,
                        path: '/custom',
                    }),
                );
                expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });

            test('should redirect to custom panel when no path specified and custom panel is first eligible', () => {
                const customPanelAsDefault = {
                    ...customPanel,
                    shouldBeDefaultPanel: true,
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelAsDefault,
                        onPanelChange,
                        path: '/',
                    }),
                );
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });
        });

        describe('edge cases', () => {
            test('should handle custom panel with undefined index', () => {
                const customPanelWithoutIndex = {
                    id: 'custom',
                    component: MockCustomPanel,
                    title: 'Custom Panel',
                    // index is undefined
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithoutIndex,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should use default index of 0 and place at end
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should handle custom panel with null component', () => {
                const customPanelWithNullComponent = {
                    id: 'custom',
                    component: null,
                    title: 'Custom Panel',
                };
                // Should not throw when rendering
                expect(() => {
                    render(
                        getSidebarPanels({
                            customPanel: customPanelWithNullComponent,
                            path: '/custom',
                        }),
                    );
                }).not.toThrow();
            });

            test('should handle custom panel with empty id', () => {
                const customPanelWithEmptyId = {
                    id: '',
                    component: MockCustomPanel,
                    title: 'Custom Panel',
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithEmptyId,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should redirect to first available panel since empty id is not eligible
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should handle custom panel with whitespace-only id', () => {
                const customPanelWithWhitespaceId = {
                    id: '   ',
                    component: MockCustomPanel,
                    title: 'Custom Panel',
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithWhitespaceId,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should redirect to first available panel since trimmed id is empty
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should handle custom panel with id that has leading/trailing whitespace', () => {
                const customPanelWithTrimmedId = {
                    id: '  custom  ',
                    component: MockCustomPanel,
                    title: 'Custom Panel',
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithTrimmedId,
                        onPanelChange,
                        path: '/custom',
                    }),
                );
                // Should render custom panel with trimmed id
                expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });

            test('should handle custom panel with undefined id', () => {
                const customPanelWithUndefinedId = {
                    id: undefined,
                    component: MockCustomPanel,
                    title: 'Custom Panel',
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithUndefinedId,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should redirect to first available panel since undefined id is not eligible
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should handle custom panel with null id', () => {
                const customPanelWithNullId = {
                    id: null,
                    component: MockCustomPanel,
                    title: 'Custom Panel',
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithNullId,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should redirect to first available panel since null id is not eligible
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should handle custom panel with undefined component', () => {
                const customPanelWithUndefinedComponent = {
                    id: 'custom',
                    component: undefined,
                    title: 'Custom Panel',
                };
                // Should not throw when rendering
                expect(() => {
                    render(
                        getSidebarPanels({
                            customPanel: customPanelWithUndefinedComponent,
                            path: '/custom',
                        }),
                    );
                }).not.toThrow();
            });
        });

        describe('navButtonProps.isDisabled functionality', () => {
            test('should not render custom panel when navButtonProps.isDisabled is true', () => {
                const disabledCustomPanel = {
                    ...customPanel,
                    navButtonProps: {
                        isDisabled: true,
                    },
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: disabledCustomPanel,
                        onPanelChange,
                        path: '/custom',
                    }),
                );
                // Should not render custom panel when disabled
                expect(screen.queryByTestId('custom-panel')).not.toBeInTheDocument();
                // Should redirect to first available panel
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should render custom panel when navButtonProps.isDisabled is false', () => {
                const enabledCustomPanel = {
                    ...customPanel,
                    navButtonProps: {
                        isDisabled: false,
                    },
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: enabledCustomPanel,
                        onPanelChange,
                        path: '/custom',
                    }),
                );
                // Should render custom panel when enabled
                expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });

            test('should render custom panel when navButtonProps.isDisabled is undefined', () => {
                const customPanelWithUndefinedDisabled = {
                    ...customPanel,
                    navButtonProps: {
                        isDisabled: undefined,
                    },
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithUndefinedDisabled,
                        onPanelChange,
                        path: '/custom',
                    }),
                );
                // Should render custom panel when isDisabled is undefined
                expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });

            test('should render custom panel when navButtonProps is undefined', () => {
                const customPanelWithUndefinedNavButtonProps = {
                    ...customPanel,
                    navButtonProps: undefined,
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: customPanelWithUndefinedNavButtonProps,
                        onPanelChange,
                        path: '/custom',
                    }),
                );
                // Should render custom panel when navButtonProps is undefined
                expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });

            test('should not include disabled custom panel in panel eligibility', () => {
                const disabledCustomPanel = {
                    ...customPanel,
                    navButtonProps: {
                        isDisabled: true,
                    },
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: disabledCustomPanel,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should redirect to first available panel since custom panel is disabled
                expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
            });

            test('should include enabled custom panel in panel eligibility', () => {
                const enabledCustomPanel = {
                    ...customPanel,
                    shouldBeDefaultPanel: true,
                    navButtonProps: {
                        isDisabled: false,
                    },
                };
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        customPanel: enabledCustomPanel,
                        onPanelChange,
                        path: '/',
                    }),
                );
                // Should redirect to custom panel as it's enabled and should be default
                expect(onPanelChange).toHaveBeenCalledWith('custom', true);
            });
        });
    });
});

import * as React from 'react';
import { mount } from 'enzyme/build';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT, FEED_ITEM_TYPE_TASK } from '../../../constants';
import { SidebarPanelsComponent as SidebarPanels } from '../SidebarPanels';

jest.mock('../SidebarUtils');

describe('elements/content-sidebar/SidebarPanels', () => {
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

    const getWrapper = ({ path = '/', ...rest } = {}) => {
        return mount(
            <SidebarPanels
                file={{ id: '1234' }}
                hasDocGen
                hasActivity
                hasDetails
                hasMetadata
                hasNativeBoxAISidebar
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
    };

    const getSidebarPanels = ({ path = '/', ...props }) => {
        return (
            <MemoryRouter initialEntries={[path]}>
                <SidebarPanels
                    file={{ id: '1234' }}
                    hasDocGen
                    hasActivity
                    hasDetails
                    hasMetadata
                    hasNativeBoxAISidebar
                    hasSkills
                    hasVersions
                    isOpen
                    {...props}
                />
            </MemoryRouter>
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
            defaultPanel  | expectedSidebar       | hasActivity | hasDetails | hasMetadata | hasSkills | hasDocGen | hasNativeBoxAISidebar | showOnlyBoxAINavButton | expectedPanelName
            ${'activity'} | ${'docgen-sidebar'}   | ${false}    | ${true}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'details'}  | ${'docgen-sidebar'}   | ${true}     | ${false}   | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'metadata'} | ${'docgen-sidebar'}   | ${true}     | ${true}    | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'skills'}   | ${'docgen-sidebar'}   | ${true}     | ${true}    | ${true}     | ${false}  | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'docgen'}   | ${'activity-sidebar'} | ${true}     | ${true}    | ${true}     | ${false}  | ${false}  | ${true}               | ${false}               | ${'activity'}
            ${'boxai'}    | ${'docgen-sidebar'}   | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${false}              | ${false}               | ${'docgen'}
            ${'boxai'}    | ${'docgen-sidebar'}   | ${true}     | ${true}    | ${true}     | ${true}   | ${true}   | ${true}               | ${true}                | ${'docgen'}
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
                        hasNativeBoxAISidebar,
                        onPanelChange,
                    }),
                );
                expect(screen.getByTestId(expectedSidebar)).toBeInTheDocument();
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
            'should render first available panel and call onPanelChange with $expectedPanelName for users without rights to render default panel, given feature boxai.sidebar.shouldBeDefaultPanel = true and the path = "/" and defaultPanel = $defaultPanel',
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
                        hasNativeBoxAISidebar,
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
            path                                 | hasActivity | hasDetails | hasVersions | hasMetadata | hasSkills | hasDocGen | hasNativeBoxAISidebar | showOnlyBoxAINavButton | expectedPanelName
            ${'/activity'}                       | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/activity/comments'}              | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/activity/comments/1234'}         | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/activity/tasks'}                 | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/activity/tasks/1234'}            | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/activity/annotations/1234/5678'} | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/activity/annotations/1234'}      | ${false}    | ${true}    | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/activity/versions'}              | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/activity/versions/1234'}         | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/details'}                        | ${true}     | ${false}   | ${true}     | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/details/versions'}               | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/details/versions/1234'}          | ${true}     | ${true}    | ${false}    | ${true}     | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/metadata'}                       | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/metadata/filteredTemplates/1,3'} | ${true}     | ${true}    | ${true}     | ${false}    | ${true}   | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/skills'}                         | ${true}     | ${true}    | ${true}     | ${true}     | ${false}  | ${true}   | ${true}               | ${false}               | ${'docgen'}
            ${'/docgen'}                         | ${true}     | ${true}    | ${true}     | ${true}     | ${true}   | ${false}  | ${true}               | ${false}               | ${'skills'}
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
                const onPanelChange = jest.fn();
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                        hasActivity,
                        hasDetails,
                        hasDocGen,
                        hasMetadata,
                        hasSkills,
                        hasVersions,
                        hasNativeBoxAISidebar,
                        onPanelChange,
                        path,
                    }),
                );
                expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
            },
        );

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
            'should call onPanelChange with $expectedPanelName given feature boxai.sidebar.shouldBeDefaultPanel = true and the path = $path for users without rights to render the panel for given path',
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
                        hasDetails,
                        hasDocGen,
                        hasMetadata,
                        hasSkills,
                        hasVersions,
                        hasNativeBoxAISidebar,
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
                hasActivity: false,
                hasDetails: false,
                hasMetadata: false,
                hasNativeBoxAISidebar: false,
                hasSkills: false,
                hasVersions: false,
                hasDocGen: false,
            });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        test('should render nothing when showOnlyNavButton is true and no other panels are available', () => {
            const wrapper = getWrapper({
                features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                hasActivity: false,
                hasDetails: false,
                hasMetadata: false,
                hasSkills: false,
                hasVersions: false,
                hasDocGen: false,
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
            test('should render native Box AI, given feature boxai.sidebar.shouldBeDefaultPanel = true and feature boxai.sidebar.showOnlyNavButton = false', () => {
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { shouldBeDefaultPanel: true, showOnlyNavButton: false } } },
                    }),
                );
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
                    render(
                        getSidebarPanels({
                            features: { boxai: { sidebar: { showOnlyNavButton } } },
                            hasNativeBoxAISidebar,
                        }),
                    );
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
                        render(
                            getSidebarPanels({
                                path: '/boxai',
                                features: { boxai: { sidebar: { showOnlyNavButton } } },
                                hasNativeBoxAISidebar,
                            }),
                        );
                        if (expectedEligible) {
                            expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                        } else {
                            expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                        }
                    },
                );

                test('should render native Box AI panel when showOnlyNavButton is false', () => {
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                        }),
                    );
                    expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                });

                test('should NOT render native Box AI panel when showOnlyNavButton is true', () => {
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                        }),
                    );
                    expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                });

                test('should redirect to first available panel when Box AI is not eligible due to showOnlyNavButton', () => {
                    const onPanelChange = jest.fn();
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                            onPanelChange,
                        }),
                    );
                    // Should redirect to docgen (first in DEFAULT_SIDEBAR_VIEWS)
                    expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
                });

                test('should render custom Box AI panel when hasNativeBoxAISidebar is false and custom panel is provided', () => {
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel()],
                        }),
                    );
                    expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                });

                test('should render custom Box AI panel when showOnlyNavButton is true and custom panel is provided', () => {
                    const CustomBoxAIComponent = () => <div data-testid="custom-boxai-component" />;
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAIComponent })],
                        }),
                    );
                    // Custom Box AI should be rendered since native cannot show panel (showOnlyNavButton)
                    expect(screen.getByTestId('custom-boxai-component')).toBeInTheDocument();
                    // Native Box AI should NOT be rendered
                    expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                });

                test('should render custom Box AI panel when native cannot show (showOnlyNavButton)', () => {
                    const onPanelChange = jest.fn();
                    const CustomBoxAIComponent = () => <div data-testid="custom-boxai-component" />;
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAIComponent })],
                            onPanelChange,
                        }),
                    );
                    // Custom Box AI renders since native route is not in Switch (canShowBoxAISidebarPanel is false)
                    expect(screen.getByTestId('custom-boxai-component')).toBeInTheDocument();
                    expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
                });
            });

            describe('custom boxai sidebar', () => {
                const CustomBoxAI = () => <div data-testid="custom-boxai-sidebar" />;

                test('should render custom Box AI sidebar when provided as only Box AI option', () => {
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                        }),
                    );
                    expect(screen.getByTestId('custom-boxai-sidebar')).toBeInTheDocument();
                });

                test('should render custom Box AI sidebar as default panel when shouldBeDefaultPanel is true', () => {
                    const onPanelChange = jest.fn();
                    render(
                        getSidebarPanels({
                            features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                            onPanelChange,
                        }),
                    );
                    expect(screen.getByTestId('custom-boxai-sidebar')).toBeInTheDocument();
                    expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
                });

                test('should NOT render custom Box AI sidebar when it is disabled', () => {
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled: true })],
                        }),
                    );
                    expect(screen.queryByTestId('custom-boxai-sidebar')).not.toBeInTheDocument();
                });

                test('should redirect to first available panel when custom Box AI sidebar is disabled', () => {
                    const onPanelChange = jest.fn();
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled: true })],
                            onPanelChange,
                        }),
                    );
                    // Should redirect to docgen (first in DEFAULT_SIDEBAR_VIEWS)
                    expect(onPanelChange).toHaveBeenCalledWith('docgen', true);
                });

                test('should call onPanelChange with boxai when navigating to custom Box AI sidebar', () => {
                    const onPanelChange = jest.fn();
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            hasNativeBoxAISidebar: false,
                            customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                            onPanelChange,
                        }),
                    );
                    expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
                });

                test('should render custom Box AI sidebar alongside other sidebars', () => {
                    const wrapper = getWrapper({
                        path: '/boxai',
                        hasNativeBoxAISidebar: false,
                        hasActivity: true,
                        hasDetails: true,
                        customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                    });
                    expect(wrapper.find('div[data-testid="custom-boxai-sidebar"]')).toHaveLength(1);
                });

                // Matching test.each patterns for custom Box AI sidebar
                test.each`
                    path           | expectedPanelName
                    ${'/boxai'}    | ${'boxai'}
                    ${'/nonsense'} | ${'boxai'}
                    ${'/'}         | ${'boxai'}
                `(
                    'should render custom Box AI sidebar and call onPanelChange with $expectedPanelName given shouldBeDefaultPanel = true and path = $path',
                    ({ path, expectedPanelName }) => {
                        const onPanelChange = jest.fn();
                        render(
                            getSidebarPanels({
                                path,
                                features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                                hasNativeBoxAISidebar: false,
                                customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                                onPanelChange,
                            }),
                        );
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
                    'should render $sidebar and call onPanelChange with $expectedPanelName given custom Box AI with shouldBeDefaultPanel = true and defaultPanel = $defaultPanel',
                    ({ defaultPanel, sidebar, expectedPanelName }) => {
                        const onPanelChange = jest.fn();
                        render(
                            getSidebarPanels({
                                defaultPanel,
                                features: { boxai: { sidebar: { shouldBeDefaultPanel: true } } },
                                hasNativeBoxAISidebar: false,
                                customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                                onPanelChange,
                            }),
                        );
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
                        const onPanelChange = jest.fn();
                        render(
                            getSidebarPanels({
                                path,
                                defaultPanel,
                                hasNativeBoxAISidebar: false,
                                customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI })],
                                onPanelChange,
                            }),
                        );
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
                        const onPanelChange = jest.fn();
                        render(
                            getSidebarPanels({
                                path: '/boxai',
                                hasNativeBoxAISidebar: false,
                                hasDocGen,
                                customSidebarPanels: [createBoxAIPanel({ component: CustomBoxAI, isDisabled })],
                                onPanelChange,
                            }),
                        );
                        expect(screen.getByTestId(expectedSidebar)).toBeInTheDocument();
                        expect(onPanelChange).toHaveBeenCalledWith(expectedPanelName, true);
                    },
                );
            });
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

        test('should not throw when custom sidebar does not implement refresh', () => {
            const instance = getWrapper().find(SidebarPanels).instance();

            // Custom sidebar without refresh method
            instance.customSidebars.set('customPanel', { current: {} });

            expect(() => instance.refresh()).not.toThrow();
        });

        test('should call refresh on custom sidebars that implement it', () => {
            const instance = getWrapper().find(SidebarPanels).instance();
            const mockRefresh = jest.fn();

            instance.customSidebars.set('customPanel', { current: { refresh: mockRefresh } });

            instance.refresh();

            expect(mockRefresh).toHaveBeenCalled();
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

            const wrapper = getWrapper({
                path: '/boxai',
                customSidebarPanels,
            });

            expect(wrapper.exists('BoxAISidebar')).toBe(true);
            expect(wrapper.exists('CustomPanel[id="custom1"]')).toBe(false);
            expect(wrapper.exists('CustomPanel[id="custom2"]')).toBe(false);
        });

        test('should render custom panels with regular panels', () => {
            const customSidebarPanels = [
                createCustomPanel('analytics', { title: 'Analytics Panel' }),
                createCustomPanel('reports', { title: 'Reports Panel' }),
            ];

            const wrapper = getWrapper({
                path: '/analytics',
                customSidebarPanels,
                hasActivity: true,
                hasMetadata: true,
            });

            expect(wrapper.find('div[data-testid="analytics-sidebar"]')).toHaveLength(1);
        });

        test('should handle custom panels with different properties', () => {
            const disabledPanel = createCustomPanel('disabled', {
                isDisabled: true,
                title: 'Disabled Panel',
            });
            const enabledPanel = createCustomPanel('enabled', {
                title: 'Enabled Panel',
            });

            const wrapper = getWrapper({
                path: '/enabled',
                customSidebarPanels: [disabledPanel, enabledPanel],
            });

            expect(wrapper.find('div[data-testid="enabled-sidebar"]')).toHaveLength(1);

            const disabledWrapper = getWrapper({
                path: '/disabled',
                customSidebarPanels: [disabledPanel, enabledPanel],
            });

            expect(disabledWrapper.find('div[data-testid="disabled-sidebar"]')).toHaveLength(0);
        });

        test('should render custom panels without Box AI', () => {
            const customSidebarPanels = [
                createCustomPanel('workflow', { title: 'Workflow Panel' }),
                createCustomPanel('integration', { title: 'Integration Panel' }),
            ];

            const wrapper = getWrapper({
                path: '/workflow',
                customSidebarPanels,
            });

            expect(wrapper.find('div[data-testid="workflow-sidebar"]')).toHaveLength(1);
        });

        test('should handle empty custom panels array', () => {
            const wrapper = getWrapper({
                path: '/activity',
                customSidebarPanels: [],
                hasActivity: true,
            });

            expect(wrapper.exists('ActivitySidebar')).toBe(true);
        });

        test('should handle custom panels with Box AI in different positions', () => {
            const customSidebarPanels = [
                createCustomPanel('before', { title: 'Before Box AI' }),
                createBoxAIPanel(),
                createCustomPanel('after', { title: 'After Box AI' }),
            ];

            const boxAIWrapper = getWrapper({
                path: '/boxai',
                customSidebarPanels,
            });
            expect(boxAIWrapper.exists('BoxAISidebar')).toBe(true);

            const beforeWrapper = getWrapper({
                path: '/before',
                customSidebarPanels,
            });
            expect(beforeWrapper.find('div[data-testid="before-sidebar"]')).toHaveLength(1);

            const afterWrapper = getWrapper({
                path: '/after',
                customSidebarPanels,
            });
            expect(afterWrapper.find('div[data-testid="after-sidebar"]')).toHaveLength(1);
        });

        test('should call onPanelChange with correct panel names for custom panels', () => {
            const onPanelChange = jest.fn();
            const customSidebarPanels = [createCustomPanel('dashboard', { title: 'Dashboard' }), createBoxAIPanel()];

            render(
                getSidebarPanels({
                    path: '/dashboard',
                    customSidebarPanels,
                    onPanelChange,
                }),
            );
            expect(onPanelChange).toHaveBeenCalledWith('dashboard', true);

            onPanelChange.mockClear();

            render(
                getSidebarPanels({
                    path: '/boxai',
                    customSidebarPanels,
                    onPanelChange,
                }),
            );
            expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
        });

        test('should render other custom panels alongside native Box AI', () => {
            const analyticsPanel = createCustomPanel('analytics', { title: 'Analytics Panel' });
            const boxAiPanel = createBoxAIPanel();

            const wrapper = getWrapper({
                path: '/analytics',
                customSidebarPanels: [boxAiPanel, analyticsPanel],
            });

            expect(wrapper.find('div[data-testid="analytics-sidebar"]')).toHaveLength(1);
        });
    });
});

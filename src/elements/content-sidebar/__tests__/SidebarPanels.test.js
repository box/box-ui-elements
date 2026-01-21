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

    const getWrapper = ({ path = '/', customPanels, ...rest } = {}) => {
        return mount(
            <SidebarPanels
                file={{ id: '1234' }}
                customPanels={customPanels}
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
    };

    const getSidebarPanels = ({ path = '/', customPanels, ...props }) => {
        return (
            <MemoryRouter initialEntries={[path]}>
                <SidebarPanels
                    file={{ id: '1234' }}
                    customPanels={customPanels}
                    hasDocGen
                    hasActivity
                    hasDetails
                    hasMetadata
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
            const customPanels = sidebar === 'BoxAISidebar' ? [createBoxAIPanel()] : undefined;
            const wrapper = getWrapper({ path, customPanels });
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
                    customPanels: [createBoxAIPanel()],
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
                const customPanels = expectedPanelName === 'boxai' ? [createBoxAIPanel()] : undefined;
                render(
                    getSidebarPanels({
                        defaultPanel,
                        onPanelChange,
                        customPanels,
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
                        customPanels: [createBoxAIPanel()],
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
                const customPanels =
                    hasNativeBoxAISidebar && !showOnlyBoxAINavButton ? [createBoxAIPanel()] : undefined;
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                        defaultPanel,
                        hasActivity,
                        hasDetails,
                        hasMetadata,
                        hasSkills,
                        hasDocGen,
                        customPanels,
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
                const customPanels =
                    hasNativeBoxAISidebar && !showOnlyBoxAINavButton ? [createBoxAIPanel()] : undefined;
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
                        customPanels,
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
                    const customPanels = expectedPanelName === 'boxai' ? [createBoxAIPanel()] : undefined;
                    render(
                        getSidebarPanels({
                            defaultPanel,
                            onPanelChange,
                            path,
                            customPanels,
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
            const customPanels = expectedPanelName === 'boxai' ? [createBoxAIPanel()] : undefined;
            render(
                getSidebarPanels({
                    path,
                    onPanelChange,
                    customPanels,
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
                        customPanels: [createBoxAIPanel()],
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
                const customPanels =
                    hasNativeBoxAISidebar && !showOnlyBoxAINavButton ? [createBoxAIPanel()] : undefined;
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { showOnlyNavButton: showOnlyBoxAINavButton } } },
                        hasActivity,
                        hasDetails,
                        hasDocGen,
                        hasMetadata,
                        hasSkills,
                        hasVersions,
                        customPanels,
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
                const customPanels =
                    hasNativeBoxAISidebar && !showOnlyBoxAINavButton ? [createBoxAIPanel()] : undefined;
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
                        customPanels,
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
            test('should render, given feature boxai.sidebar.shouldBeDefaultPanel = true and customPanels includes Box AI and feature boxai.sidebar.showOnlyNavButton = false', () => {
                render(
                    getSidebarPanels({
                        features: { boxai: { sidebar: { shouldBeDefaultPanel: true, showOnlyNavButton: false } } },
                        customPanels: [createBoxAIPanel()],
                    }),
                );
                expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
            });

            test.each`
                customPanels            | showOnlyNavButton
                ${[createBoxAIPanel()]} | ${true}
                ${undefined}            | ${true}
                ${undefined}            | ${false}
            `(
                'should not render, given customPanels = $customPanels and feature boxai.sidebar.showOnlyNavButton = $showOnlyNavButton',
                ({ customPanels, showOnlyNavButton }) => {
                    render(
                        getSidebarPanels({
                            features: { boxai: { sidebar: { showOnlyNavButton } } },
                            customPanels,
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

                test('should render native Box AI panel when hasNativeBoxAISidebar is true and showOnlyNavButton is false', () => {
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                            hasNativeBoxAISidebar: true,
                        }),
                    );
                    expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                });

                test('should NOT render native Box AI panel when showOnlyNavButton is true even if hasNativeBoxAISidebar is true', () => {
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                            hasNativeBoxAISidebar: true,
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
                            hasNativeBoxAISidebar: true,
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
                            customPanels: [createBoxAIPanel()],
                        }),
                    );
                    expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                });

                test('should prioritize native Box AI over custom Box AI panel when both are available', () => {
                    const CustomBoxAIComponent = () => <div data-testid="custom-boxai-component" />;
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: false } } },
                            hasNativeBoxAISidebar: true,
                            customPanels: [createBoxAIPanel({ component: CustomBoxAIComponent })],
                        }),
                    );
                    // Native Box AI should be rendered, not the custom one
                    expect(screen.getByTestId('boxai-sidebar')).toBeInTheDocument();
                    expect(screen.queryByTestId('custom-boxai-component')).not.toBeInTheDocument();
                });

                test('should render custom Box AI panel when showOnlyNavButton is true and custom panel is provided', () => {
                    const CustomBoxAIComponent = () => <div data-testid="custom-boxai-component" />;
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                            hasNativeBoxAISidebar: true,
                            customPanels: [createBoxAIPanel({ component: CustomBoxAIComponent })],
                        }),
                    );
                    // Custom Box AI should be rendered since native cannot show panel (showOnlyNavButton)
                    expect(screen.getByTestId('custom-boxai-component')).toBeInTheDocument();
                    // Native Box AI should NOT be rendered
                    expect(screen.queryByTestId('boxai-sidebar')).not.toBeInTheDocument();
                });

                test('should make custom Box AI panel eligible when canShowBoxAISidebarPanel is false', () => {
                    const onPanelChange = jest.fn();
                    const CustomBoxAIComponent = () => <div data-testid="custom-boxai-component" />;
                    render(
                        getSidebarPanels({
                            path: '/boxai',
                            features: { boxai: { sidebar: { showOnlyNavButton: true } } },
                            hasNativeBoxAISidebar: true,
                            customPanels: [createBoxAIPanel({ component: CustomBoxAIComponent })],
                            onPanelChange,
                        }),
                    );
                    // Should render custom Box AI and call onPanelChange with boxai
                    expect(screen.getByTestId('custom-boxai-component')).toBeInTheDocument();
                    expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
                });
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

    describe('multiple customPanels rendering', () => {
        const createCustomPanel = (id, overrides = {}) => ({
            id,
            path: id,
            component: () => <div data-testid={`${id}-sidebar`} />,
            isDisabled: false,
            ...overrides,
        });

        test('should render multiple custom panels including Box AI', () => {
            const customPanels = [
                createBoxAIPanel(),
                createCustomPanel('custom1', { title: 'Custom Panel 1' }),
                createCustomPanel('custom2', { title: 'Custom Panel 2' }),
            ];

            const wrapper = getWrapper({
                path: '/boxai',
                customPanels,
            });

            expect(wrapper.exists('BoxAISidebar')).toBe(true);
            expect(wrapper.exists('CustomPanel[id="custom1"]')).toBe(false);
            expect(wrapper.exists('CustomPanel[id="custom2"]')).toBe(false);
        });

        test('should render custom panels with regular panels', () => {
            const customPanels = [
                createCustomPanel('analytics', { title: 'Analytics Panel' }),
                createCustomPanel('reports', { title: 'Reports Panel' }),
            ];

            const wrapper = getWrapper({
                path: '/analytics',
                customPanels,
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
                customPanels: [disabledPanel, enabledPanel],
            });

            expect(wrapper.find('div[data-testid="enabled-sidebar"]')).toHaveLength(1);

            const disabledWrapper = getWrapper({
                path: '/disabled',
                customPanels: [disabledPanel, enabledPanel],
            });

            expect(disabledWrapper.find('div[data-testid="disabled-sidebar"]')).toHaveLength(0);
        });

        test('should render custom panels without Box AI', () => {
            const customPanels = [
                createCustomPanel('workflow', { title: 'Workflow Panel' }),
                createCustomPanel('integration', { title: 'Integration Panel' }),
            ];

            const wrapper = getWrapper({
                path: '/workflow',
                customPanels,
            });

            expect(wrapper.find('div[data-testid="workflow-sidebar"]')).toHaveLength(1);
        });

        test('should handle empty custom panels array', () => {
            const wrapper = getWrapper({
                path: '/activity',
                customPanels: [],
                hasActivity: true,
            });

            expect(wrapper.exists('ActivitySidebar')).toBe(true);
        });

        test('should handle custom panels with Box AI in different positions', () => {
            const customPanels = [
                createCustomPanel('before', { title: 'Before Box AI' }),
                createBoxAIPanel(),
                createCustomPanel('after', { title: 'After Box AI' }),
            ];

            const boxAIWrapper = getWrapper({
                path: '/boxai',
                customPanels,
            });
            expect(boxAIWrapper.exists('BoxAISidebar')).toBe(true);

            const beforeWrapper = getWrapper({
                path: '/before',
                customPanels,
            });
            expect(beforeWrapper.find('div[data-testid="before-sidebar"]')).toHaveLength(1);

            const afterWrapper = getWrapper({
                path: '/after',
                customPanels,
            });
            expect(afterWrapper.find('div[data-testid="after-sidebar"]')).toHaveLength(1);
        });

        test('should call onPanelChange with correct panel names for custom panels', () => {
            const onPanelChange = jest.fn();
            const customPanels = [createCustomPanel('dashboard', { title: 'Dashboard' }), createBoxAIPanel()];

            render(
                getSidebarPanels({
                    path: '/dashboard',
                    customPanels,
                    onPanelChange,
                }),
            );
            expect(onPanelChange).toHaveBeenCalledWith('dashboard', true);

            onPanelChange.mockClear();

            render(
                getSidebarPanels({
                    path: '/boxai',
                    customPanels,
                    onPanelChange,
                }),
            );
            expect(onPanelChange).toHaveBeenCalledWith('boxai', true);
        });

        test('should render other custom panels alongside native Box AI when hasNativeBoxAISidebar is true', () => {
            const analyticsPanel = createCustomPanel('analytics', { title: 'Analytics Panel' });
            const boxAiPanel = createBoxAIPanel();

            const wrapper = getWrapper({
                path: '/analytics',
                customPanels: [boxAiPanel, analyticsPanel],
                hasNativeBoxAISidebar: true,
            });

            expect(wrapper.find('div[data-testid="analytics-sidebar"]')).toHaveLength(1);
        });

        test('should NOT render custom Box AI panel when hasNativeBoxAISidebar is true', () => {
            const analyticsPanel = createCustomPanel('analytics', { title: 'Analytics Panel' });
            const CustomBoxAIComponent = () => <div data-testid="custom-boxai-sidebar" />;
            const boxAiPanel = createBoxAIPanel({ component: CustomBoxAIComponent });

            const wrapper = getWrapper({
                path: '/boxai',
                customPanels: [boxAiPanel, analyticsPanel],
                hasNativeBoxAISidebar: true,
            });

            expect(wrapper.find('div[data-testid="boxai-sidebar"]')).toHaveLength(1);
            expect(wrapper.find('div[data-testid="custom-boxai-sidebar"]')).toHaveLength(0);
        });
    });
});

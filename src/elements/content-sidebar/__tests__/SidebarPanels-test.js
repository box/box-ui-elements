import React from 'react';
import { mount } from 'enzyme/build';
import { MemoryRouter } from 'react-router-dom';
import SidebarPanels from '../SidebarPanels';

// mock lazy import paths onto regular imports
jest.mock('../SidebarUtils', () => ({
    getAsyncSidebarContent: jest.fn(panelName => {
        return {
            details: function DetailsSidebar() {
                return <div data-testid="details-sidebar" />;
            },
            metadata: function MetadataSidebar() {
                return <div data-testid="metadata-sidebar" />;
            },
            skills: function SkillsSidebar() {
                return <div data-testid="skills-sidebar" />;
            },
            activity: function ActivitySidebar() {
                return <div data-testid="activity-sidebar" />;
            },
            versions: function VersionsSidebar() {
                return <div data-testid="versions-sidebar" />;
            },
        }[panelName];
    }),
}));

describe('elements/content-sidebar/SidebarPanels', () => {
    const getWrapper = ({ path = '/', ...rest } = {}) =>
        mount(
            <MemoryRouter initialEntries={[path]} keyLength={0}>
                <SidebarPanels
                    file={{ id: '1234' }}
                    hasActivity
                    hasDetails
                    hasMetadata
                    hasSkills
                    hasVersions
                    isOpen
                    {...rest}
                />
            </MemoryRouter>,
        );

    describe('render', () => {
        test.each`
            path                         | sidebar
            ${'/activity'}               | ${'ActivitySidebar'}
            ${'/activity/comments'}      | ${'ActivitySidebar'}
            ${'/activity/comments/1234'} | ${'ActivitySidebar'}
            ${'/activity/tasks'}         | ${'ActivitySidebar'}
            ${'/activity/tasks/1234'}    | ${'ActivitySidebar'}
            ${'/activity/versions'}      | ${'VersionsSidebar'}
            ${'/activity/versions/1234'} | ${'VersionsSidebar'}
            ${'/details'}                | ${'DetailsSidebar'}
            ${'/details/versions'}       | ${'VersionsSidebar'}
            ${'/details/versions/1234'}  | ${'VersionsSidebar'}
            ${'/metadata'}               | ${'MetadataSidebar'}
            ${'/skills'}                 | ${'SkillsSidebar'}
            ${'/nonsense'}               | ${'SkillsSidebar'}
            ${'/'}                       | ${'SkillsSidebar'}
        `('should render $sidebar given the path $path', ({ path, sidebar }) => {
            const wrapper = getWrapper({ path });
            expect(wrapper.exists(sidebar)).toBe(true);
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
            });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        describe('activity sidebar', () => {
            test('should render with tasks deeplink', () => {
                const wrapper = getWrapper({ path: '/activity/tasks/12345' });
                expect(wrapper.find('ActivitySidebar').props()).toMatchObject({
                    activeFeedEntryType: 'task',
                    activeFeedEntryId: '12345',
                });
            });

            test('should render with comments deeplink', () => {
                const wrapper = getWrapper({ path: '/activity/comments/12345' });
                expect(wrapper.find('ActivitySidebar').props()).toMatchObject({
                    activeFeedEntryType: 'comment',
                    activeFeedEntryId: '12345',
                });
            });

            test('should render with versions deeplink', () => {
                const wrapper = getWrapper({ path: '/activity/versions/12345' });
                expect(wrapper.find('VersionsSidebar').props()).toMatchObject({
                    versionId: '12345',
                });
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
    });
});

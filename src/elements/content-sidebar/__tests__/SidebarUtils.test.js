import noop from 'lodash/noop';
import * as performance from '../../../utils/performance';
import SidebarUtils from '../SidebarUtils';
import * as skillUtils from '../skills/skillUtils';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_METADATA,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_DOCGEN,
    SIDEBAR_VIEW_BOXAI,
} from '../../../constants';
import { isFeatureEnabled } from '../../common/feature-checking';

jest.mock('../../common/async-load', () => () => 'LoadableComponent');
jest.mock('../SidebarLoadingError', () => 'sidebar-loading-error');
jest.mock('../../common/feature-checking');

describe('elements/content-sidebar/SidebarUtil', () => {
    describe('canHaveSidebar()', () => {
        test('should return false when nothing is wanted in the sidebar', () => {
            expect(SidebarUtils.canHaveSidebar({})).toBeFalsy();
        });
        test('should return true when skills should render', () => {
            expect(SidebarUtils.canHaveSidebar({ hasSkills: true })).toBeTruthy();
        });
        test('should return true when properties should render', () => {
            expect(
                SidebarUtils.canHaveSidebar({
                    detailsSidebarProps: { hasProperties: true },
                }),
            ).toBeTruthy();
        });
        test('should return true when access stats should render', () => {
            expect(
                SidebarUtils.canHaveSidebar({
                    detailsSidebarProps: { hasAccessStats: true },
                }),
            ).toBeTruthy();
        });
        test('should return true when metadata should render', () => {
            expect(SidebarUtils.canHaveSidebar({ hasMetadata: true })).toBeTruthy();
        });
        test('should return true when classification should render', () => {
            expect(
                SidebarUtils.canHaveSidebar({
                    detailsSidebarProps: { hasClassification: true },
                }),
            ).toBeTruthy();
        });
        test('should return true when activity feed should render', () => {
            expect(SidebarUtils.canHaveSidebar({ hasActivityFeed: true })).toBeTruthy();
        });
        test('should return true when box ai feed should render', () => {
            isFeatureEnabled.mockReturnValueOnce(true);
            expect(SidebarUtils.canHaveSidebar({})).toBeTruthy();
        });
        test('should return true when notices should render', () => {
            expect(
                SidebarUtils.canHaveSidebar({
                    detailsSidebarProps: { hasNotices: true },
                }),
            ).toBeTruthy();
        });
    });
    describe('canHaveDetailsSidebar()', () => {
        test('should return false when nothing is wanted in the details sidebar', () => {
            expect(SidebarUtils.canHaveDetailsSidebar({})).toBeFalsy();
        });
        test('should return true when properties should render', () => {
            expect(
                SidebarUtils.canHaveDetailsSidebar({
                    detailsSidebarProps: { hasProperties: true },
                }),
            ).toBeTruthy();
        });
        test('should return true when access stats should render', () => {
            expect(
                SidebarUtils.canHaveDetailsSidebar({
                    detailsSidebarProps: { hasAccessStats: true },
                }),
            ).toBeTruthy();
        });
        test('should return true when classification should render', () => {
            expect(
                SidebarUtils.canHaveDetailsSidebar({
                    detailsSidebarProps: { hasClassification: true },
                }),
            ).toBeTruthy();
        });
        test('should return true when notices should render', () => {
            expect(
                SidebarUtils.canHaveDetailsSidebar({
                    detailsSidebarProps: { hasNotices: true },
                }),
            ).toBeTruthy();
        });
    });
    describe('shouldRenderSkillsSidebar()', () => {
        test('should return false when nothing is wanted in the skills sidebar', () => {
            expect(SidebarUtils.shouldRenderSkillsSidebar({})).toBeFalsy();
        });
        test('should return false when no file', () => {
            expect(SidebarUtils.shouldRenderSkillsSidebar({ hasSkills: true })).toBeFalsy();
        });
        test('should return false when hasSkills is false', () => {
            expect(SidebarUtils.shouldRenderSkillsSidebar({ hasSkills: false }, {})).toBeFalsy();
        });
        test('should return false when no skill data', () => {
            skillUtils.hasSkills = jest.fn().mockReturnValueOnce(false);
            expect(SidebarUtils.shouldRenderSkillsSidebar({ hasSkills: true }, 'file')).toBeFalsy();
            expect(skillUtils.hasSkills).toHaveBeenCalledWith('file');
        });
        test('should return true when hasSkills is true and there is skills data', () => {
            skillUtils.hasSkills = jest.fn().mockReturnValueOnce(true);
            expect(SidebarUtils.shouldRenderSkillsSidebar({ hasSkills: true }, 'file')).toBeTruthy();
            expect(skillUtils.hasSkills).toHaveBeenCalledWith('file');
        });
    });
    describe('canHaveActivitySidebar()', () => {
        test('should return false when hasActivityFeed is false', () => {
            expect(SidebarUtils.canHaveActivitySidebar({ hasActivityFeed: false })).toBeFalsy();
        });
        test('should return true when hasActivityFeed is true', () => {
            expect(SidebarUtils.canHaveActivitySidebar({ hasActivityFeed: true }, {})).toBeTruthy();
        });
    });
    describe('canHaveBoxAISidebar()', () => {
        test('should return false when boxai.sidebar.enabled feature flag is not set', () => {
            expect(SidebarUtils.canHaveBoxAISidebar({ features: {} })).toBeFalsy();
        });
        test('should return true when isFeatureEnabled returns true', () => {
            isFeatureEnabled.mockReturnValueOnce(true);
            expect(SidebarUtils.canHaveBoxAISidebar({})).toBeTruthy();
        });
    });
    describe('canHaveMetadataSidebar()', () => {
        test('should return false when hasMetadata is false', () => {
            expect(SidebarUtils.canHaveMetadataSidebar({ hasMetadata: false })).toBeFalsy();
        });
        test('should return true when hasMetadata is true', () => {
            expect(SidebarUtils.canHaveMetadataSidebar({ hasMetadata: true }, {})).toBeTruthy();
        });
    });
    describe('shouldRenderMetadataSidebar()', () => {
        test('should return false when nothing is wanted in the metadata sidebar', () => {
            expect(SidebarUtils.shouldRenderMetadataSidebar({})).toBeFalsy();
        });
        test('should return false when nothing is wanted in the metadata sidebar', () => {
            expect(
                SidebarUtils.shouldRenderMetadataSidebar({
                    hasMetadata: false,
                }),
            ).toBeFalsy();
        });
        test('should return true by default when we dont know availability of metadata feature', () => {
            expect(SidebarUtils.shouldRenderMetadataSidebar({ hasMetadata: true })).toBeTruthy();
        });
        test('should return false when hasMetadata is false', () => {
            expect(SidebarUtils.shouldRenderMetadataSidebar({ hasMetadata: false }, ['foo'])).toBeFalsy();
        });
        test('should return false when hasMetadata is false', () => {
            expect(
                SidebarUtils.shouldRenderMetadataSidebar(
                    {
                        hasMetadata: false,
                        metadataSidebarProps: { isFeatureEnabled: true },
                    },
                    ['foo'],
                ),
            ).toBeFalsy();
        });
        test('should return false when no metadata and no feature', () => {
            expect(
                SidebarUtils.shouldRenderMetadataSidebar(
                    {
                        hasMetadata: true,
                        metadataSidebarProps: { isFeatureEnabled: false },
                    },
                    [],
                ),
            ).toBeFalsy();
        });
        test('should return true when no metadata and feature enabled', () => {
            expect(
                SidebarUtils.shouldRenderMetadataSidebar(
                    {
                        hasMetadata: true,
                        metadataSidebarProps: { isFeatureEnabled: true },
                    },
                    [],
                ),
            ).toBeTruthy();
        });
        test('should return true when metadata and feature is not enabled', () => {
            expect(
                SidebarUtils.shouldRenderMetadataSidebar(
                    {
                        hasMetadata: true,
                        metadataSidebarProps: { isFeatureEnabled: false },
                    },
                    ['foo'],
                ),
            ).toBeTruthy();
        });
    });

    describe('shouldRenderSidebar()', () => {
        test('should return false when nothing is wanted in the sidebar', () => {
            expect(SidebarUtils.shouldRenderSidebar({})).toBeFalsy();
        });
        test('should return false when no file', () => {
            expect(SidebarUtils.shouldRenderSidebar({ hasSkills: true })).toBeFalsy();
        });
        test('should return true when we can render box ai sidebar', () => {
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveBoxAISidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(false);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file')).toBeTruthy();
        });
        test('should return true when we can render details sidebar', () => {
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveBoxAISidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(false);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file')).toBeTruthy();
            expect(SidebarUtils.canHaveDetailsSidebar).toHaveBeenCalledWith('props');
        });
        test('should return true when we can render metadata sidebar', () => {
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveBoxAISidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file', 'editors')).toBeTruthy();
            expect(SidebarUtils.shouldRenderMetadataSidebar).toHaveBeenCalledWith('props', 'editors');
        });
        test('should return true when we can render activity sidebar', () => {
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveBoxAISidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(false);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file')).toBeTruthy();
            expect(SidebarUtils.canHaveActivitySidebar).toHaveBeenCalledWith('props');
        });
        test('should return true when we can render skills sidebar', () => {
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveBoxAISidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(false);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file')).toBeTruthy();
            expect(SidebarUtils.shouldRenderSkillsSidebar).toHaveBeenCalledWith('props', 'file');
        });
    });

    describe('getTitleForView()', () => {
        test.each([
            SIDEBAR_VIEW_SKILLS,
            SIDEBAR_VIEW_DETAILS,
            SIDEBAR_VIEW_METADATA,
            SIDEBAR_VIEW_ACTIVITY,
            SIDEBAR_VIEW_BOXAI,
            SIDEBAR_VIEW_DOCGEN,
        ])('should return the title for %s', view => {
            const title = SidebarUtils.getTitleForView(view);
            expect(title).toMatchSnapshot();
        });

        test('should return null if invalid view', () => {
            const title = SidebarUtils.getTitleForView('foo');
            expect(title).toBe(null);
        });
    });

    describe('getLoaderForView()', () => {
        const MARK_NAME = 'foo_mark';
        beforeEach(() => {
            jest.spyOn(performance, 'mark').mockImplementation(noop);
        });

        test.each([
            SIDEBAR_VIEW_SKILLS,
            SIDEBAR_VIEW_DETAILS,
            SIDEBAR_VIEW_METADATA,
            SIDEBAR_VIEW_ACTIVITY,
            SIDEBAR_VIEW_DOCGEN,
            'foo',
        ])('should return the loader for %s', view => {
            const loader = SidebarUtils.getLoaderForView(view, MARK_NAME);
            expect(performance.mark).toHaveBeenCalledWith(MARK_NAME);
            expect(loader).toBeInstanceOf(Promise);
        });
    });

    describe('getAsyncSidebarContent()', () => {
        beforeEach(() => {
            jest.spyOn(SidebarUtils, 'getTitleForView').mockReturnValue('foo');
        });

        test('should return the async component', () => {
            const asyncComponent = SidebarUtils.getAsyncSidebarContent('foo_view', 'foo_mark');
            expect(asyncComponent).toMatchSnapshot();
        });

        test('should mix in additional props', () => {
            const asyncComponent = SidebarUtils.getAsyncSidebarContent('foo_view', 'foo_mark', {
                foo: 'bar',
                errorComponent: null,
            });
            expect(asyncComponent).toMatchSnapshot();
        });
    });
});

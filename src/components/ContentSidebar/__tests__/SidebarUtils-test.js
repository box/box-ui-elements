import SidebarUtils from '../SidebarUtils';
import * as skillUtils from '../Skills/skillUtils';

describe('components/ContentSidebar/SidebarUtil', () => {
    describe('canHaveSidebar()', () => {
        test('should return false when nothing is wanted in the sidebar', () => {
            expect(SidebarUtils.canHaveSidebar({})).toBeFalsy();
        });
        test('should return true when skills should render', () => {
            expect(SidebarUtils.canHaveSidebar({ hasSkills: true })).toBeTruthy();
        });
        test('should return true when properties should render', () => {
            expect(SidebarUtils.canHaveSidebar({ detailsSidebarProps: { hasProperties: true } })).toBeTruthy();
        });
        test('should return true when access stats should render', () => {
            expect(SidebarUtils.canHaveSidebar({ detailsSidebarProps: { hasAccessStats: true } })).toBeTruthy();
        });
        test('should return true when metadata should render', () => {
            expect(SidebarUtils.canHaveSidebar({ hasMetadata: true })).toBeTruthy();
        });
        test('should return true when classification should render', () => {
            expect(SidebarUtils.canHaveSidebar({ detailsSidebarProps: { hasClassification: true } })).toBeTruthy();
        });
        test('should return true when activity feed should render', () => {
            expect(SidebarUtils.canHaveSidebar({ hasActivityFeed: true })).toBeTruthy();
        });
        test('should return true when versions should render', () => {
            expect(SidebarUtils.canHaveSidebar({ detailsSidebarProps: { hasVersions: true } })).toBeTruthy();
        });
        test('should return true when notices should render', () => {
            expect(SidebarUtils.canHaveSidebar({ detailsSidebarProps: { hasNotices: true } })).toBeTruthy();
        });
    });
    describe('shouldRenderDetailsSidebar()', () => {
        test('should return false when nothing is wanted in the details sidebar', () => {
            expect(SidebarUtils.shouldRenderDetailsSidebar({})).toBeFalsy();
        });
        test('should return true when properties should render', () => {
            expect(
                SidebarUtils.shouldRenderDetailsSidebar({ detailsSidebarProps: { hasProperties: true } })
            ).toBeTruthy();
        });
        test('should return true when access stats should render', () => {
            expect(
                SidebarUtils.shouldRenderDetailsSidebar({ detailsSidebarProps: { hasAccessStats: true } })
            ).toBeTruthy();
        });
        test('should return true when classification should render', () => {
            expect(
                SidebarUtils.shouldRenderDetailsSidebar({ detailsSidebarProps: { hasClassification: true } })
            ).toBeTruthy();
        });
        test('should return true when versions should render', () => {
            expect(
                SidebarUtils.shouldRenderDetailsSidebar({ detailsSidebarProps: { hasVersions: true } })
            ).toBeTruthy();
        });
        test('should return true when notices should render', () => {
            expect(SidebarUtils.shouldRenderDetailsSidebar({ detailsSidebarProps: { hasNotices: true } })).toBeTruthy();
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
    describe('shouldRenderActivitySidebar()', () => {
        test('should return false when hasActivityFeed is false', () => {
            expect(SidebarUtils.shouldRenderActivitySidebar({ hasActivityFeed: false })).toBeFalsy();
        });
        test('should return true when hasActivityFeed is true', () => {
            expect(SidebarUtils.shouldRenderActivitySidebar({ hasActivityFeed: true }, {})).toBeTruthy();
        });
    });
    describe('shouldRenderMetadataSidebar()', () => {
        test('should return false when hasMetadata is false', () => {
            expect(SidebarUtils.shouldRenderMetadataSidebar({ hasMetadata: false })).toBeFalsy();
        });
        test('should return true when hasMetadata is true', () => {
            expect(SidebarUtils.shouldRenderMetadataSidebar({ hasMetadata: true }, {})).toBeTruthy();
        });
    });
    describe('shouldRenderSidebar()', () => {
        test('should return false when nothing is wanted in the sidebar', () => {
            expect(SidebarUtils.shouldRenderSidebar({})).toBeFalsy();
        });
        test('should return false when no file', () => {
            expect(SidebarUtils.shouldRenderSidebar({ hasSkills: true })).toBeFalsy();
        });
        test('should return true when we can render details sidebar', () => {
            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(false);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file')).toBeTruthy();
            expect(SidebarUtils.shouldRenderDetailsSidebar).toHaveBeenCalledWith('props');
        });
        test('should return true when we can render metadata sidebar', () => {
            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file')).toBeTruthy();
            expect(SidebarUtils.shouldRenderMetadataSidebar).toHaveBeenCalledWith('props');
        });
        test('should return true when we can render activity sidebar', () => {
            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(false);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file')).toBeTruthy();
            expect(SidebarUtils.shouldRenderActivitySidebar).toHaveBeenCalledWith('props');
        });
        test('should return true when we can render skills sidebar', () => {
            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(false);
            expect(SidebarUtils.shouldRenderSidebar('props', 'file')).toBeTruthy();
            expect(SidebarUtils.shouldRenderSkillsSidebar).toHaveBeenCalledWith('props', 'file');
        });
    });
});

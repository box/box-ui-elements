import { shouldRenderDetailsSidebar, shouldRenderSidebar } from '../sidebarUtil';

describe('components/ContentSidebar/sidebarUtil', () => {
    describe('shouldRenderSidebar()', () => {
        test('should return false when nothing is wanted in the sidebar', () => {
            expect(shouldRenderSidebar({})).toBeFalsy();
        });
        test('should return false when isVisible is set to false for controlled sidebar with skills', () => {
            expect(shouldRenderSidebar({ isVisible: false, hasSkills: true })).toBeFalsy();
        });
        test('should return false when isVisible is set to false for controlled sidebar with properties', () => {
            expect(shouldRenderSidebar({ isVisible: false, hasProperties: true })).toBeFalsy();
        });
        test('should return false when isVisible is set to false for controlled sidebar with access stats', () => {
            expect(shouldRenderSidebar({ isVisible: false, hasAccessStats: true })).toBeFalsy();
        });
        test('should return false when isVisible is set to false for controlled sidebar with metadata', () => {
            expect(shouldRenderSidebar({ isVisible: false, hasMetadata: true })).toBeFalsy();
        });
        test('should return false when isVisible is set to false for controlled sidebar with activity feed', () => {
            expect(shouldRenderSidebar({ isVisible: false, hasActivityFeed: true })).toBeFalsy();
        });
        test('should return false when isVisible is set to false for controlled sidebar with classification', () => {
            expect(shouldRenderSidebar({ isVisible: false, hasClassification: true })).toBeFalsy();
        });
        test('should return false when isVisible is set to false for controlled sidebar with versions', () => {
            expect(shouldRenderSidebar({ isVisible: false, hasVersions: true })).toBeFalsy();
        });
        test('should return false when isVisible is set to false for controlled sidebar with notices', () => {
            expect(shouldRenderSidebar({ isVisible: false, hasNotices: true })).toBeFalsy();
        });
        test('should return true when skills should render', () => {
            expect(shouldRenderSidebar({ hasSkills: true })).toBeTruthy();
        });
        test('should return true when properties should render', () => {
            expect(shouldRenderSidebar({ hasProperties: true })).toBeTruthy();
        });
        test('should return true when access stats should render', () => {
            expect(shouldRenderSidebar({ hasAccessStats: true })).toBeTruthy();
        });
        test('should return true when metadata should render', () => {
            expect(shouldRenderSidebar({ hasMetadata: true })).toBeTruthy();
        });
        test('should return true when classification should render', () => {
            expect(shouldRenderSidebar({ hasClassification: true })).toBeTruthy();
        });
        test('should return true when activity feed should render', () => {
            expect(shouldRenderSidebar({ hasActivityFeed: true })).toBeTruthy();
        });
        test('should return true when versions should render', () => {
            expect(shouldRenderSidebar({ hasVersions: true })).toBeTruthy();
        });
        test('should return true when notices should render', () => {
            expect(shouldRenderSidebar({ hasNotices: true })).toBeTruthy();
        });
    });
    describe('shouldRenderDetailsSidebar()', () => {
        test('should return false when nothing is wanted in the details sidebar', () => {
            expect(shouldRenderDetailsSidebar({})).toBeFalsy();
        });
        test('should return true when skills should render', () => {
            expect(shouldRenderDetailsSidebar({ hasSkills: true })).toBeTruthy();
        });
        test('should return true when properties should render', () => {
            expect(shouldRenderDetailsSidebar({ hasProperties: true })).toBeTruthy();
        });
        test('should return true when access stats should render', () => {
            expect(shouldRenderDetailsSidebar({ hasAccessStats: true })).toBeTruthy();
        });
        test('should return true when metadata should render', () => {
            expect(shouldRenderDetailsSidebar({ hasMetadata: true })).toBeTruthy();
        });
        test('should return true when classification should render', () => {
            expect(shouldRenderDetailsSidebar({ hasClassification: true })).toBeTruthy();
        });
        test('should return true when versions should render', () => {
            expect(shouldRenderDetailsSidebar({ hasVersions: true })).toBeTruthy();
        });
        test('should return true when notices should render', () => {
            expect(shouldRenderDetailsSidebar({ hasNotices: true })).toBeTruthy();
        });
    });
});

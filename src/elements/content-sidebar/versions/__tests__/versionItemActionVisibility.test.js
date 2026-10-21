import { selectComparisonBannerActions } from '../versionItemActionVisibility';

describe('elements/content-sidebar/versions/versionItemActionVisibility', () => {
    const handlers = {
        delete: jest.fn(() => Promise.resolve()),
        download: jest.fn(() => Promise.resolve()),
        promote: jest.fn(() => Promise.resolve()),
    };
    const permissions = {
        can_delete: true,
        can_download: true,
        can_preview: true,
        can_upload: true,
    };
    const currentVersion = {
        extension: 'docx',
        id: '123',
        is_download_available: true,
        permissions,
        version_number: '3',
    };
    const comparedVersion = {
        extension: 'docx',
        id: '456',
        is_download_available: true,
        permissions,
        version_number: '2',
    };

    const getActions = (overrides = {}) => ({
        ...handlers,
        isArchived: false,
        isWatermarked: false,
        versionCount: 2,
        versionLimit: Infinity,
        versions: [currentVersion, comparedVersion],
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should omit every action until the version is in the list', () => {
        expect(selectComparisonBannerActions(getActions(), 'missing')).toEqual({});
    });

    test('should offer download, make current, and delete for an older version the row can act on', async () => {
        const selected = selectComparisonBannerActions(getActions(), '456');

        expect(selected.onDownload).toEqual(expect.any(Function));
        expect(selected.onMakeCurrent).toEqual(expect.any(Function));
        expect(selected.onDelete).toEqual(expect.any(Function));

        await selected.onDownload();
        await selected.onMakeCurrent();
        await selected.onDelete();

        expect(handlers.download).toHaveBeenCalledWith('456');
        expect(handlers.promote).toHaveBeenCalledWith('456');
        expect(handlers.delete).toHaveBeenCalledWith('456');
    });

    test('should offer only download for the current version', () => {
        const selected = selectComparisonBannerActions(getActions(), '123');

        expect(selected.onDownload).toEqual(expect.any(Function));
        expect(selected.onMakeCurrent).toBeUndefined();
        expect(selected.onDelete).toBeUndefined();
    });

    test('should omit an action the version permissions do not allow', () => {
        const version = {
            ...comparedVersion,
            is_download_available: false,
            permissions: { can_delete: false, can_download: true, can_upload: false },
        };
        const selected = selectComparisonBannerActions(getActions({ versions: [currentVersion, version] }), '456');

        expect(selected).toEqual({});
    });

    test('should omit download, make current, and delete for a deleted version', () => {
        const version = { ...comparedVersion, trashed_at: '2019-04-01T00:00:00Z' };
        const selected = selectComparisonBannerActions(getActions({ versions: [currentVersion, version] }), '456');

        expect(selected).toEqual({});
    });

    test('should omit make current and delete when the file is archived', () => {
        const selected = selectComparisonBannerActions(getActions({ isArchived: true }), '456');

        expect(selected.onDownload).toEqual(expect.any(Function));
        expect(selected.onMakeCurrent).toBeUndefined();
        expect(selected.onDelete).toBeUndefined();
    });

    test('should omit delete when the version is retained', () => {
        const version = {
            ...comparedVersion,
            retention: { applied_at: '2019-01-01T00:00:00Z' },
        };
        const selected = selectComparisonBannerActions(getActions({ versions: [currentVersion, version] }), '456');

        expect(selected.onDownload).toEqual(expect.any(Function));
        expect(selected.onMakeCurrent).toEqual(expect.any(Function));
        expect(selected.onDelete).toBeUndefined();
    });

    test('should omit every action when the version is past the version limit', () => {
        const version = { ...comparedVersion, version_number: '1' };
        const selected = selectComparisonBannerActions(
            getActions({
                versionCount: 10,
                versionLimit: 5,
                versions: [currentVersion, version],
            }),
            '456',
        );

        expect(selected).toEqual({});
    });
});

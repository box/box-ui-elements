import getVersionEntries from '../getVersionEntries';

describe('elements/content-sidebar/versions/getVersionEntries', () => {
    const fullPermissions = { can_delete: true, can_download: true, can_preview: true, can_upload: true };
    const makeVersion = (overrides = {}) => ({
        created_at: '2026-08-22T11:33:00Z',
        extension: 'pdf',
        id: '3',
        is_download_available: true,
        modified_by: { id: '10', name: 'Emily Huang' },
        permissions: fullPermissions,
        version_number: '3',
        ...overrides,
    });

    const getEntries = (versions, options = {}) =>
        getVersionEntries({
            authorFallbackName: 'Unknown',
            fileRequestName: 'File Request (localized)',
            versionCount: versions.length,
            versionLimit: Infinity,
            versions,
            ...options,
        });

    test('should map the basic fields and mark the first version as current', () => {
        const [current, older] = getEntries([
            makeVersion({ id: '3', version_number: '3' }),
            makeVersion({ id: '2', version_number: '2', created_at: '2026-08-21T10:00:00Z' }),
        ]);

        expect(current).toMatchObject({
            authorName: 'Emily Huang',
            id: '3',
            isCurrent: true,
            timestamp: '2026-08-22T11:33:00Z',
            versionNumber: 3,
        });
        expect(older).toMatchObject({ id: '2', isCurrent: false, versionNumber: 2 });
    });

    test('should only allow previewing and downloading the current version', () => {
        const [{ capabilities }] = getEntries([makeVersion()]);

        expect(capabilities).toMatchObject({
            canDelete: false,
            canDownload: true,
            canPreview: true,
            canPromote: false,
            canRestore: false,
        });
    });

    test('should allow every action on an older version with full permissions', () => {
        const [, { capabilities }] = getEntries([makeVersion({ id: '3' }), makeVersion({ id: '2' })]);

        expect(capabilities).toMatchObject({
            canDelete: true,
            canDownload: true,
            canPreview: true,
            canPromote: true,
            canRestore: false,
        });
    });

    test('should derive the timestamp from restored_at or trashed_at before created_at', () => {
        const [restored, trashed] = getEntries([
            makeVersion({ id: '3', restored_at: '2026-08-23T09:00:00Z' }),
            makeVersion({ id: '2', trashed_at: '2026-08-22T09:00:00Z' }),
        ]);

        expect(restored.timestamp).toBe('2026-08-23T09:00:00Z');
        expect(trashed.timestamp).toBe('2026-08-22T09:00:00Z');
    });

    test('should only offer restore for deleted versions, and block preview, download and promote', () => {
        const [, { capabilities }] = getEntries([
            makeVersion({ id: '3' }),
            makeVersion({ id: '2', trashed_at: '2026-08-22T09:00:00Z' }),
        ]);

        expect(capabilities).toMatchObject({
            canDelete: false,
            canDownload: false,
            canPreview: false,
            canPromote: false,
            canRestore: true,
        });
    });

    test('should not offer delete, promote or restore for archived files', () => {
        const [, { capabilities }] = getEntries(
            [makeVersion({ id: '3' }), makeVersion({ id: '2', trashed_at: '2026-08-22T09:00:00Z' })],
            { isArchived: true },
        );

        expect(capabilities).toMatchObject({ canDelete: false, canPromote: false, canRestore: false });
    });

    test.each([
        ['an office version', { isWatermarked: false }, { extension: 'xlsx' }],
        ['a watermarked file', { isWatermarked: true }, {}],
    ])('should block previewing an older version of %s but not the current one', (_, options, overrides) => {
        const [current, older] = getEntries(
            [makeVersion({ id: '3', ...overrides }), makeVersion({ id: '2', ...overrides })],
            options,
        );

        expect(current.capabilities.canPreview).toBe(true);
        expect(older.capabilities.canPreview).toBe(false);
    });

    test('should leave versions over the version limit without any action', () => {
        const [, limited] = getEntries(
            [makeVersion({ id: '3', version_number: '3' }), makeVersion({ id: '1', version_number: '1' })],
            {
                versionCount: 3,
                versionLimit: 1,
            },
        );

        expect(limited.capabilities).toEqual({ canPreview: false });
    });

    test('should keep delete visible but disabled while a retention policy applies', () => {
        const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const [, retained, expired] = getEntries([
            makeVersion({ id: '4' }),
            makeVersion({ id: '3', retention: { applied_at: '2026-01-01T00:00:00Z', disposition_at: future } }),
            makeVersion({
                id: '2',
                retention: { applied_at: '2025-01-01T00:00:00Z', disposition_at: '2025-06-01T00:00:00Z' },
            }),
        ]);

        expect(retained.capabilities).toMatchObject({ canDelete: true, isDeleteDisabled: true });
        expect(expired.capabilities).toMatchObject({ canDelete: true, isDeleteDisabled: false });
    });

    test('should offer compare only when requested, on previewable non-current versions', () => {
        const versions = [makeVersion({ id: '3' }), makeVersion({ id: '2' })];

        expect(getEntries(versions).map(({ capabilities }) => capabilities.canCompare)).toEqual([false, false]);
        expect(getEntries(versions, { canCompare: true }).map(({ capabilities }) => capabilities.canCompare)).toEqual([
            false,
            true,
        ]);
    });

    test('should fall back to the placeholder name and localize the File Request service user', () => {
        const [anonymous, fileRequest] = getEntries([
            makeVersion({ id: '3', modified_by: { id: '2', name: '' }, uploader_display_name: undefined }),
            makeVersion({ id: '2', modified_by: { id: '10', name: 'File Request' } }),
        ]);

        expect(anonymous.authorName).toBe('Unknown');
        expect(fileRequest.authorName).toBe('File Request (localized)');
    });
});

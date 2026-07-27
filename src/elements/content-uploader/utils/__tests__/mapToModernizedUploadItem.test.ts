import {
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
    STATUS_CANCELED,
} from '../../../../constants';
import { mapToModernizedUploadItem, mapToModernizedUploadItems } from '../mapToModernizedUploadItem';

const buildLegacyItem = (overrides = {}) => ({
    name: 'foo.pdf',
    extension: 'pdf',
    progress: 50,
    status: STATUS_IN_PROGRESS,
    size: 100,
    file: { name: 'foo.pdf' } as File,
    api: {} as never,
    ...overrides,
});

describe('mapToModernizedUploadItem()', () => {
    test('maps core fields', () => {
        const result = mapToModernizedUploadItem(buildLegacyItem(), '0', true);
        expect(result).toEqual({
            id: 'foo.pdf',
            name: 'foo.pdf',
            extension: 'pdf',
            progress: 50,
            status: 'uploading',
            isFolder: undefined,
            errorMessage: undefined,
            versionNumber: undefined,
            bytesUploaded: undefined,
            totalBytes: 100,
            remainingMs: undefined,
        });
    });

    test('omits byte progress and ETA fields when the treatment is off (kill switch)', () => {
        const result = mapToModernizedUploadItem(
            buildLegacyItem({ bytesUploaded: 40, totalBytes: 100, remainingMs: 12000 }),
            '0',
        );
        expect(result.bytesUploaded).toBeUndefined();
        expect(result.totalBytes).toBeUndefined();
        expect(result.remainingMs).toBeUndefined();
    });

    test('forwards byte progress and ETA fields', () => {
        const result = mapToModernizedUploadItem(
            buildLegacyItem({ bytesUploaded: 40, totalBytes: 100, remainingMs: 12000 }),
            '0',
            true,
        );
        expect(result.bytesUploaded).toBe(40);
        expect(result.totalBytes).toBe(100);
        expect(result.remainingMs).toBe(12000);
    });

    test('falls back to size for totalBytes before first progress event', () => {
        const result = mapToModernizedUploadItem(buildLegacyItem({ totalBytes: undefined, size: 2048 }), '0', true);
        expect(result.totalBytes).toBe(2048);
    });

    test.each([STATUS_STAGED, STATUS_COMPLETE])(
        'reports full bytesUploaded once the item is %s (progress events stop before hitting the total)',
        status => {
            const result = mapToModernizedUploadItem(
                buildLegacyItem({ status, bytesUploaded: 259, totalBytes: 260 }),
                '0',
                true,
            );
            expect(result.bytesUploaded).toBe(260);
            expect(result.totalBytes).toBe(260);
        },
    );

    test('does not inflate bytesUploaded while still uploading', () => {
        const result = mapToModernizedUploadItem(
            buildLegacyItem({ status: STATUS_IN_PROGRESS, bytesUploaded: 259, totalBytes: 260 }),
            '0',
            true,
        );
        expect(result.bytesUploaded).toBe(259);
    });

    test.each([STATUS_STAGED, STATUS_COMPLETE])(
        'drops the ETA once the item is %s (the smoothed estimate lags and looks stale)',
        status => {
            const result = mapToModernizedUploadItem(
                buildLegacyItem({ status, bytesUploaded: 260, totalBytes: 260, remainingMs: 3000 }),
                '0',
                true,
            );
            expect(result.remainingMs).toBeUndefined();
        },
    );

    test('still forwards the ETA while uploading', () => {
        const result = mapToModernizedUploadItem(
            buildLegacyItem({ status: STATUS_IN_PROGRESS, remainingMs: 3000 }),
            '0',
            true,
        );
        expect(result.remainingMs).toBe(3000);
    });

    test.each([
        [STATUS_PENDING, 'pending'],
        [STATUS_IN_PROGRESS, 'uploading'],
        [STATUS_STAGED, 'staged'],
        [STATUS_COMPLETE, 'complete'],
        [STATUS_ERROR, 'error'],
        [STATUS_CANCELED, 'canceled'],
    ])('maps legacy status %s to modernized %s', (legacy, modernized) => {
        const result = mapToModernizedUploadItem(buildLegacyItem({ status: legacy }), '0');
        expect(result.status).toBe(modernized);
    });

    test('extracts errorMessage from item.error', () => {
        const result = mapToModernizedUploadItem(
            buildLegacyItem({ status: STATUS_ERROR, error: { message: 'Boom' } }),
            '0',
        );
        expect(result.errorMessage).toBe('Boom');
    });

    test('forwards isFolder', () => {
        const result = mapToModernizedUploadItem(buildLegacyItem({ isFolder: true }), '0');
        expect(result.isFolder).toBe(true);
    });

    test('omits byte progress and ETA fields for folders even when the treatment is on', () => {
        const result = mapToModernizedUploadItem(
            buildLegacyItem({ isFolder: true, size: 1, bytesUploaded: 0, remainingMs: 12000 }),
            '0',
            true,
        );
        expect(result.bytesUploaded).toBeUndefined();
        expect(result.totalBytes).toBeUndefined();
        expect(result.remainingMs).toBeUndefined();
    });

    test('defaults missing extension and progress', () => {
        const result = mapToModernizedUploadItem(buildLegacyItem({ extension: undefined, progress: undefined }), '0');
        expect(result.extension).toBe('');
        expect(result.progress).toBe(0);
    });

    test('forwards versionNumber from item.boxFile.version_number', () => {
        const result = mapToModernizedUploadItem(
            buildLegacyItem({
                status: STATUS_COMPLETE,
                boxFile: { version_number: '2' },
            }),
            '0',
        );
        expect(result.versionNumber).toBe('2');
    });

    test('leaves versionNumber undefined when boxFile is missing', () => {
        const result = mapToModernizedUploadItem(buildLegacyItem({ status: STATUS_IN_PROGRESS }), '0');
        expect(result.versionNumber).toBeUndefined();
    });
});

describe('mapToModernizedUploadItems()', () => {
    test('maps a list', () => {
        const result = mapToModernizedUploadItems(
            [
                buildLegacyItem({ name: 'a.pdf', file: { name: 'a.pdf' } as File }),
                buildLegacyItem({ name: 'b.pdf', file: { name: 'b.pdf' } as File }),
            ],
            '0',
        );
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('a.pdf');
        expect(result[1].id).toBe('b.pdf');
    });

    test('does not crash when item has no file (folder item)', () => {
        const folderItem = {
            name: 'my-folder',
            extension: '',
            progress: 0,
            status: STATUS_PENDING,
            size: 1,
            isFolder: true,
            api: {} as never,
        } as never;

        expect(() => mapToModernizedUploadItems([folderItem], '0')).not.toThrow();
    });

    test('produces stable id for folder item without options', () => {
        const folderItem = {
            name: 'my-folder',
            extension: '',
            progress: 0,
            status: STATUS_PENDING,
            size: 1,
            isFolder: true,
            api: {} as never,
        } as never;

        const result = mapToModernizedUploadItems([folderItem], '0');
        expect(result[0].id).toBe('my-folder_0');
    });

    test('produces distinct ids for folder items with different folderId options', () => {
        const folderA = {
            name: 'shared',
            extension: '',
            progress: 0,
            status: STATUS_PENDING,
            size: 1,
            isFolder: true,
            options: { folderId: '111' },
            api: {} as never,
        } as never;
        const folderB = {
            name: 'shared',
            extension: '',
            progress: 0,
            status: STATUS_PENDING,
            size: 1,
            isFolder: true,
            options: { folderId: '222' },
            api: {} as never,
        } as never;

        const result = mapToModernizedUploadItems([folderA, folderB], '0');
        expect(result[0].id).not.toBe(result[1].id);
    });

    test('forwards the ETA treatment flag to each item', () => {
        const item = buildLegacyItem({ bytesUploaded: 40, totalBytes: 100, remainingMs: 12000 });

        const disabled = mapToModernizedUploadItems([item], '0');
        expect(disabled[0].bytesUploaded).toBeUndefined();
        expect(disabled[0].remainingMs).toBeUndefined();

        const enabled = mapToModernizedUploadItems([item], '0', true);
        expect(enabled[0].bytesUploaded).toBe(40);
        expect(enabled[0].remainingMs).toBe(12000);
    });
});

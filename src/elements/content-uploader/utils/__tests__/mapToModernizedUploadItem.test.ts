import {
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
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
        const result = mapToModernizedUploadItem(buildLegacyItem(), '0');
        expect(result).toEqual({
            id: 'foo.pdf',
            name: 'foo.pdf',
            extension: 'pdf',
            progress: 50,
            status: 'uploading',
            isFolder: undefined,
            errorMessage: undefined,
        });
    });

    test.each([
        [STATUS_PENDING, 'pending'],
        [STATUS_IN_PROGRESS, 'uploading'],
        [STATUS_STAGED, 'staged'],
        [STATUS_COMPLETE, 'complete'],
        [STATUS_ERROR, 'error'],
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

    test('defaults missing extension and progress', () => {
        const result = mapToModernizedUploadItem(
            buildLegacyItem({ extension: undefined, progress: undefined }),
            '0',
        );
        expect(result.extension).toBe('');
        expect(result.progress).toBe(0);
    });
});

describe('mapToModernizedUploadItems()', () => {
    test('maps a list', () => {
        const result = mapToModernizedUploadItems(
            [buildLegacyItem({ name: 'a.pdf', file: { name: 'a.pdf' } as File }), buildLegacyItem({ name: 'b.pdf', file: { name: 'b.pdf' } as File })],
            '0',
        );
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('a.pdf');
        expect(result[1].id).toBe('b.pdf');
    });
});

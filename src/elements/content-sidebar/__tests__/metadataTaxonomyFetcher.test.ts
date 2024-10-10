import type { PaginationQueryInput } from '@box/metadata-editor';
import { metadataTaxonomyFetcher } from '../fetchers/metadataTaxonomyFetcher';
import type API from '../../../api';

describe('metadataTaxonomyFetcher', () => {
    let apiMock: jest.Mocked<API>;
    const fileId = '12345';
    const scope = 'global';
    const templateKey = 'template_123';
    const fieldKey = 'field_abc';
    const level = 1;
    const options: PaginationQueryInput = { marker: 'marker_1' };

    beforeEach(() => {
        apiMock = {
            getMetadataAPI: jest.fn().mockReturnValue({
                getMetadataOptions: jest.fn(),
            }),
        };
    });

    test('should fetch metadata options and return formatted data', async () => {
        const mockMetadataOptions = {
            entries: [
                { id: 'opt1', display_name: 'Option 1' },
                { id: 'opt2', display_name: 'Option 2' },
            ],
        };

        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options);

        const expectedResult = {
            options: [
                { value: 'opt1', displayValue: 'Option 1' },
                { value: 'opt2', displayValue: 'Option 2' },
            ],
            marker: 'marker_1',
        };

        expect(apiMock.getMetadataAPI).toHaveBeenCalledWith(false);
        expect(apiMock.getMetadataAPI(false).getMetadataOptions).toHaveBeenCalledWith(
            fileId,
            scope,
            templateKey,
            fieldKey,
            level,
            options,
        );
        expect(result).toEqual(expectedResult);
    });

    test('should handle empty entries array', async () => {
        const mockMetadataOptions = {
            entries: [],
        };

        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options);

        const expectedResult = {
            options: [],
            marker: 'marker_1',
        };

        expect(result).toEqual(expectedResult);
    });

    test('should set marker to null if not provided in options', async () => {
        const mockMetadataOptions = {
            entries: [{ id: 'opt1', display_name: 'Option 1' }],
        };

        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, {});

        const expectedResult = {
            options: [{ value: 'opt1', displayValue: 'Option 1' }],
            marker: null,
        };

        expect(result).toEqual(expectedResult);
    });

    test('should throw an error if getMetadataOptions fails', async () => {
        const error = new Error('API Error');
        apiMock.getMetadataAPI(false).getMetadataOptions.mockRejectedValue(error);

        await expect(
            metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options),
        ).rejects.toThrow('API Error');
    });
});

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
        // Create a mocked API instance
        apiMock = {
            getMetadataAPI: jest.fn().mockReturnValue({
                getMetadataOptions: jest.fn(),
            }),
        };
    });

    test('should fetch metadata options and return formatted data', async () => {
        // Mock data returned by getMetadataOptions
        const mockMetadataOptions = {
            entries: [
                { id: 'opt1', display_name: 'Option 1' },
                { id: 'opt2', display_name: 'Option 2' },
            ],
        };

        // Mock the getMetadataOptions method to return mock data
        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        // Call the function under test
        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options);

        // Expected output
        const expectedResult = {
            options: [
                { value: 'opt1', displayValue: 'Option 1' },
                { value: 'opt2', displayValue: 'Option 2' },
            ],
            marker: 'marker_1',
        };

        // Assertions
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
        // Mock data with empty entries
        const mockMetadataOptions = {
            entries: [],
        };

        // Mock the getMetadataOptions method to return mock data
        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        // Call the function under test
        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options);

        // Expected output
        const expectedResult = {
            options: [],
            marker: 'marker_1',
        };

        // Assertions
        expect(result).toEqual(expectedResult);
    });

    test('should set marker to null if not provided in options', async () => {
        // Mock data returned by getMetadataOptions
        const mockMetadataOptions = {
            entries: [{ id: 'opt1', display_name: 'Option 1' }],
        };

        // Mock the getMetadataOptions method to return mock data
        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        // Call the function under test with options without marker
        const result = await metadataTaxonomyFetcher(
            apiMock,
            fileId,
            scope,
            templateKey,
            fieldKey,
            level,
            {}, // options without marker
        );

        // Expected output
        const expectedResult = {
            options: [{ value: 'opt1', displayValue: 'Option 1' }],
            marker: null,
        };

        // Assertions
        expect(result).toEqual(expectedResult);
    });

    test('should throw an error if getMetadataOptions fails', async () => {
        // Mock the getMetadataOptions method to throw an error
        const error = new Error('API Error');
        apiMock.getMetadataAPI(false).getMetadataOptions.mockRejectedValue(error);

        // Assertions
        await expect(
            metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options),
        ).rejects.toThrow('API Error');
    });
});

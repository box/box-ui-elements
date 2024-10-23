import type { PaginationQueryInput } from '@box/metadata-editor';
import { metadataTaxonomyFetcher, metadataTaxonomyNodeFetcher } from '../fetchers/metadataTaxonomyFetcher';
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
                { id: 'opt1', displayName: 'Option 1' },
                { id: 'opt2', displayName: 'Option 2' },
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
            entries: [{ id: 'opt1', displayName: 'Option 1' }],
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

describe('metadataNodeTaxonomiesFetcher', () => {
    const scope = 'global';
    const taxonomyKey = 'taxonomy_123';
    const nodeID = 'node_abc';

    let apiMock: jest.Mocked<API>;

    beforeEach(() => {
        apiMock = {
            getMetadataAPI: jest.fn().mockReturnValue({
                getMetadataTaxonomyLevels: jest.fn(),
                getMetadataTaxonomyNode: jest.fn(),
            }),
        };
    });

    test('should fetch taxonomy levels and node data and return formatted data', async () => {
        const mockTaxonomyLevels = [
            { level: 1, displayName: 'Level 1', description: 'Description 1' },
            { level: 2, displayName: 'Level 2', description: 'Description 2' },
        ];

        const mockTaxonomyNode = {
            id: 'node_abc',
            level: 1,
            displayName: 'Node ABC',
            ancestors: [{ id: 'ancestor_1', level: 2, displayName: 'Ancestor 1' }],
        };

        apiMock.getMetadataAPI(false).getMetadataTaxonomyLevels.mockResolvedValue(mockTaxonomyLevels);
        apiMock.getMetadataAPI(false).getMetadataTaxonomyNode.mockResolvedValue(mockTaxonomyNode);

        const result = await metadataTaxonomyNodeFetcher(apiMock, scope, taxonomyKey, nodeID);

        const expectedResult = [
            {
                level: 1,
                levelName: 'Level 1',
                description: 'Description 1',
                id: 'node_abc',
                levelValue: 'Node ABC',
            },
            {
                level: 2,
                levelName: 'Level 2',
                description: 'Description 2',
                id: 'ancestor_1',
                levelValue: 'Ancestor 1',
            },
        ];

        expect(apiMock.getMetadataAPI).toHaveBeenCalledWith(false);
        expect(apiMock.getMetadataAPI(false).getMetadataTaxonomyLevels).toHaveBeenCalledWith(scope, taxonomyKey);
        expect(apiMock.getMetadataAPI(false).getMetadataTaxonomyNode).toHaveBeenCalledWith(
            scope,
            taxonomyKey,
            nodeID,
            true,
        );
        expect(result).toEqual(expectedResult);
    });

    test('should handle empty ancestors array', async () => {
        const mockTaxonomyLevels = [{ level: 1, displayName: 'Level 1', description: 'Description 1' }];

        const mockTaxonomyNode = {
            id: 'node_abc',
            level: 1,
            displayName: 'Node ABC',
            ancestors: [],
        };

        apiMock.getMetadataAPI(false).getMetadataTaxonomyLevels.mockResolvedValue(mockTaxonomyLevels);
        apiMock.getMetadataAPI(false).getMetadataTaxonomyNode.mockResolvedValue(mockTaxonomyNode);

        const result = await metadataTaxonomyNodeFetcher(apiMock, scope, taxonomyKey, nodeID);

        const expectedResult = [
            {
                level: 1,
                levelName: 'Level 1',
                description: 'Description 1',
                id: 'node_abc',
                levelValue: 'Node ABC',
            },
        ];

        expect(result).toEqual(expectedResult);
    });

    test('should throw an error if getMetadataTaxonomyLevels fails', async () => {
        const error = new Error('API Error');
        apiMock.getMetadataAPI(false).getMetadataTaxonomyLevels.mockRejectedValue(error);

        await expect(metadataTaxonomyNodeFetcher(apiMock, scope, taxonomyKey, nodeID)).rejects.toThrow('API Error');
    });

    test('should throw an error if getMetadataTaxonomyNode fails', async () => {
        const error = new Error('API Error');
        apiMock.getMetadataAPI(false).getMetadataTaxonomyNode.mockRejectedValue(error);

        await expect(metadataTaxonomyNodeFetcher(apiMock, scope, taxonomyKey, nodeID)).rejects.toThrow('API Error');
    });
});

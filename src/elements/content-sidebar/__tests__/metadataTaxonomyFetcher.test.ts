import type { PaginationQueryInput } from '@box/metadata-editor';
import type { Level } from '@box/combobox-with-api';
import {
    createTaxonomyItemsService,
    metadataTaxonomyFetcher,
    metadataTaxonomyNodeAncestorsFetcher,
    type TaxonomyFieldConfig,
} from '../fetchers/metadataTaxonomyFetcher';
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

    test('should fetch metadata options and return formatted data - new naming convention', async () => {
        const mockMetadataOptions = {
            entries: [
                {
                    id: 'opt1',
                    display_name: 'Option 1',
                    level: '1',
                    parentId: 'parent1',
                    nodePath: ['node1', 'node2'],
                    deprecated: false,
                    ancestors: null,
                    selectable: false,
                },
                {
                    id: 'opt2',
                    display_name: 'Option 2',
                    level: '2',
                    parentId: 'parent2',
                    nodePath: ['node1', 'node3'],
                    deprecated: true,
                    ancestors: [{ display_name: 'Option 1', foo: 'bar' }],
                    selectable: true,
                },
            ],
            limit: 100,
            total_result_count: 2,
        };

        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options);

        const expectedResult = {
            options: [
                {
                    value: 'opt1',
                    displayValue: 'Option 1',
                    level: '1',
                    parentId: 'parent1',
                    nodePath: ['node1', 'node2'],
                    deprecated: false,
                    ancestors: undefined,
                    selectable: false,
                },
                {
                    value: 'opt2',
                    displayValue: 'Option 2',
                    level: '2',
                    parentId: 'parent2',
                    nodePath: ['node1', 'node3'],
                    deprecated: true,
                    ancestors: [{ displayName: 'Option 1', foo: 'bar' }],
                    selectable: true,
                },
            ],
            marker: 'marker_1',
            totalResultCount: 2,
            limit: 100,
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

    test('should fetch metadata options and return formatted data - old naming convention', async () => {
        const mockMetadataOptions = {
            entries: [
                {
                    id: 'opt1',
                    displayName: 'Option 1',
                    level: '1',
                    parentId: 'parent1',
                    nodePath: ['node1', 'node2'],
                    deprecated: false,
                    ancestors: null,
                    selectable: false,
                },
                {
                    id: 'opt2',
                    displayName: 'Option 2',
                    level: '2',
                    parentId: 'parent2',
                    nodePath: ['node1', 'node3'],
                    deprecated: true,
                    ancestors: [{ displayName: 'Option 1', foo: 'bar' }],
                    selectable: true,
                },
            ],
            limit: 50,
            total_result_count: 15,
        };

        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options);

        const expectedResult = {
            options: [
                {
                    value: 'opt1',
                    displayValue: 'Option 1',
                    level: '1',
                    parentId: 'parent1',
                    nodePath: ['node1', 'node2'],
                    deprecated: false,
                    ancestors: undefined,
                    selectable: false,
                },
                {
                    value: 'opt2',
                    displayValue: 'Option 2',
                    level: '2',
                    parentId: 'parent2',
                    nodePath: ['node1', 'node3'],
                    deprecated: true,
                    ancestors: [{ displayName: 'Option 1', foo: 'bar' }],
                    selectable: true,
                },
            ],
            marker: 'marker_1',
            totalResultCount: 15,
            limit: 50,
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

    test('should not include limit and totalResultCount when not provided in metadataOptions', async () => {
        const mockMetadataOptions = {
            entries: [
                {
                    id: 'opt1',
                    display_name: 'Option 1',
                    level: '1',
                    parentId: 'parent1',
                },
            ],
        };

        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options);

        expect(result).toEqual({
            options: [
                {
                    value: 'opt1',
                    displayValue: 'Option 1',
                    level: '1',
                    parentId: 'parent1',
                    nodePath: undefined,
                    deprecated: undefined,
                    ancestors: undefined,
                    selectable: undefined,
                },
            ],
            marker: 'marker_1',
        });

        expect(result).not.toHaveProperty('limit');
        expect(result).not.toHaveProperty('totalResultCount');
    });

    test('should set marker to null if not provided in options', async () => {
        const mockMetadataOptions = {
            entries: [
                {
                    id: 'opt1',
                    display_name: 'Option 1',
                    parentId: undefined,
                    nodePath: undefined,
                    deprecated: undefined,
                },
            ],
        };

        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, {});

        const expectedResult = {
            options: [
                {
                    value: 'opt1',
                    displayValue: 'Option 1',
                    parentId: undefined,
                    nodePath: undefined,
                    deprecated: undefined,
                },
            ],
            marker: null,
        };

        expect(result).toEqual(expectedResult);
    });

    test('should handle missing new fields for backward compatibility', async () => {
        const mockMetadataOptions = {
            entries: [
                {
                    id: 'opt1',
                    display_name: 'Option 1',
                    level: '1',
                    ancestors: null,
                    selectable: false,
                },
            ],
        };

        apiMock.getMetadataAPI(false).getMetadataOptions.mockResolvedValue(mockMetadataOptions);

        const result = await metadataTaxonomyFetcher(apiMock, fileId, scope, templateKey, fieldKey, level, options);

        const expectedResult = {
            options: [
                {
                    value: 'opt1',
                    displayValue: 'Option 1',
                    level: '1',
                    parentId: undefined,
                    nodePath: undefined,
                    deprecated: undefined,
                    ancestors: undefined,
                    selectable: false,
                },
            ],
            marker: 'marker_1',
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

// The backend `taxonomy-node` endpoint is migrating from snake_case (`display_name`) to
// camelCase (`displayName`). Until the migration completes we validate both response shapes
// side-by-side; delete this "(old keys naming convention)" block once the snake_case
// response is fully retired.
describe('metadataTaxonomyNodeAncestorsFetcher (old keys naming convention)', () => {
    const fileID = '12345';
    const scope = 'global';
    const taxonomyKey = 'taxonomy_123';
    const nodeID = 'node_abc';

    let apiMock: jest.Mocked<API>;

    beforeEach(() => {
        apiMock = {
            getMetadataAPI: jest.fn().mockReturnValue({
                getMetadataTaxonomy: jest.fn(),
                getMetadataTaxonomyNode: jest.fn(),
            }),
        };
    });

    test('should fetch taxonomy and node data and return formatted data', async () => {
        const mockTaxonomy = {
            display_name: 'Geography',
            namespace: 'my_enterprise',
            id: 'my_id',
            key: 'geography',
            levels: [
                { level: 1, display_name: 'Level 1', description: 'Description 1' },
                { level: 2, display_name: 'Level 2', description: 'Description 2' },
                { level: 3, display_name: 'Level 3', description: 'Description 3' },
            ],
        };

        const mockTaxonomyNode = {
            id: 'node_abc',
            level: 1,
            display_name: 'Node ABC',
            ancestors: [{ id: 'ancestor_1', level: 2, display_name: 'Ancestor 1' }],
        };

        apiMock.getMetadataAPI(false).getMetadataTaxonomy.mockResolvedValue(mockTaxonomy);
        apiMock.getMetadataAPI(false).getMetadataTaxonomyNode.mockResolvedValue(mockTaxonomyNode);

        const result = await metadataTaxonomyNodeAncestorsFetcher(apiMock, fileID, scope, taxonomyKey, nodeID);

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
        expect(apiMock.getMetadataAPI(false).getMetadataTaxonomy).toHaveBeenCalledWith(fileID, scope, taxonomyKey);
        expect(apiMock.getMetadataAPI(false).getMetadataTaxonomyNode).toHaveBeenCalledWith(
            fileID,
            scope,
            taxonomyKey,
            nodeID,
            true,
        );
        expect(result).toEqual(expectedResult);
    });

    test('should handle empty ancestors array', async () => {
        const mockTaxonomy = {
            display_name: 'Geography',
            namespace: 'my_enterprise',
            id: 'my_id',
            key: 'geography',
            levels: [{ level: 1, display_name: 'Level 1', description: 'Description 1' }],
        };

        const mockTaxonomyNode = {
            id: 'node_abc',
            level: 1,
            display_name: 'Node ABC',
            ancestors: [],
        };

        apiMock.getMetadataAPI(false).getMetadataTaxonomy.mockResolvedValue(mockTaxonomy);
        apiMock.getMetadataAPI(false).getMetadataTaxonomyNode.mockResolvedValue(mockTaxonomyNode);

        const result = await metadataTaxonomyNodeAncestorsFetcher(apiMock, fileID, scope, taxonomyKey, nodeID);

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
});

describe('metadataTaxonomyNodeAncestorsFetcher (new keys naming convention)', () => {
    const fileID = '12345';
    const scope = 'global';
    const taxonomyKey = 'taxonomy_123';
    const nodeID = 'node_abc';

    let apiMock: jest.Mocked<API>;

    beforeEach(() => {
        apiMock = {
            getMetadataAPI: jest.fn().mockReturnValue({
                getMetadataTaxonomy: jest.fn(),
                getMetadataTaxonomyNode: jest.fn(),
            }),
        };
    });

    test('should fetch taxonomy and node data and return formatted data', async () => {
        const mockTaxonomy = {
            displayName: 'Geography',
            namespace: 'my_enterprise',
            id: 'my_id',
            key: 'geography',
            levels: [
                { level: 1, displayName: 'Level 1', description: 'Description 1' },
                { level: 2, displayName: 'Level 2', description: 'Description 2' },
                { level: 3, displayName: 'Level 3', description: 'Description 3' },
            ],
        };

        const mockTaxonomyNode = {
            id: 'node_abc',
            level: 1,
            displayName: 'Node ABC',
            ancestors: [{ id: 'ancestor_1', level: 2, displayName: 'Ancestor 1' }],
        };

        apiMock.getMetadataAPI(false).getMetadataTaxonomy.mockResolvedValue(mockTaxonomy);
        apiMock.getMetadataAPI(false).getMetadataTaxonomyNode.mockResolvedValue(mockTaxonomyNode);

        const result = await metadataTaxonomyNodeAncestorsFetcher(apiMock, fileID, scope, taxonomyKey, nodeID);

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
        expect(apiMock.getMetadataAPI(false).getMetadataTaxonomy).toHaveBeenCalledWith(fileID, scope, taxonomyKey);
        expect(apiMock.getMetadataAPI(false).getMetadataTaxonomyNode).toHaveBeenCalledWith(
            fileID,
            scope,
            taxonomyKey,
            nodeID,
            true,
        );
        expect(result).toEqual(expectedResult);
    });

    test('should handle empty ancestors array', async () => {
        const mockTaxonomy = {
            displayName: 'Geography',
            namespace: 'my_enterprise',
            id: 'my_id',
            key: 'geography',
            levels: [{ level: 1, displayName: 'Level 1', description: 'Description 1' }],
        };

        const mockTaxonomyNode = {
            id: 'node_abc',
            level: 1,
            displayName: 'Node ABC',
            ancestors: [],
        };

        apiMock.getMetadataAPI(false).getMetadataTaxonomy.mockResolvedValue(mockTaxonomy);
        apiMock.getMetadataAPI(false).getMetadataTaxonomyNode.mockResolvedValue(mockTaxonomyNode);

        const result = await metadataTaxonomyNodeAncestorsFetcher(apiMock, fileID, scope, taxonomyKey, nodeID);

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

    test('should throw an error if getMetadataTaxonomy fails', async () => {
        const error = new Error('API Error');
        apiMock.getMetadataAPI(false).getMetadataTaxonomy.mockRejectedValue(error);

        await expect(metadataTaxonomyNodeAncestorsFetcher(apiMock, fileID, scope, taxonomyKey, nodeID)).rejects.toThrow(
            'API Error',
        );
    });

    test('should throw an error if getMetadataTaxonomyNode fails', async () => {
        const error = new Error('API Error');
        apiMock.getMetadataAPI(false).getMetadataTaxonomyNode.mockRejectedValue(error);

        await expect(metadataTaxonomyNodeAncestorsFetcher(apiMock, fileID, scope, taxonomyKey, nodeID)).rejects.toThrow(
            'API Error',
        );
    });
});

describe('createTaxonomyItemsService', () => {
    const fileId = 'file_1';
    const scope = 'enterprise_1';
    const templateKey = 'myTaxonomy';
    const fieldKey = 'multiLevel';
    const identity = { scope, templateKey, fieldKey };
    const makeLevel = (level: number): Level => ({
        level,
        displayName: `Level ${level}`,
        description: `Level ${level}`,
    });
    const multiLevels: Level[] = [makeLevel(1), makeLevel(2), makeLevel(3), makeLevel(4)];
    const singleLevels: Level[] = [makeLevel(1)];
    // Multi-level picker mode: multiple selectable levels means the popover
    // drills from level 1 downward.
    const multiLevelResolver = (): TaxonomyFieldConfig => ({
        levels: multiLevels,
        selectableLevels: [1, 2, 3, 4],
    });
    // Single-level *taxonomy* (only one level of nodes exists at all).
    const singleLevelResolver = (): TaxonomyFieldConfig => ({
        levels: singleLevels,
        selectableLevels: [1],
    });
    // Single-level *picker mode* on a multi-level taxonomy: exactly one
    // selectable level (may be any level, not just level 1).
    const singleLevelPickerResolver =
        (targetLevel: number): (() => TaxonomyFieldConfig) =>
        () => ({
            levels: multiLevels,
            selectableLevels: [targetLevel],
        });

    let getMetadataOptions: jest.Mock;
    let apiMock: jest.Mocked<API>;

    beforeEach(() => {
        getMetadataOptions = jest.fn();
        apiMock = {
            getMetadataAPI: jest.fn().mockReturnValue({ getMetadataOptions }),
        } as unknown as jest.Mocked<API>;
    });

    const buildEntry = (overrides: Record<string, unknown> = {}) => ({
        id: 'node-1',
        display_name: 'Node 1',
        level: 1,
        selectable: false,
        ancestors: [],
        ...overrides,
    });

    test('scopes multi-level root browse to level 1 so the API does not flatten the tree', async () => {
        getMetadataOptions.mockResolvedValue({
            entries: [buildEntry({ id: 'root-a', display_name: 'Root A', level: 1 })],
            next_marker: null,
        });

        const service = createTaxonomyItemsService(apiMock, fileId, multiLevelResolver)(identity);
        const response = await service.getNodes(null, { limit: 100 });

        expect(getMetadataOptions).toHaveBeenCalledTimes(1);
        const [, , , , levelArg, optionsArg] = getMetadataOptions.mock.calls[0];
        expect(levelArg).toBe(1);
        expect(optionsArg).toMatchObject({ level: 1 });
        expect(optionsArg).not.toHaveProperty('ancestorId');

        expect(response.entries).toEqual([expect.objectContaining({ id: 'root-a', displayName: 'Root A', level: 1 })]);
    });

    test('scopes single-level taxonomy browse to the single selectable level', async () => {
        getMetadataOptions.mockResolvedValue({
            entries: [
                buildEntry({ id: 'blue', display_name: 'Blue', level: 1 }),
                buildEntry({ id: 'red', display_name: 'Red', level: 1 }),
            ],
            next_marker: null,
        });

        const service = createTaxonomyItemsService(apiMock, fileId, singleLevelResolver)(identity);
        const response = await service.getNodes(null, { limit: 100 });

        const optionsArg = getMetadataOptions.mock.calls[0][5];
        expect(optionsArg).toMatchObject({ level: 1 });
        expect(optionsArg).not.toHaveProperty('ancestorId');
        expect(response.entries).toHaveLength(2);
    });

    test('does not send a level filter when the field config is unknown (safe default)', async () => {
        getMetadataOptions.mockResolvedValue({ entries: [], next_marker: null });

        const service = createTaxonomyItemsService(apiMock, fileId)(identity);
        await service.getNodes(null, { limit: 100 });

        expect(getMetadataOptions.mock.calls[0][5]).not.toHaveProperty('level');
    });

    test('loads the exact selectable level when the picker is in single-level mode (deep level)', async () => {
        getMetadataOptions.mockResolvedValue({
            entries: [
                buildEntry({
                    id: 'leaf-a',
                    display_name: 'Leaf A',
                    level: 3,
                    selectable: true,
                    ancestors: [
                        { id: 'r1', display_name: 'Root 1', level: 1 },
                        { id: 'r2', display_name: 'Region 2', level: 2 },
                    ],
                }),
            ],
            next_marker: null,
        });

        const service = createTaxonomyItemsService(apiMock, fileId, singleLevelPickerResolver(3))(identity);
        const response = await service.getNodes(null, { limit: 100 });

        const [, , , , levelArg, optionsArg] = getMetadataOptions.mock.calls[0];
        expect(levelArg).toBe(3);
        expect(optionsArg).toMatchObject({ level: 3 });
        expect(optionsArg).not.toHaveProperty('ancestorId');
        expect(response.entries[0]).toEqual(expect.objectContaining({ id: 'leaf-a', level: 3, selectable: true }));
    });

    test('marks nodes as leaves (hasChildren: false) in single-level picker mode', async () => {
        // Level-3 nodes on a taxonomy that has 4 levels — normally we would
        // infer `hasChildren: true` here, but single-level picker mode should
        // suppress the drill-down chevron on every row.
        getMetadataOptions.mockResolvedValue({
            entries: [
                buildEntry({ id: 'leaf-a', level: 3, selectable: true }),
                // Even an explicit `has_children: true` from the backend is
                // overridden — the picker is in flat single-level mode.
                buildEntry({ id: 'leaf-b', level: 3, selectable: true, has_children: true }),
            ],
            next_marker: null,
        });

        const service = createTaxonomyItemsService(apiMock, fileId, singleLevelPickerResolver(3))(identity);
        const response = await service.getNodes(null, { limit: 100 });

        expect(response.entries).toEqual([
            expect.objectContaining({ id: 'leaf-a', hasChildren: false }),
            expect.objectContaining({ id: 'leaf-b', hasChildren: false }),
        ]);
    });

    test('marks single-level picker search results as leaves too', async () => {
        getMetadataOptions.mockResolvedValue({
            entries: [buildEntry({ id: 'leaf-a', level: 3, selectable: true, has_children: true })],
            next_marker: null,
        });

        const service = createTaxonomyItemsService(apiMock, fileId, singleLevelPickerResolver(3))(identity);
        const response = await service.searchNodes('leaf', { limit: 100, levelFilter: 3 });

        expect(response.entries[0]).toEqual(expect.objectContaining({ id: 'leaf-a', hasChildren: false }));
    });

    test('ignores drill-down requests in single-level picker mode and re-fetches the flat root list', async () => {
        getMetadataOptions.mockResolvedValue({ entries: [], next_marker: null });

        const service = createTaxonomyItemsService(apiMock, fileId, singleLevelPickerResolver(3))(identity);
        // Even if a caller somehow invokes getNodes with a parentId, the
        // service does not drill: the request stays scoped to the flat
        // selectable level with no ancestor filter.
        await service.getNodes('some-level-3-id', { limit: 100 });

        const optionsArg = getMetadataOptions.mock.calls[0][5];
        expect(optionsArg).toMatchObject({ level: 3 });
        expect(optionsArg).not.toHaveProperty('ancestorId');
    });

    test('walks multiple levels deep, requesting parentLevel + 1 with ancestor at each step', async () => {
        getMetadataOptions
            .mockResolvedValueOnce({
                entries: [buildEntry({ id: 'a', level: 1 })],
                next_marker: null,
            })
            .mockResolvedValueOnce({
                entries: [buildEntry({ id: 'b', level: 2 })],
                next_marker: null,
            })
            .mockResolvedValueOnce({
                entries: [buildEntry({ id: 'c', level: 3 })],
                next_marker: null,
            });

        const service = createTaxonomyItemsService(apiMock, fileId, multiLevelResolver)(identity);
        await service.getNodes(null, { limit: 100 });
        await service.getNodes('a', { limit: 100 });
        await service.getNodes('b', { limit: 100 });

        expect(getMetadataOptions.mock.calls[1][5]).toMatchObject({ level: 2, ancestorId: 'a' });
        expect(getMetadataOptions.mock.calls[2][5]).toMatchObject({ level: 3, ancestorId: 'b' });
    });

    test('forwards pagination markers on browse', async () => {
        getMetadataOptions.mockResolvedValue({ entries: [], next_marker: 'next-page' });

        const service = createTaxonomyItemsService(apiMock, fileId, multiLevelResolver)(identity);
        const response = await service.getNodes(null, { limit: 100, marker: 'page-2' });

        expect(getMetadataOptions.mock.calls[0][5]).toMatchObject({ marker: 'page-2', level: 1 });
        expect(response.next_marker).toBe('next-page');
    });

    test('uses ancestor levels returned from search to scope subsequent drill-down', async () => {
        getMetadataOptions
            .mockResolvedValueOnce({
                entries: [
                    buildEntry({
                        id: 'deep-node',
                        display_name: 'Deep Node',
                        level: 4,
                        ancestors: [
                            { id: 'root-a', display_name: 'Root A', level: 1 },
                            { id: 'mid-b', display_name: 'Mid B', level: 3 },
                        ],
                    }),
                ],
                next_marker: null,
            })
            .mockResolvedValueOnce({
                entries: [buildEntry({ id: 'child-of-mid', level: 4 })],
                next_marker: null,
            });

        const service = createTaxonomyItemsService(apiMock, fileId, multiLevelResolver)(identity);
        await service.searchNodes('deep', { limit: 100 });
        await service.getNodes('mid-b', { limit: 100 });

        expect(getMetadataOptions.mock.calls[1][5]).toMatchObject({ level: 4, ancestorId: 'mid-b' });
    });

    test('falls back to level 1 when drilling into an unknown parent of a multi-level taxonomy', async () => {
        getMetadataOptions.mockResolvedValue({ entries: [], next_marker: null });

        const service = createTaxonomyItemsService(apiMock, fileId, multiLevelResolver)(identity);
        await service.getNodes('never-seen', { limit: 100 });

        expect(getMetadataOptions.mock.calls[0][5]).toMatchObject({ level: 1, ancestorId: 'never-seen' });
    });

    test('search forwards query, levelFilter, and parent scope', async () => {
        getMetadataOptions.mockResolvedValue({ entries: [], next_marker: null });

        const service = createTaxonomyItemsService(apiMock, fileId)(identity);
        await service.searchNodes('books', { limit: 100, parentId: 'root-a', levelFilter: 3, marker: 'm' });

        expect(getMetadataOptions.mock.calls[0][5]).toMatchObject({
            searchInput: 'books',
            level: 3,
            ancestorId: 'root-a',
            marker: 'm',
        });
    });

    test('search omits level filter when the picker does not restrict by level', async () => {
        getMetadataOptions.mockResolvedValue({ entries: [], next_marker: null });

        const service = createTaxonomyItemsService(apiMock, fileId)(identity);
        await service.searchNodes('anything', { limit: 100 });

        const optionsArg = getMetadataOptions.mock.calls[0][5];
        expect(optionsArg).toMatchObject({ searchInput: 'anything' });
        expect(optionsArg).not.toHaveProperty('level');
        expect(optionsArg).not.toHaveProperty('ancestorId');
    });

    test('derives hasChildren from the template levels when the backend omits it', async () => {
        getMetadataOptions.mockResolvedValue({
            entries: [buildEntry({ id: 'root-a', level: 1 }), buildEntry({ id: 'leaf', level: 3 })],
            next_marker: null,
        });

        const resolveField = jest.fn<TaxonomyFieldConfig, [string, string]>().mockReturnValue({
            levels: [makeLevel(1), makeLevel(2), makeLevel(3)],
            selectableLevels: [1, 2, 3],
        });
        const service = createTaxonomyItemsService(apiMock, fileId, resolveField)(identity);
        const response = await service.getNodes(null, { limit: 100 });

        expect(resolveField).toHaveBeenCalledWith(templateKey, fieldKey);
        expect(response.entries).toEqual([
            expect.objectContaining({ id: 'root-a', hasChildren: true }),
            expect.objectContaining({ id: 'leaf', hasChildren: false }),
        ]);
    });

    test('honors an explicit hasChildren flag from the backend over the inferred value', async () => {
        getMetadataOptions.mockResolvedValue({
            entries: [buildEntry({ id: 'root-a', level: 1, has_children: false })],
            next_marker: null,
        });

        const resolveField = jest.fn<TaxonomyFieldConfig, [string, string]>().mockReturnValue({
            levels: [makeLevel(1), makeLevel(2)],
            selectableLevels: [1, 2],
        });
        const service = createTaxonomyItemsService(apiMock, fileId, resolveField)(identity);
        const response = await service.getNodes(null, { limit: 100 });

        expect(response.entries[0]).toEqual(expect.objectContaining({ id: 'root-a', hasChildren: false }));
    });

    test('maps ancestor arrays into breadcrumb-ready objects and skips bare-id ancestors', async () => {
        getMetadataOptions.mockResolvedValue({
            entries: [
                buildEntry({
                    id: 'leaf',
                    level: 2,
                    ancestors: [{ id: 'root-a', display_name: 'Root A', level: 1 }, 'bare-string-id'],
                }),
            ],
            next_marker: null,
        });

        const service = createTaxonomyItemsService(apiMock, fileId)(identity);
        const response = await service.searchNodes('x', { limit: 100 });

        expect(response.entries[0].ancestors).toEqual([{ id: 'root-a', displayName: 'Root A', level: 1 }]);
    });

    test('separate service instances keep separate level caches (per-field isolation)', async () => {
        getMetadataOptions
            .mockResolvedValueOnce({
                entries: [buildEntry({ id: 'shared-id', level: 1 })],
                next_marker: null,
            })
            .mockResolvedValueOnce({ entries: [], next_marker: null });

        const factory = createTaxonomyItemsService(apiMock, fileId, multiLevelResolver);
        const serviceA = factory({ scope, templateKey, fieldKey: 'fieldA' });
        const serviceB = factory({ scope, templateKey, fieldKey: 'fieldB' });

        await serviceA.getNodes(null, { limit: 100 });
        // serviceB has never seen 'shared-id', so it cannot know it is level 1
        // — the request falls back to level 1 (root scope) rather than reusing
        // serviceA's cache.
        await serviceB.getNodes('shared-id', { limit: 100 });

        expect(getMetadataOptions.mock.calls[1][5]).toMatchObject({
            level: 1,
            ancestorId: 'shared-id',
        });
    });
});

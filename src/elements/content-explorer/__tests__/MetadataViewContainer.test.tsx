import * as React from 'react';

import type { Collection } from '../../../common/types/core';
import type { MetadataTemplate, MetadataTemplateField } from '../../../common/types/metadata';
import { render, screen, userEvent, waitFor, within } from '../../../test-utils/testing-library';
import MetadataViewContainer, {
    type MetadataViewContainerProps,
    convertFilterValuesToExternal,
    type ExternalFilterValues,
} from '../MetadataViewContainer';

describe('elements/content-explorer/MetadataViewContainer', () => {
    const mockItems = [
        {
            id: '1',
            name: 'File 1.txt',
            type: 'file',
            'item.name': 'File 1.txt',
            industry: 'tech',
        },
        {
            id: '2',
            name: 'File 2.pdf',
            type: 'file',
            'item.name': 'File 2.pdf',
            industry: 'finance',
        },
    ];

    const mockMetadataTemplateFields: MetadataTemplateField[] = [
        {
            id: 'field1',
            key: 'item.name',
            displayName: 'Name',
            type: 'string',
        },
        {
            id: 'field2',
            key: 'industry',
            displayName: 'Industry',
            type: 'enum',
            options: [
                { key: 'tech', id: 'tech1' },
                { key: 'finance', id: 'finance1' },
            ],
        },
        {
            id: 'field3',
            key: 'price',
            displayName: 'Price',
            type: 'float',
        },
        {
            id: 'field4',
            key: 'category',
            displayName: 'Category',
            type: 'multiSelect',
            options: [
                { key: 'category1', id: 'cat1' },
                { key: 'category2', id: 'cat2' },
            ],
        },
    ];

    const mockMetadataTemplate: MetadataTemplate = {
        id: 'template1',
        scope: 'enterprise',
        templateKey: 'testTemplate',
        displayName: 'Test Template',
        fields: mockMetadataTemplateFields,
    };

    const mockCollection: Collection = {
        id: '0',
        items: mockItems,
        percentLoaded: 100,
    };

    const defaultProps: MetadataViewContainerProps = {
        currentCollection: mockCollection,
        columns: [
            {
                textValue: 'Name',
                id: 'item.name',
                type: 'string',
                allowsSorting: true,
                minWidth: 250,
                maxWidth: 250,
                isRowHeader: true,
            },
            {
                textValue: 'Industry',
                id: 'industry',
                type: 'string',
                allowsSorting: true,
                minWidth: 250,
                maxWidth: 250,
            },
        ],
        metadataTemplate: mockMetadataTemplate,
        onMetadataFilter: jest.fn(),
    };

    const renderComponent = (props: Partial<MetadataViewContainerProps> = {}) => {
        return render(<MetadataViewContainer {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render MetadataView component', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'All Filters' })).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Name' })).toHaveLength(2); // One in filter bar, one in table header
        expect(screen.getByRole('button', { name: 'Industry' })).toBeInTheDocument();
        expect(screen.getByText('File 1.txt')).toBeInTheDocument();
        expect(screen.getByText('File 2.pdf')).toBeInTheDocument();
    });

    test('should pass values as string[] on submit', async () => {
        const onFilterSubmit = jest.fn();
        const template: MetadataTemplate = {
            ...mockMetadataTemplate,
            fields: [
                {
                    id: 'ms1',
                    key: 'role',
                    displayName: 'Contact Role',
                    type: 'multiSelect',
                    options: [
                        { id: 'r1', key: 'Developer' },
                        { id: 'r2', key: 'Marketing' },
                        { id: 'r3', key: 'Sales' },
                    ],
                },
            ],
        };

        renderComponent({
            metadataTemplate: template,
            actionBarProps: { onFilterSubmit },
            onMetadataFilter: jest.fn(),
        });

        await userEvent().click(screen.getByRole('button', { name: /Contact Role/ }));
        await userEvent().click(within(screen.getByRole('menu')).getByRole('menuitemcheckbox', { name: 'Developer' }));
        // Re-open the chip to select a second value (menu closes after submit)
        await userEvent().click(screen.getByRole('button', { name: /Contact Role/ }));
        await userEvent().click(within(screen.getByRole('menu')).getByRole('menuitemcheckbox', { name: 'Marketing' }));

        await waitFor(() => expect(onFilterSubmit).toHaveBeenCalledTimes(2));
        const firstCall = onFilterSubmit.mock.calls[0][0];
        const secondCall = onFilterSubmit.mock.calls[1][0];

        expect(firstCall.role.value).toEqual(['Developer']);
        expect(secondCall.role.value).toEqual(['Developer', 'Marketing']);
    });

    test('should call onMetadataFilter and onFilterSubmit when filter is submitted', async () => {
        const onFilterSubmit = jest.fn();
        const onMetadataFilter = jest.fn();
        const template: MetadataTemplate = {
            ...mockMetadataTemplate,
            fields: [
                {
                    id: 'field1',
                    key: 'status',
                    displayName: 'Status',
                    type: 'enum',
                    options: [
                        { id: 's1', key: 'Active' },
                        { id: 's2', key: 'Inactive' },
                    ],
                },
            ],
        };

        renderComponent({
            metadataTemplate: template,
            actionBarProps: { onFilterSubmit },
            onMetadataFilter,
        });

        await userEvent().click(screen.getByRole('button', { name: /Status/ }));
        await userEvent().click(within(screen.getByRole('menu')).getByRole('menuitemcheckbox', { name: 'Active' }));

        await waitFor(() => {
            expect(onMetadataFilter).toHaveBeenCalledTimes(1);
            expect(onFilterSubmit).toHaveBeenCalledTimes(1);
        });

        const filterCall = onMetadataFilter.mock.calls[0][0];
        const submitCall = onFilterSubmit.mock.calls[0][0];

        expect(filterCall.status.value).toEqual(['Active']);
        expect(submitCall.status.value).toEqual(['Active']);
    });

    test('should only call onMetadataFilter when onFilterSubmit is not provided', async () => {
        const onMetadataFilter = jest.fn();
        const template: MetadataTemplate = {
            ...mockMetadataTemplate,
            fields: [
                {
                    id: 'field1',
                    key: 'status',
                    displayName: 'Status',
                    type: 'enum',
                    options: [
                        { id: 's1', key: 'Active' },
                        { id: 's2', key: 'Inactive' },
                    ],
                },
            ],
        };

        renderComponent({
            metadataTemplate: template,
            onMetadataFilter,
        });

        await userEvent().click(screen.getByRole('button', { name: /Status/ }));
        await userEvent().click(within(screen.getByRole('menu')).getByRole('menuitemcheckbox', { name: 'Active' }));

        await waitFor(() => {
            expect(onMetadataFilter).toHaveBeenCalledTimes(1);
        });

        const filterCall = onMetadataFilter.mock.calls[0][0];
        expect(filterCall.status.value).toEqual(['Active']);
    });

    test('should handle initial filter values transformation', () => {
        const initialFilterValues = {
            industry: {
                fieldType: 'enum' as const,
                value: ['tech'],
            },
            price: {
                fieldType: 'float' as const,
                value: { range: { gt: 10, lt: 100 } },
            },
            name: {
                fieldType: 'string' as const,
                value: ['search term'],
            },
            category: {
                fieldType: 'multiSelect' as const,
                value: ['category1', 'category2'],
            },
        } as unknown as ExternalFilterValues;

        renderComponent({
            actionBarProps: { initialFilterValues },
        });

        expect(screen.getByRole('button', { name: 'All Filters 3' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Industry/i })).toHaveTextContent(/\(1\)/);
        expect(screen.getByRole('button', { name: /Category/i })).toHaveTextContent(/\(2\)/);
    });

    test('should handle empty metadata template fields', () => {
        const emptyTemplate: MetadataTemplate = {
            ...mockMetadataTemplate,
            fields: [],
        };

        renderComponent({ metadataTemplate: emptyTemplate });

        expect(screen.getByRole('button', { name: 'All Filters' })).toBeInTheDocument();
        expect(screen.getByText('File 1.txt')).toBeInTheDocument();
        expect(screen.getByText('File 2.pdf')).toBeInTheDocument();
    });

    test('should handle undefined metadata template', () => {
        renderComponent({ metadataTemplate: undefined as unknown as MetadataTemplate });

        expect(screen.getByRole('button', { name: 'All Filters' })).toBeInTheDocument();
        expect(screen.getByText('File 1.txt')).toBeInTheDocument();
        expect(screen.getByText('File 2.pdf')).toBeInTheDocument();
    });

    test('should handle empty collection items', () => {
        const emptyCollection: Collection = {
            id: '0',
            items: [],
            percentLoaded: 100,
        };

        renderComponent({ currentCollection: emptyCollection });

        expect(screen.getByRole('button', { name: 'All Filters' })).toBeInTheDocument();
    });

    test('should handle undefined collection items', () => {
        const collectionWithoutItems: Collection = {
            id: '0',
            percentLoaded: 100,
        };

        renderComponent({ currentCollection: collectionWithoutItems });

        expect(screen.getByRole('button', { name: 'All Filters' })).toBeInTheDocument();
    });

    test('should memoize filterGroups when metadataTemplate changes', () => {
        const { rerender } = renderComponent();

        // Re-render with same template
        rerender(<MetadataViewContainer {...defaultProps} />);

        // Re-render with different template
        const newTemplate: MetadataTemplate = {
            ...mockMetadataTemplate,
            id: 'template2',
            displayName: 'New Template',
        };
        rerender(<MetadataViewContainer {...defaultProps} metadataTemplate={newTemplate} />);

        expect(screen.getByRole('button', { name: 'All Filters' })).toBeInTheDocument();
    });

    test('should handle fields with no options', () => {
        const templateWithoutOptions: MetadataTemplate = {
            ...mockMetadataTemplate,
            fields: [
                {
                    id: 'field1',
                    key: 'name',
                    displayName: 'File Name',
                    type: 'string',
                },
                {
                    id: 'field2',
                    key: 'industry',
                    displayName: 'Industry',
                    type: 'enum',
                    // No options defined
                },
            ],
        };

        renderComponent({ metadataTemplate: templateWithoutOptions });

        expect(screen.getByRole('button', { name: 'All Filters' })).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Name' })).toHaveLength(1); // Only the one added by component
        expect(screen.getByRole('button', { name: 'File Name' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Industry' })).toBeInTheDocument();
    });

    test('should handle multiple field types in filter submission', async () => {
        const onFilterSubmit = jest.fn();
        const onMetadataFilter = jest.fn();
        const template: MetadataTemplate = {
            ...mockMetadataTemplate,
            fields: [
                {
                    id: 'field1',
                    key: 'status',
                    displayName: 'Status',
                    type: 'enum',
                    options: [
                        { id: 's1', key: 'Active' },
                        { id: 's2', key: 'Inactive' },
                    ],
                },
                {
                    id: 'field2',
                    key: 'price',
                    displayName: 'Price',
                    type: 'float',
                },
            ],
        };

        renderComponent({
            metadataTemplate: template,
            actionBarProps: { onFilterSubmit },
            onMetadataFilter,
        });

        // Test enum filter
        await userEvent().click(screen.getByRole('button', { name: /Status/ }));
        await userEvent().click(within(screen.getByRole('menu')).getByRole('menuitemcheckbox', { name: 'Active' }));

        await waitFor(() => {
            expect(onMetadataFilter).toHaveBeenCalledTimes(1);
            expect(onFilterSubmit).toHaveBeenCalledTimes(1);
        });

        const filterCall = onMetadataFilter.mock.calls[0][0];
        expect(filterCall.status.value).toEqual(['Active']);
        expect(filterCall.status.fieldType).toBe('enum');
    });

    describe('convertFilterValuesToExternal', () => {
        test('should convert enum values to string arrays', () => {
            const internalFilters = {
                'status-filter': {
                    fieldType: 'enum' as const,
                    options: [
                        { key: 'active', id: 'active1' },
                        { key: 'inactive', id: 'inactive1' },
                    ],
                    value: { enum: ['active', 'inactive'] },
                },
            };

            const result = convertFilterValuesToExternal(internalFilters);

            expect(result['status-filter'].value).toEqual(['active', 'inactive']);
            expect(result['status-filter'].fieldType).toBe('enum');
            expect(result['status-filter'].options).toEqual([
                { key: 'active', id: 'active1' },
                { key: 'inactive', id: 'inactive1' },
            ]);
        });

        test('should keep range values unchanged', () => {
            const internalFilters = {
                'price-filter': {
                    fieldType: 'float' as const,
                    value: { range: { gt: 10, lt: 100 }, advancedFilterOption: 'range' },
                },
            };

            const result = convertFilterValuesToExternal(internalFilters);

            expect(result['price-filter'].value).toEqual({ range: { gt: 10, lt: 100 }, advancedFilterOption: 'range' });
            expect(result['price-filter'].fieldType).toBe('float');
        });

        test('should keep float values unchanged', () => {
            const internalFilters = {
                'rating-filter': {
                    fieldType: 'float' as const,
                    value: { range: { gt: 4.5, lt: 5.0 }, advancedFilterOption: 'range' },
                },
            };

            const result = convertFilterValuesToExternal(internalFilters);

            expect(result['rating-filter'].value).toEqual({
                range: { gt: 4.5, lt: 5.0 },
                advancedFilterOption: 'range',
            });
            expect(result['rating-filter'].fieldType).toBe('float');
        });

        test('should handle mixed field types', () => {
            const internalFilters = {
                'status-filter': {
                    fieldType: 'enum' as const,
                    options: [
                        { key: 'active', id: 'active1' },
                        { key: 'inactive', id: 'inactive1' },
                    ],
                    value: { enum: ['active'] },
                },
                'price-filter': {
                    fieldType: 'float' as const,
                    value: { range: { gt: 0, lt: 50 }, advancedFilterOption: 'range' },
                },
                'category-filter': {
                    fieldType: 'multiSelect' as const,
                    options: [
                        { key: 'tech', id: 'tech1' },
                        { key: 'finance', id: 'finance1' },
                        { key: 'healthcare', id: 'healthcare1' },
                    ],
                    value: { enum: ['tech', 'finance'] },
                },
            };

            const result = convertFilterValuesToExternal(internalFilters);

            expect(result['status-filter'].value).toEqual(['active']);
            expect(result['price-filter'].value).toEqual({ range: { gt: 0, lt: 50 }, advancedFilterOption: 'range' });
            expect(result['category-filter'].value).toEqual(['tech', 'finance']);
        });

        test('should handle empty filter object', () => {
            const result = convertFilterValuesToExternal({});
            expect(result).toEqual({});
        });

        test('should handle enum values with empty array', () => {
            const internalFilters = {
                'status-filter': {
                    fieldType: 'enum' as const,
                    options: [{ key: 'active', id: 'active1' }],
                    value: { enum: [] },
                },
            };

            const result = convertFilterValuesToExternal(internalFilters);

            expect(result['status-filter'].value).toEqual([]);
            expect(result['status-filter'].fieldType).toBe('enum');
        });

        test('should handle multiSelect values', () => {
            const internalFilters = {
                'category-filter': {
                    fieldType: 'multiSelect' as const,
                    options: [
                        { key: 'tech', id: 'tech1' },
                        { key: 'finance', id: 'finance1' },
                    ],
                    value: { enum: ['tech', 'finance'] },
                },
            };

            const result = convertFilterValuesToExternal(internalFilters);

            expect(result['category-filter'].value).toEqual(['tech', 'finance']);
            expect(result['category-filter'].fieldType).toBe('multiSelect');
        });
    });
});

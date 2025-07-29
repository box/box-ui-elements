import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import MetadataViewContainer, { MetadataViewContainerProps } from '../MetadataViewContainer';
import type { Collection } from '../../../common/types/core';
import type { MetadataTemplate, MetadataTemplateField } from '../../../common/types/metadata';

describe('elements/content-explorer/MetadataViewContainer', () => {
    const mockItems = [
        { id: '1', name: 'File 1.txt', type: 'file' },
        { id: '2', name: 'File 2.pdf', type: 'file' },
    ];

    const mockMetadataTemplateFields: MetadataTemplateField[] = [
        {
            id: 'field1',
            key: ' name',
            displayName: 'Name',
            type: 'string',
        },
        {
            id: 'field1',
            key: 'industry',
            displayName: 'Industry',
            type: 'enum',
            options: [
                { key: 'tech', id: 'tech1' },
                { key: 'finance', id: 'finance1' },
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
                id: 'name',
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
    };

    const renderComponent = (props: Partial<MetadataViewContainerProps> = {}) => {
        return render(<MetadataViewContainer {...defaultProps} {...props} />);
    };

    test('should render MetadataView component', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'All Filters' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Name' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Industry' })).toBeInTheDocument();
        expect(screen.getByText('File 1.txt')).toBeInTheDocument();
        expect(screen.getByText('File 2.pdf')).toBeInTheDocument();
    });
});

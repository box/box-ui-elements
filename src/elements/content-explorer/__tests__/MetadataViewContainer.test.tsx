import * as React from 'react';

import type { Collection } from '../../../common/types/core';
import type { MetadataTemplate, MetadataTemplateField } from '../../../common/types/metadata';
import { render, screen, userEvent, waitFor, within } from '../../../test-utils/testing-library';
import MetadataViewContainer, { type MetadataViewContainerProps } from '../MetadataViewContainer';

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
            id: 'field2',
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

        renderComponent({ metadataTemplate: template, actionBarProps: { onFilterSubmit } });

        await userEvent().click(screen.getByRole('button', { name: /Contact Role/ }));
        await userEvent().click(within(screen.getByRole('menu')).getByRole('menuitemcheckbox', { name: 'Developer' }));
        // Re-open the chip to select a second value (menu closes after submit)
        await userEvent().click(screen.getByRole('button', { name: /Contact Role/ }));
        await userEvent().click(within(screen.getByRole('menu')).getByRole('menuitemcheckbox', { name: 'Marketing' }));

        await waitFor(() => expect(onFilterSubmit).toHaveBeenCalledTimes(2));
        const firstCall = onFilterSubmit.mock.calls[0][0];
        const secondCall = onFilterSubmit.mock.calls[1][0];
        expect(firstCall['role-filter'].value).toEqual(['Developer']);
        expect(secondCall['role-filter'].value).toEqual(['Developer', 'Marketing']);
    });
});

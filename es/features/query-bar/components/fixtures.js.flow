// @flow
import type { ColumnType } from '../flowTypes';

export const columnForItemName: ColumnType = {
    displayName: 'Name',
    id: '1',
    isShown: true,
    property: 'name',
    source: 'item',
    type: 'string',
};

export const columnForItemLastUpdated: ColumnType = {
    displayName: 'Last Updated',
    id: '2',
    isShown: true,
    property: 'lastUpdatedByName',
    source: 'item',
    type: 'date',
};

export const columnWithEnumType: ColumnType = {
    displayName: 'Contract Value',
    id: '3',
    isShown: true,
    property: 'contractValue',
    source: 'metadata',
    type: 'enum',
    options: [
        {
            id: '',
            key: '$100',
        },
    ],
};

export const columnForDateType: ColumnType = {
    displayName: 'Expire Date',
    id: '4',
    isShown: true,
    property: 'expireDate',
    source: 'metadata',
    type: 'date',
};

export const columnWithMultiEnumType: ColumnType = {
    displayName: 'Offices',
    id: '5',
    isShown: true,
    property: 'offices',
    source: 'metadata',
    type: 'multi-enum',
    options: [
        {
            id: '',
            key: 'Office A',
        },
        {
            id: '1',
            key: 'Office B',
        },
    ],
};

export const columnWithFloatType: ColumnType = {
    displayName: 'Count',
    id: '6',
    isShown: true,
    property: 'count',
    source: 'metadata',
    type: 'float',
};

export const columnForTemplateFieldName = {
    displayName: 'Name',
    id: '7',
    isShown: true,
    property: 'name',
    source: 'metadata',
    type: 'string',
};

export const columnWithNumberType: ColumnType = {
    displayName: 'Assets',
    id: '8',
    isShown: true,
    property: 'assets',
    source: 'metadata',
    type: 'number',
};

const metadataColumns: Array<ColumnType> = [columnWithEnumType, columnWithMultiEnumType];

const expectedVisibleColumns = {
    visibleColumns: [
        {
            displayName: 'Size',
            id: 'item_27',
            key: 'size',
            type: 'integer',
        },
        {
            displayName: 'Vendor Name',
            id: 'item_28',
            key: 'vendor name',
            type: 'string',
        },
        {
            displayName: 'Updated',
            id: 'item_26',
            key: 'updated',
            type: 'enum',
        },
        {
            displayName: 'Contract Value',
            id: 'item_29',
            key: 'contract value',
            type: 'enum',
        },
        {
            displayName: 'Expiration Month',
            id: 'item_30',
            key: 'expiration month',
            type: 'enum',
        },
        {
            displayName: 'Country',
            id: 'item_31',
            key: 'country',
            type: 'string',
        },
        {
            displayName: 'State',
            id: 'item_32',
            key: 'state',
            type: 'string',
        },
        {
            displayName: 'Function',
            id: 'item_33',
            key: 'function',
            type: 'string',
        },
    ],
};

const expectedVisibleColumnsOneHidden = {
    visibleColumns: [
        {
            displayName: 'Size',
            id: 'item_27',
            key: 'size',
            type: 'integer',
        },
        {
            displayName: 'Vendor Name',
            id: 'item_28',
            key: 'vendor name',
            type: 'string',
        },
        {
            displayName: 'Updated',
            id: 'item_26',
            key: 'updated',
            type: 'enum',
        },
        {
            displayName: 'Contract Value',
            id: 'item_29',
            key: 'contract value',
            type: 'enum',
        },
        {
            displayName: 'Expiration Month',
            id: 'item_30',
            key: 'expiration month',
            type: 'enum',
        },
        {
            displayName: 'Country',
            id: 'item_31',
            key: 'country',
            type: 'string',
        },
        {
            displayName: 'State',
            id: 'item_32',
            key: 'state',
            type: 'string',
        },
    ],
};

const visibleColumnsOneHidden = [
    {
        id: 'item_27',
        isChecked: true,
        label: 'Size',
        key: 'size',
        displayName: 'Size',
    },
    {
        id: 'item_28',
        isChecked: true,
        label: 'Vendor Name',
        key: 'vendor name',
        displayName: 'Vendor Name',
    },
    {
        id: 'item_26',
        isChecked: true,
        label: 'Updated',
        key: 'updated',
        displayName: 'Updated',
    },
    {
        id: 'item_29',
        isChecked: true,
        label: 'Contract Value',
        key: 'contract value',
        displayName: 'Contract Value',
    },
    {
        id: 'item_30',
        isChecked: true,
        label: 'Expiration Month',
        key: 'expiration month',
        displayName: 'Expiration Month',
    },
    {
        id: 'item_31',
        isChecked: true,
        label: 'Country',
        key: 'country',
        displayName: 'Country',
    },
    {
        id: 'item_32',
        isChecked: true,
        label: 'State',
        key: 'state',
        displayName: 'State',
    },
    {
        id: 'item_33',
        isChecked: false,
        label: 'Function',
        key: 'function',
        displayName: 'Function',
    },
];

const visibleColumnsAfterMount = {
    visibleColumns: [
        {
            displayName: 'Size',
            id: 'item_27',
            key: 'size',
            type: 'integer',
        },
        {
            displayName: 'Vendor Name',
            id: 'item_28',
            key: 'vendor name',
            type: 'string',
        },
        {
            displayName: 'Updated',
            id: 'item_26',
            key: 'updated',
            type: 'enum',
        },
        {
            displayName: 'Contract Value',
            id: 'item_29',
            key: 'contract value',
            type: 'enum',
        },
        {
            displayName: 'Expiration Month',
            id: 'item_30',
            key: 'expiration month',
            type: 'enum',
        },
        {
            displayName: 'Country',
            id: 'item_31',
            key: 'country',
            type: 'string',
        },
        {
            displayName: 'State',
            id: 'item_32',
            key: 'state',
            type: 'string',
        },
    ],
    widths: {
        size: 0.14285714285714285,
        'vendor name': 0.14285714285714285,
        updated: 0.14285714285714285,
        'contract value': 0.14285714285714285,
        'expiration month': 0.14285714285714285,
        country: 0.14285714285714285,
        state: 0.14285714285714285,
    },
};

const template = {
    id: 'template1',
    templateKey: 'template1',
    displayName: 'template1 title',
    scope: 'enterprise_123',
    'Vendor Name': {
        operators: ['is', 'is greater than', 'is less than', 'is not', 'is blank', 'matches any'],
        values: ['Google', 'Apple', 'Facebook'],
    },
    'Expiration Month': {
        operators: ['is', 'is greater than', 'is less than', 'is not'],
        values: ['August 2018', 'September 2018', 'October 2018'],
    },
    'File Type': {
        operators: ['is', 'is not'],
        values: ['.docx', '.mp3', 'mp4'],
    },
    fields: [
        {
            id: 'item_27',
            type: 'float',
            key: 'size',
            displayName: 'Size',
        },
        {
            id: 'item_28',
            type: 'string',
            key: 'vendor name',
            displayName: 'Vendor Name',
        },
        {
            id: 'item_26',
            type: 'enum',
            key: 'updated',
            displayName: 'Updated',
            options: [{ key: 'Now' }, { key: 'Tomorrow' }, { key: 'Yesterday' }, { key: 'Never' }],
        },
        {
            id: 'item_29',
            type: 'enum',
            key: 'contract value',
            displayName: 'Contract Value',
            options: [{ key: '$100' }, { key: '$2000' }, { key: '$10000' }, { key: '$200000' }],
        },
        {
            id: 'item_30',
            type: 'enum',
            key: 'expiration month',
            displayName: 'Expiration Month',
            options: [{ key: 'January' }, { key: 'February' }, { key: 'April' }, { key: 'May' }],
        },
        {
            id: 'item_31',
            type: 'string',
            key: 'country',
            displayName: 'Country',
        },
        {
            id: 'item_32',
            type: 'date',
            key: 'Submission',
            displayName: 'Submission',
        },
        {
            id: 'item_33',
            type: 'string',
            key: 'function',
            displayName: 'Function',
        },
    ],
    filesList: [{ name: '1' }, { name: '2' }, { name: '3' }],
    templateName: 'Vendor Contracts',
};

const instances = [
    {
        canEdit: true,
        id: 'editor1',
        data: {
            contractValue: 3,
            fileType: 'pdf',
            name: 'google',
            lastModified: '2018-06-20T00:00:00.000Z',
            size: 1,
        },
        cascadePolicy: {
            canEdit: true,
            isEnabled: false,
            id: 'some cascading policy id',
        },
    },
    {
        canEdit: true,
        id: 'editor2',
        data: {
            contractValue: 34,
            fileType: 'powerpoint-presentation',
            name: 'facebook',
            lastModified: '2018-06-20T00:00:00.000Z',
            size: 12,
        },
        cascadePolicy: {
            canEdit: true,
            isEnabled: false,
            id: 'some cascading policy id',
        },
    },
    {
        canEdit: true,
        id: 'editor3',
        data: {
            contractValue: 5,
            fileType: 'video',
            name: 'amazon',
            lastModified: '2018-06-20T00:00:00.000Z',
            size: 45,
        },
        cascadePolicy: {
            canEdit: true,
            isEnabled: false,
            id: 'some cascading policy id',
        },
    },
];

const metadataViewProps = {
    totalWidth: 700,
    tableHeight: 300,
    tableHeaderHeight: 40,
    tableRowHeight: 50,
    widths: {
        icon: 0.1,
        name: 0.4,
        lastModified: 0.6,
        size: 0.3,
        contractValue: 0.3,
    },
};

const metadataTableStateAfterMount = {
    visibleColumns: [
        {
            displayName: 'Size',
            id: 'item_27',
            key: 'size',
            type: 'integer',
        },
        {
            displayName: 'Vendor Name',
            id: 'item_28',
            key: 'vendor name',
            type: 'string',
        },
        {
            displayName: 'Updated',
            id: 'item_26',
            key: 'updated',
            type: 'enum',
        },
        {
            displayName: 'Contract Value',
            id: 'item_29',
            key: 'contract value',
            type: 'enum',
        },
        {
            displayName: 'Expiration Month',
            id: 'item_30',
            key: 'expiration month',
            type: 'enum',
        },
        {
            displayName: 'Country',
            id: 'item_31',
            key: 'country',
            type: 'string',
        },
        {
            displayName: 'State',
            id: 'item_32',
            key: 'state',
            type: 'string',
        },
        {
            displayName: 'Function',
            id: 'item_33',
            key: 'function',
            type: 'string',
        },
    ],
    widths: {
        size: 0.125,
        'vendor name': 0.125,
        updated: 0.125,
        'contract value': 0.125,
        'expiration month': 0.125,
        country: 0.125,
        state: 0.125,
        function: 0.125,
    },
};

export {
    metadataColumns,
    expectedVisibleColumns,
    visibleColumnsOneHidden,
    expectedVisibleColumnsOneHidden,
    visibleColumnsAfterMount,
    template,
    instances,
    metadataViewProps,
    metadataTableStateAfterMount,
};

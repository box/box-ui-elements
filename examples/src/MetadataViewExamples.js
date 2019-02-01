// @flow
import * as React from 'react';

import MetadataView from '../../src/features/metadata-view/MetadataView';

import '../styles/MetadataViewExamples.scss';

const totalWidth = 700;
const tableHeight = 300;
const tableHeaderHeight = 40;
const tableRowHeight = 50;
const widths = {
    icon: 0.11,
    name: 0.3,
    lastModified: 0.6,
    size: 0.3,
    contractValue: 0.9,
};

const instances = [
    {
        canEdit: true,
        id: 'editor1',
        data: {
            lastModified: '2013-05-20T00:00:00.000Z',
            contractValue: 3,
            fileType: 'pdf',
            name: 'Google',
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
            lastModified: '2017-04-21T00:00:00.000Z',
            contractValue: 34588,
            fileType: 'powerpoint-presentation',
            name: 'Facebook',
            size: 127834,
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
            lastModified: '2016-02-22T00:00:00.000Z',
            contractValue: 548949829823984983498398,
            fileType: 'video',
            name:
                'Long name - KJNASDKJNSDKnskdfjnskldjfnskldjnfkjsdngkjdfngamazonKJNASDKJNSDKnskdfjnskldjfnskldjnfkjsdngkjdfngamazonKJNASDKJNSDKnskdfjnskldjfnskldjnfkjsdngkjdfngamazonKJNASDKJNSDKnskdfjnskldjfnskldjnfkjsdngkjdfngamazonKJNASDKJNSDKnskdfjnskldjfnskldjnfkjsdngkjdfng',
            size: 14594600037438723487,
        },
        cascadePolicy: {
            canEdit: true,
            isEnabled: false,
            id: 'some cascading policy id',
        },
    },
];

const fieldTypes = {
    FIELD_TYPE_STRING: 'string',
    FIELD_TYPE_DATE: 'date',
    FIELD_TYPE_FLOAT: 'float',
    FIELD_TYPE_ENUM: 'enum',
};

export const template1 = {
    id: 'template1',
    templateKey: 'template1',
    displayName: 'template1 title that is super long',
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
            id: 'field1',
            type: fieldTypes.FIELD_TYPE_STRING,
            key: 'name',
            displayName: 'Name',
        },
        {
            id: 'field7',
            type: fieldTypes.FIELD_TYPE_DATE,
            key: 'lastModified',
            displayName: 'Last Modified',
        },
        {
            id: 'field11',
            type: fieldTypes.FIELD_TYPE_FLOAT,
            key: 'size',
            displayName: 'Size',
            description: 'example of an integer field',
        },
        {
            id: 'field5',
            type: fieldTypes.FIELD_TYPE_ENUM,
            key: 'contractValue',
            displayName: 'Contract Value',
            options: [{ key: '$100' }, { key: '$2000' }, { key: '$10000' }, { key: '$200000' }],
        },
    ],
};

export const template2 = {
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
            id: 'field1',
            type: fieldTypes.FIELD_TYPE_STRING,
            key: 'name',
            displayName: 'Name',
        },
    ],
};

type Props = {
    currentMessage?: string,
    template: MetadataTemplate,
    templates?: Array<MetadataTemplate>,
};

type State = {
    filterConditions: Array<Object>,
};

class MetadataViewExamples extends React.Component<Props, State> {
    state = {
        filterConditions: [],
    };

    onFilterChange = (conditions: Array<Object>) => {
        this.setState({
            filterConditions: conditions,
        });
    };

    render() {
        const filesList = [{ name: '1' }, { name: '2' }, { name: '3' }];
        const templateName = 'Vendor Contracts';
        const { currentMessage, template, templates } = this.props;
        const { filterConditions } = this.state;

        return (
            <div>
                <h3>Applied filters</h3>
                <pre className="applied-filters">{JSON.stringify(filterConditions, null, 4)}</pre>
                <MetadataView
                    instances={instances}
                    columnWidths={widths}
                    currentMessage={currentMessage}
                    filesList={filesList}
                    onFilterChange={this.onFilterChange}
                    shouldDisableColumnButton={!(template && template.fields && template.fields.length > 1)}
                    tableHeaderHeight={tableHeaderHeight}
                    tableHeight={tableHeight}
                    tableRowHeight={tableRowHeight}
                    template={template}
                    templates={templates || []}
                    templateName={templateName}
                    totalWidth={totalWidth}
                />
            </div>
        );
    }
}

export default MetadataViewExamples;

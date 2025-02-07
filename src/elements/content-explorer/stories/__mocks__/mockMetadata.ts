const mockMetadata = {
    entries: [
        {
            name: 'File1',
            etag: '2',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        role: ['Business Owner', 'Marketing'],
                        $template: 'templateName',
                        $parent: 'file_1188899160835',
                        name: 'something',
                        industry: 'Technology',
                        last_contacted_at: '2023-11-16T00:00:00.000Z',
                        $version: 6,
                    },
                },
            },
            id: '1188899160835',
            modified_at: '2023-04-12T10:06:04-07:00',
            type: 'file',
        },
        {
            name: 'File2',
            etag: '1',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        role: ['Developer'],
                        $template: 'templateName',
                        $parent: 'file_1318276254035',
                        name: '1',
                        industry: 'Healthcare',
                        last_contacted_at: '2023-11-01T00:00:00.000Z',
                        $version: 1,
                    },
                },
            },
            id: '1318276254035',
            modified_at: '2023-09-26T14:04:52-07:00',
            type: 'file',
        },
        {
            name: 'File3',
            etag: '0',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        $template: 'templateName',
                        $parent: 'folder_218662304788',
                        $version: 0,
                    },
                },
            },
            id: '218662304788',
            modified_at: '2024-06-13T15:53:23-07:00',
            type: 'folder',
        },
    ],
    limit: 50,
};

const mockSchema = {
    id: '26b5527a-bdf5-4e30-a1cb-310bff2b02b9',
    type: 'metadata_template',
    templateKey: 'templateName',
    scope: 'enterprise_0',
    displayName: 'templateName',
    hidden: false,
    copyInstanceOnItemCopy: false,
    fields: [
        {
            id: '56b6f00e-5db3-4875-a31d-14b20f63c0ea',
            type: 'string',
            key: 'name',
            displayName: 'Name',
            hidden: false,
            description: 'The customer name',
        },
        {
            id: '07d3c06c-5db4-4f3f-821e-19219ba70ed3',
            type: 'date',
            key: 'last_contacted_at',
            displayName: 'Last Contacted At',
            hidden: false,
            description: 'When this customer was last contacted at',
        },
        {
            id: 'b03f5855-d269-4dcf-8d14-dcae89b25aa6',
            type: 'enum',
            key: 'industry',
            displayName: 'Industry',
            hidden: false,
            options: [
                {
                    id: 'f552fe3f-0ccb-4ae1-9c21-508c49be3750',
                    key: 'Technology',
                },
                {
                    id: '53006247-72b4-4719-931a-7f9327a6e31d',
                    key: 'Healthcare',
                },
                {
                    id: 'bda9a5fb-8069-4977-87fd-870b8503095a',
                    key: 'Legal',
                },
            ],
        },
        {
            id: '1436c58a-5df5-44b5-b854-9a49e8f50e30',
            type: 'multiSelect',
            key: 'role',
            displayName: 'Contact Role',
            hidden: false,
            options: [
                {
                    id: '6dc57bab-b62d-4aec-8be0-fb8becae9b9a',
                    key: 'Developer',
                },
                {
                    id: '5373e8e1-1e8a-4649-9e06-370407772aa1',
                    key: 'Business Owner',
                },
                {
                    id: '78bdac5b-2639-4d68-9081-b8f2cdf6a9a1',
                    key: 'Marketing',
                },
                {
                    id: 'e3500aa8-5643-46b7-b58d-fbd7caa9d927',
                    key: 'Legal',
                },
                {
                    id: 'e7ef8b21-b6ec-4c9f-9899-4415d98e5c45',
                    key: 'Sales',
                },
            ],
        },
    ],
};

export { mockMetadata, mockSchema };

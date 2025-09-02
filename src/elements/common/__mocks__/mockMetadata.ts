const mockMetadata = {
    entries: [
        {
            extension: 'pdf',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        role: ['Business Owner', 'Marketing'],
                        $template: 'templateName',
                        $parent: 'file_1188899160835',
                        industry: 'Technology',
                        last_contacted_at: '2023-11-16T00:00:00.000Z',
                        $version: 9,
                    },
                },
            },
            name: 'Child 2 of metadata folder.pdf',
            created_at: '2023-04-12T10:06:04-07:00',
            etag: '3',
            id: '1188890835',
            type: 'file',
        },
        {
            extension: 'pdf',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        role: ['Developer'],
                        $template: 'templateName',
                        $parent: 'file_1318276254035',
                        industry: 'Technology',
                        last_contacted_at: '2023-11-01T00:00:00.000Z',
                        $version: 3,
                    },
                },
            },
            name: 'Child 1 of metadata folder.pdf',
            created_at: '2023-09-26T14:04:52-07:00',
            etag: '2',
            id: '13182754035',
            type: 'file',
        },
        {
            extension: 'pdf',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        role: ['Developer', 'Business Owner'],
                        $template: 'templateName',
                        $parent: 'file_1812488409191',
                        industry: 'Legal',
                        last_contacted_at: '2025-03-05T00:00:00.000Z',
                        $version: 1,
                    },
                },
            },
            name: 'Child of Folder 1.pdf',
            created_at: '2025-03-24T11:19:06-07:00',
            etag: '2',
            id: '18124889191',
            type: 'file',
        },
        {
            extension: 'pdf',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        role: ['Legal', 'Marketing'],
                        $template: 'templateName',
                        $parent: 'file_1812500610112',
                        industry: 'Legal',
                        last_contacted_at: '2025-03-11T00:00:00.000Z',
                        $version: 3,
                    },
                },
            },
            name: 'Child 1 of metadata folder 2.pdf',
            created_at: '2025-03-24T11:38:55-07:00',
            etag: '1',
            id: '18125010112',
            type: 'file',
        },
        {
            extension: 'pdf',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        $template: 'templateName',
                        $parent: 'file_1812508470016',
                        $version: 0,
                    },
                },
            },
            name: 'Child 1 of folder 3.pdf',
            created_at: '2025-03-24T11:50:52-07:00',
            etag: '2',
            id: '18125470016',
            type: 'file',
        },
        {
            name: 'Folder 1 with metadata',
            created_at: '2025-03-24T11:18:44-07:00',
            etag: '2',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        $template: 'templateName',
                        $parent: 'folder_313222720346',
                        industry: 'Technology',
                        $version: 1,
                    },
                },
            },
            id: '3132220346',
            type: 'folder',
        },
        {
            name: 'Folder 2 with metadata',
            created_at: '2025-03-24T11:37:27-07:00',
            etag: '1',
            metadata: {
                enterprise_0: {
                    templateName: {
                        $scope: 'enterprise_0',
                        $template: 'templateName',
                        $parent: 'folder_313225735088',
                        industry: 'Healthcare',
                        $version: 0,
                    },
                },
            },
            id: '3135735088',
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
        {
            id: 'c3f87bb0-44df-4689-aafe-b9ed4aecbb01',
            type: 'float',
            key: 'number',
            displayName: 'Merit Count',
            hidden: false,
        },
    ],
};

export { mockMetadata, mockSchema };

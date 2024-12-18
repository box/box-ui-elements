import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const fileIdWithMetadata = '415542803939';
export const fileIdWithoutMetadata = '416047501580';

const apiV2Path = `${DEFAULT_HOSTNAME_API}/2.0`;

export const mockFileRequest = {
    url: `${apiV2Path}/files/${fileIdWithMetadata}`,
    response: {
        type: 'file',
        id: fileIdWithMetadata,
        etag: '3',
        is_externally_owned: false,
        extension: 'pdf',
        permissions: {
            can_download: true,
            can_preview: true,
            can_upload: true,
            can_comment: true,
            can_rename: false,
            can_delete: false,
            can_share: false,
            can_set_share_access: false,
            can_invite_collaborator: false,
            can_annotate: false,
            can_view_annotations_all: true,
            can_view_annotations_self: true,
            can_create_annotations: true,
            can_view_annotations: true,
        },
    },
};

export const mockFileRequestWithoutMetadata = {
    url: `${apiV2Path}/files/${fileIdWithoutMetadata}`,
    response: {
        type: 'file',
        id: fileIdWithoutMetadata,
        etag: '3',
        is_externally_owned: false,
        permissions: {
            can_download: true,
            can_preview: true,
            can_upload: false,
            can_comment: true,
            can_rename: false,
            can_delete: false,
            can_share: false,
            can_set_share_access: false,
            can_invite_collaborator: false,
            can_annotate: false,
            can_view_annotations_all: true,
            can_view_annotations_self: true,
            can_create_annotations: true,
            can_view_annotations: true,
        },
    },
};

export const mockGlobalMetadataTemplates = {
    url: `${apiV2Path}/metadata_templates/global`,
    response: {
        entries: [],
    },
};

export const mockEmptyMetadataInstances = {
    url: `${apiV2Path}/files/${fileIdWithoutMetadata}/metadata`,
    response: {
        entries: [
            {
                id: '2cb618ed-f31e-4172-b354-534524246653',
                $version: 1,
                $type: 'Secrets-453ffc2f-bf5a-464c-a004-432342',
                $parent: 'file_415542803939',
                $typeVersion: 1,
                $template: 'secrets',
                $scope: 'enterprise_173733877',
                myAttribute: 'Secrets',
                $canEdit: true,
            },
        ],
    },
};

export const mockMetadataInstances = {
    url: `${apiV2Path}/files/${fileIdWithMetadata}/metadata`,
    response: {
        entries: [
            {
                $id: '776397f2-5d56-4a33-80c1-569614702899',
                $version: 1,
                $type: 'myTemplate-453ffc2f-bf5a-464c-a004-476a4eac20fd',
                $parent: 'file_415542803939',
                $typeVersion: 1,
                $template: 'myTemplate',
                $scope: 'enterprise_173733877',
                $templateKey: 'myTemplate',
                myAttribute: 'My Value',
                $canEdit: true,
            },
            {
                $id: '8efaaafc-6bbf-4d8a-bb94-6e0ed158d2a8',
                $version: 0,
                $type: 'selectDropdowns-0549abd6-5b7b-48ed-bfa8-34528d33d5b9',
                $parent: 'file_415542803939',
                $typeVersion: 2,
                $template: 'selectDropdowns',
                $scope: 'enterprise_173733877',
                $canEdit: true,
            },
            {
                $id: 'af8eb470-5336-4886-b488-9480526ffa06',
                $version: 1,
                $type: 'properties',
                $parent: 'file_415542803939',
                $typeVersion: 6,
                $template: 'properties',
                $scope: 'global',
                Test: 'Value',
                Key: 'Value',
                $canEdit: true,
            },
        ],
        limit: 100,
    },
};

export const mockEnterpriseMetadataTemplates = {
    url: `${apiV2Path}/metadata_templates/enterprise`,
    response: {
        limit: 1000,
        entries: [
            {
                id: '2f9c5b2b-01a2-4ae6-9197-1ff745effef0',
                type: 'metadata_template',
                templateKey: 'myTemplate',
                scope: 'enterprise_173733877',
                displayName: 'My Template',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: '4fc86fb1-43cd-4aa2-a585-5e94ec445d90',
                        type: 'string',
                        key: 'myAttribute',
                        displayName: 'My Attribute',
                        hidden: false,
                        description: 'My Value',
                    },
                ],
            },
            {
                id: '2cb618ed-f31e-4172-b354-6553b425e27c',
                type: 'metadata_template',
                templateKey: 'secrets',
                scope: 'enterprise_173733877',
                displayName: 'Secrets',
                hidden: true,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: '5b4d1801-dee1-4cd5-90b6-5d8b398e5da3',
                        type: 'float',
                        key: 'secretField',
                        displayName: 'Secret Field',
                        hidden: false,
                        description: 'secret value',
                    },
                ],
            },
            {
                id: '90ab141e-285b-43cb-8dc7-a0c32ee19342',
                type: 'metadata_template',
                templateKey: 'securityClassification-6VMVochwUWo',
                scope: 'enterprise_173733877',
                displayName: 'Classification',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: '94ce0935-915a-4dbd-87b2-557cac4fb0cb',
                        type: 'enum',
                        key: 'Box__Security__Classification__Key',
                        displayName: 'Classification',
                        hidden: false,
                        options: [
                            {
                                id: 'bab3be2f-050d-4036-ad04-8b776c834cbb',
                                key: 'Public',
                                staticConfig: {
                                    classification: {
                                        classificationDefinition: 'Publicly Accessible Information',
                                    },
                                },
                            },
                            {
                                id: 'bf183996-6671-4f29-a14c-14c995ab8939',
                                key: 'Private',
                                staticConfig: {
                                    classification: {
                                        classificationDefinition: 'Contains Sensitive Information',
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            {
                id: 'bc967b4c-5ec5-4230-a9bb-f1a4b841abf3',
                type: 'metadata_template',
                templateKey: 'selectDropdowns',
                scope: 'enterprise_173733877',
                displayName: 'Select Dropdowns',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: '3f17ef73-be16-409f-b574-ba1247f7ce27',
                        type: 'enum',
                        key: 'breakfastCereal',
                        displayName: 'Breakfast Cereal',
                        hidden: false,
                        options: [
                            {
                                id: '226269a5-7d36-4fb1-b0bd-59ae06dcee19',
                                key: 'Froot Loops',
                            },
                            {
                                id: '207da8a8-bb55-49c6-8333-a2dc8c79393a',
                                key: 'Trix',
                            },
                            {
                                id: '24a86a4e-bc5b-4416-81bc-276400adb0e6',
                                key: 'Frosted Flakes',
                            },
                            {
                                id: '414e0c29-b004-46a7-b3f1-79d5b16f30d9',
                                key: 'Cheerios',
                            },
                        ],
                    },
                    {
                        id: 'd5401569-dd35-427d-b493-016bb87f8702',
                        type: 'string',
                        key: 'someAttribute1',
                        displayName: 'Some Attribute #1',
                        hidden: false,
                    },
                    {
                        id: 'ef6f0580-aded-4463-897a-eddf63125e23',
                        type: 'string',
                        key: 'someAttribute2',
                        displayName: 'Some Attribute #2',
                        hidden: false,
                    },
                    {
                        id: '0192363e-2fbd-4899-9355-a38413eb6334',
                        type: 'string',
                        key: 'someAttribute3',
                        displayName: 'Some Attribute #3',
                        hidden: false,
                    },
                    {
                        id: '052afb34-4eba-41ee-b7df-619bd71d6f35',
                        type: 'string',
                        key: 'someAttribute4',
                        displayName: 'Some Attribute #4',
                        hidden: false,
                    },
                    {
                        id: 'cb0e30c3-ab19-4fd9-95fc-073aae682af5',
                        type: 'string',
                        key: 'someAttribute5',
                        displayName: 'Some Attribute #5',
                        hidden: false,
                    },
                    {
                        id: '77ea2b1e-27b3-42e8-a794-82a183819455',
                        type: 'string',
                        key: 'someAttribute6',
                        displayName: 'Some Attribute #6',
                        hidden: false,
                    },
                ],
            },
            {
                id: 'dc864980-9e7f-45ca-9c8a-88750001da7a',
                type: 'metadata_template',
                templateKey: 'virus_scan_c3Yf7Q56',
                scope: 'enterprise_173733877',
                displayName: 'Virus Scan',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: 'ffbca749-771b-4399-8c93-7d2610b5fbd3',
                        type: 'enum',
                        key: 'scan_result',
                        displayName: 'Scan result',
                        hidden: false,
                        options: [
                            {
                                id: 'b2876cf5-921f-495d-84a5-7db4ae3890cb',
                                key: 'Clean',
                            },
                            {
                                id: '429c03d4-19f4-441a-858d-6d8a9a3c0056',
                                key: 'Malicious',
                            },
                            {
                                id: 'f65c8ffb-2109-4cfb-aaf1-bb474b15f9fb',
                                key: 'Not scanned',
                            },
                            {
                                id: '45c8a35b-657f-40cb-9387-d1ec90d8176d',
                                key: 'Suspicious',
                            },
                            {
                                id: 'ff6da597-a484-4352-b068-89cc7e218152',
                                key: 'Unknown',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'dc864980-9e7f-45ca-9c8a-454367642fsdf3',
                type: 'metadata_template',
                templateKey: 'date_template',
                scope: 'enterprise_173733877',
                displayName: 'Date Template',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: 'ffbca749-771b-4399-8c93-4534fsdgs3423',
                        type: 'date',
                        key: 'dateField',
                        displayName: 'Date Field',
                        hidden: false,
                    },
                ],
            },
        ],
        next_marker: null,
        prev_marker: null,
    },
};

export const mockUpdateCustomMetadataRequest = {
    url: `${apiV2Path}/files/${fileIdWithMetadata}/metadata/global/properties`,
    response: {
        $id: 'a3e3f24a-dea8-4882-8830-5f922fb05fa8',
        $version: 1,
        $type: 'properties',
        $parent: 'file_9608784667',
        $typeVersion: 13,
        $template: 'properties',
        $scope: 'global',
        dsadsa: 'dd',
        $canEdit: true,
    },
};

export const aiSuggestionsForMyAttribute = {
    url: `${apiV2Path}/ai/extract_structured`,
    response: {
        myAttribute: 'it works fine',
    },
};

export const aiSuggestionForDateField = {
    url: `${apiV2Path}/ai/extract_structured`,
    response: {
        dateField: '2024-04-01T00:00:00Z',
    },
};

export const mockErrorDeleteMyTemplateMetadataRequest = {
    url: 'https://api.box.com/2.0/files/415542803939/metadata/enterprise_173733877/myTemplate',
    response: {
        message: "Instance of 'properties' not found for 'file_416047501580'",
        code: 'instance_not_found',
        request_id: 'fasf6as5fasfas7a',
    },
};

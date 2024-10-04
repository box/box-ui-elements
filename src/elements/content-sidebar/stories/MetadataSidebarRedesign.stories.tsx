import { type StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import React, { type ComponentProps } from 'react';
import { http, HttpResponse, delay } from 'msw';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';
import {
    mockEnterpriseMetadataTemplates,
    mockFileRequest,
    mockMetadataInstances,
} from './MetadataSidebarRedesignedMockedRequests';

const fileIdWithMetadata = global.FILE_ID;
const mockFeatures = {
    'metadata.redesign.enabled': true,
};
const mockLogger = {
    onReadyMetric: ({ endMarkName }) => {
        // eslint-disable-next-line no-console
        console.log(`Logger: onReadyMetric called with endMarkName: ${endMarkName}`);
    },
};

const fileId = '415542803939';

/*
// 👇 The mocked data that will be used in the story




const globalMetadataRequest = 'https://api.box.com/2.0/metadata_templates/global?limit=1000';

const mockedGlobalMetadata = {
    "limit": 1000,
    "entries": [
        {
            "id": "fd0ed769-8492-4d64-90ac-9d246ee603da",
            "type": "metadata_template",
            "templateKey": "MalwareDeepScan",
            "scope": "global",
            "displayName": "Shield Malware Scan",
            "hidden": false,
            "copyInstanceOnItemCopy": false,
            "fields": [
                {
                    "id": "ac36a36a-1c6c-40ec-a363-e6054538de37",
                    "type": "enum",
                    "key": "StaticScanStatus",
                    "displayName": "Static Scan Status",
                    "hidden": false,
                    "options": [
                        {
                            "id": "525ac453-2173-460f-b3cc-5569312e3f21",
                            "key": "Pending"
                        },
                        {
                            "id": "6d2eeb8b-ffbe-4345-9c4b-dc0c862b96b5",
                            "key": "Done"
                        },
                        {
                            "id": "515fd3a2-5965-4d02-a68a-32e693989ceb",
                            "key": "Not Supported"
                        }
                    ]
                },
                {
                    "id": "72e356a0-6b9a-4ae1-a674-386bfdd1e37f",
                    "type": "enum",
                    "key": "StaticScanResult",
                    "displayName": "Static Scan Result",
                    "hidden": false,
                    "options": [
                        {
                            "id": "de1731d9-2802-45e4-9ed3-e8a896682fb8",
                            "key": "Clean"
                        },
                        {
                            "id": "4153c22c-c8b7-469e-b08a-b4a1fecc891a",
                            "key": "Malicious"
                        },
                        {
                            "id": "4c3230d9-7da8-49f1-97fb-e950fa982558",
                            "key": "Not Supported"
                        },
                        {
                            "id": "29e310e3-21fe-448a-b9d0-23e8e6afff81",
                            "key": "Suspicious"
                        },
                        {
                            "id": "7840d7b3-4a99-4333-8195-a9d14645ac85",
                            "key": "Unknown"
                        }
                    ]
                },
                {
                    "id": "0eb4a2d9-9c70-4bd0-baa7-9cd255ab31dd",
                    "type": "date",
                    "key": "StaticScanDate",
                    "displayName": "Static Scan Date",
                    "hidden": true
                },

                {
                    "id": "f9447774-bc42-437c-8d2b-908380e88f12",
                    "type": "enum",
                    "key": "AdminResultOverride",
                    "displayName": "Admin Result Override",
                    "hidden": false,
                    "options": [
                        {
                            "id": "bb3ef7f7-e8d0-42df-8e4e-547510c9d27a",
                            "key": "Clean"
                        },
                        {
                            "id": "3c610673-1d6a-4a8c-8f0f-869dc62a902a",
                            "key": "Malicious"
                        }
                    ]
                },
                {
                    "id": "7239abb3-8df8-433f-9729-4c31521cb291",
                    "type": "string",
                    "key": "AdminResultOverrideComments",
                    "displayName": "Admin Result Override Comments",
                    "hidden": false
                },
            ]
        },
        {
            "id": "934557a4-958e-44a5-9918-4e73bc9802be",
            "type": "metadata_template",
            "templateKey": "imageContent",
            "scope": "global",
            "displayName": "Image Content",
            "hidden": false,
            "copyInstanceOnItemCopy": false,
            "fields": [
                {
                    "id": "5c6a5906-003b-4654-9deb-472583fc2930",
                    "type": "string",
                    "key": "keywords",
                    "displayName": "keywords",
                    "hidden": false
                },
                {
                    "id": "1f9db800-33d4-4743-b300-e7f755eb6222",
                    "type": "string",
                    "key": "text",
                    "displayName": "text",
                    "hidden": false,
                    "description": "text"
                }
            ]
        },
        {
            "id": "49e70b24-13ee-4724-b330-3975e5fa2b44",
            "type": "metadata_template",
            "templateKey": "userInfo",
            "scope": "global",
            "displayName": "User Info",
            "hidden": false,
            "copyInstanceOnItemCopy": false,
            "fields": [
                {
                    "id": "837e5265-f7a8-4048-8bdc-33899ae0b8ba",
                    "type": "string",
                    "key": "typedId",
                    "displayName": "Typed Id",
                    "hidden": false,
                    "description": "Typed Id of the user"
                },
                {
                    "id": "b302c7b9-1376-4c6b-9560-7b7214e3053f",
                    "type": "string",
                    "key": "typedEnterpriseId",
                    "displayName": "Typed Enterprise Id",
                    "hidden": false,
                    "description": "Enterprise Id of the User"
                },
                {
                    "id": "72a7ad70-a939-4b87-8648-1757d5efbfb6",
                    "type": "date",
                    "key": "createdAt",
                    "displayName": "Created At",
                    "hidden": false,
                    "description": "Timestamp of when user was created"
                },
                {
                    "id": "dd82bcd3-f05a-4b9c-8557-21ed522aa8c3",
                    "type": "date",
                    "key": "lastModifiedAt",
                    "displayName": "Last Modified At",
                    "hidden": false,
                    "description": "Timestamp of last modification on the user"
                },
                {
                    "id": "a33dd00e-4ad1-4ef8-aed7-0b2db52370aa",
                    "type": "string",
                    "key": "groups",
                    "displayName": "Groups",
                    "hidden": false,
                    "description": "Stores all groups the user belongs to as a csv string"
                },
                {
                    "id": "899c6c9e-eb1b-4481-b7ff-a8b349e4f1de",
                    "type": "enum",
                    "key": "status",
                    "displayName": "Status",
                    "hidden": false,
                    "description": "Status of the user",
                    "options": [
                        {
                            "id": "84e11f8e-a203-4c3b-91fb-9b8597866351",
                            "key": "active"
                        },
                        {
                            "id": "fd7b1b5c-4c83-40b4-88f6-18f96707957b",
                            "key": "inactive"
                        },
                        {
                            "id": "13d9787b-e97b-42e9-9f06-0a24c7a65f3d",
                            "key": "cannot_delete_edit"
                        },
                        {
                            "id": "5db62e0d-e64b-47db-8df6-5c7ebef5a00a",
                            "key": "cannot_delete_edit_upload"
                        }
                    ]
                },
                {
                    "id": "317af93d-bf39-4f8d-8b37-31a6f8ec46d5",
                    "type": "enum",
                    "key": "role",
                    "displayName": "Role",
                    "hidden": false,
                    "description": "Role of the user",
                    "options": [
                        {
                            "id": "c1ab0ce0-fffa-48d2-a8a9-cb8970a7e12d",
                            "key": "Admin"
                        },
                        {
                            "id": "34a77698-b318-4463-8741-672b15573147",
                            "key": "Co-Admin"
                        },
                        {
                            "id": "f74a10b1-7548-49c5-993b-22953fc85827",
                            "key": "Group Admin"
                        },
                        {
                            "id": "645733cc-ba59-48f0-80c2-71ccc28abb9e",
                            "key": "Member"
                        }
                    ]
                }
            ]
        }
    ],
    "next_marker": null,
    "prev_marker": null
}



export const MockedFileSuccess = {
    parameters: {
        msw: {
            handlers: [
                http.get('https://api.box.com/2.0/files/415542803939?fields=is_externally_owned,permissions', () => {
                    return HttpResponse.json(mockedFile);
                }),

            ],
        },
    },
};

export const MockedError = {
    parameters: {
        msw: {
            handlers: [
                http.get('https://api.box.com/2.0/files/415542803939?fields=name,size,extension,file_version,shared_link,permissions,content_created_at,content_modified_at,created_at,created_by,modified_at,modified_by,owned_by,description,metadata.global.boxSkillsCards,expires_at,version_limit,version_number,is_externally_owned,restored_from,authenticated_download_url,is_download_available,uploader_display_name', () => {
                    // await delay(800);
                    return new HttpResponse(null, {
                        status: 403,
                    });
                }),
            ],
        },
    },
}; */

const defaultMetadataSidebarProps: ComponentProps<typeof MetadataSidebarRedesign> = {
    isBoxAiSuggestionsEnabled: true,
    isFeatureEnabled: true,
    onError: fn,
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebarRedesign',
    component: ContentSidebar,
    args: {
        fileId: fileIdWithMetadata,
        features: mockFeatures,
        logger: mockLogger,
        hasMetadata: true,
        token: global.TOKEN,
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    /* parameters: {
        msw: {
            handlers: [
                http.get(mockFileRequest.url, () => {
                    return HttpResponse.json(mockFileRequest.response);
                }),
                http.get(mockMetadataInstances.url, () => {
                    return HttpResponse.json(mockMetadataInstances.response);
                }),
                http.get(mockEnterpriseMetadataTemplates.url, () => {
                    return HttpResponse.json(mockEnterpriseMetadataTemplates.response);
                }),
            ],
        },
    }, */
    render: args => {
        return <ContentSidebar {...args} />;
    },
};

export const Basic: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' }, { timeout: 5000 });
        await userEvent.click(addTemplateButton);
    },
};

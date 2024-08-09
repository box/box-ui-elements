import { fn } from '@storybook/test';
import MetadataSidebar from '../MetadataSidebarRedesign';

export const basic = {};

const mockAPI = {
    getFile: fn((id, successCallback) => {
        successCallback({ id, [FIELD_PERMISSIONS_CAN_UPLOAD]: true });
    }),
    getMetadata: fn((_file, successCallback) => {
        successCallback({
            editors: [],
            templates: [
                {
                    id: 'metadata_template_custom_1',
                    scope: 'global',
                    templateKey: 'properties',
                    hidden: false,
                },
            ],
        });
    }),
};
const api = {
    getFileAPI: fn().mockReturnValue(mockAPI),
    getMetadataAPI: fn().mockReturnValue(mockAPI),
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebar',
    component: MetadataSidebar,
    args: {
        api,
        fileId: 'test-file-id-1',
        elementId: 'element-1',
        isFeatureEnabled: true,
        onError: fn(),
    },
};

import { http, HttpResponse } from 'msw';
import ContentExplorer from '../../ContentExplorer';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';
import { mockMetadata, mockSchema } from '../../../common/__mocks__/mockMetadata';

const EID = '0';
const templateName = 'templateName';
const metadataSource = `enterprise_${EID}.${templateName}`;
const metadataSourceFieldName = `metadata.${metadataSource}`;

const metadataQuery = {
    from: metadataSource,

    // // Filter items in the folder by existing metadata key
    // query: 'key = :arg1',
    //
    // // Display items with value
    // query_params: { arg1: 'value' },

    ancestor_folder_id: '313259567207',
    fields: [
        `${metadataSourceFieldName}.name`,
        `${metadataSourceFieldName}.industry`,
        `${metadataSourceFieldName}.last_contacted_at`,
        `${metadataSourceFieldName}.role`,
    ],
};

const fieldsToShow = [
    { key: `${metadataSourceFieldName}.name`, canEdit: false, displayName: 'Alias' },
    { key: `${metadataSourceFieldName}.industry`, canEdit: true },
    { key: `${metadataSourceFieldName}.last_contacted_at`, canEdit: true },
    { key: `${metadataSourceFieldName}.role`, canEdit: true },
];
const defaultView = 'metadata'; // Required prop to paint the metadata view. If not provided, you'll get regular folder view.

export const metadataView = {
    args: {
        metadataQuery,
        fieldsToShow,
        defaultView,
    },
};

export const withNewMetadataView = {
    args: {
        metadataQuery,
        fieldsToShow,
        defaultView,
        features: {
            contentExplorer: {
                metadataViewV2: true,
            },
        },
    },
};

export default {
    title: 'Elements/ContentExplorer/tests/ContentExplorer/visual/MetadataView',
    component: ContentExplorer,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
    parameters: {
        msw: {
            handlers: [
                http.post(`${DEFAULT_HOSTNAME_API}/2.0/metadata_queries/execute_read`, () => {
                    return HttpResponse.json(mockMetadata);
                }),
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/metadata_templates/enterprise/templateName/schema`, () => {
                    return HttpResponse.json(mockSchema);
                }),
            ],
        },
    },
};

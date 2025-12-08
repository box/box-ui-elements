// @flow
import { http, HttpResponse } from 'msw';
import ContentSidebar from '../../ContentSidebar';
import { mockFileRequest } from '../../stories/__mocks__/ContentSidebarMocks';
import mockDocGenTags from '../../__mocks__/DocGenSidebar.mock';

const defaultArgs = {
    detailsSidebarProps: {
        hasProperties: true,
        hasNotices: true,
        hasAccessStats: true,
        hasClassification: true,
        hasRetentionPolicy: true,
    },
    features: global.FEATURES,
    fileId: global.FILE_ID,
    hasActivityFeed: true,
    hasMetadata: true,
    hasSkills: true,
    hasVersions: true,
    token: global.TOKEN,
};

export const basic = {
    args: {
        defaultView: 'docgen',
        docGenSidebarProps: {
            enabled: true,
            isDocGenTemplate: true,
            checkDocGenTemplate: () => {},
            getDocGenTags: () =>
                Promise.resolve({
                    pagination: {},
                    data: mockDocGenTags,
                }),
        },
    },
};

export const withModernizedBlueprint = {
    args: {
        enableModernizedComponents: true,
        defaultView: 'docgen',
        docGenSidebarProps: {
            enabled: true,
            isDocGenTemplate: true,
            checkDocGenTemplate: () => {},
            getDocGenTags: () =>
                Promise.resolve({
                    pagination: {},
                    data: mockDocGenTags,
                }),
        },
    },
};

export default {
    title: 'Elements/ContentSidebar/DocGenSidebar',
    component: ContentSidebar,
    args: defaultArgs,
    parameters: {
        msw: {
            handlers: [
                http.get(mockFileRequest.url, () => {
                    return HttpResponse.json(mockFileRequest.response);
                }),
            ],
        },
    },
};

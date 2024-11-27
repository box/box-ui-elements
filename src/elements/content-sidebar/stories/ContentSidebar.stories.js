// @flow
import { http, HttpResponse } from 'msw';
import ContentSidebar from '../ContentSidebar';
import { mockFileRequest } from './__mocks__/ContentSidebarMocks';

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

export const basic = {};

export const withPanelPreservation = {
    args: {
        features: { ...defaultArgs.features, panelSelectionPreservation: true },
    },
};

export default {
    title: 'Elements/ContentSidebar',
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

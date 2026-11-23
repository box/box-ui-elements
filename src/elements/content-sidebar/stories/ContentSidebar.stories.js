// @flow
import { http, HttpResponse, passthrough } from 'msw';
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
                http.get(mockFileRequest.url, ({ request }) => {
                    // MSW matches the path only, so let other file requests (e.g. the full file fetch) reach the API
                    const fields = new URL(request.url).searchParams.get('fields');
                    if (fields !== new URL(mockFileRequest.url).searchParams.get('fields')) {
                        return passthrough();
                    }
                    return HttpResponse.json(mockFileRequest.response);
                }),
            ],
        },
    },
};

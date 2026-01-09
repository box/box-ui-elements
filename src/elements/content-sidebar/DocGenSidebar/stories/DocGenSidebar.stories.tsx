import noop from 'lodash/noop';
import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';
import type { Meta } from '@storybook/react';
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
    features: global.FEATURE_FLAGS,
    fileId: global.FILE_ID,
    hasActivityFeed: true,
    hasMetadata: true,
    hasSkills: true,
    hasVersions: true,
    token: global.TOKEN,
};

const docGenSidebarProps = {
    enabled: true,
    isDocGenTemplate: true,
    checkDocGenTemplate: noop,
    getDocGenTags: async () => ({
        pagination: {},
        data: mockDocGenTags,
    }),
};

export const basic = {
    args: {
        defaultView: 'docgen',
        docGenSidebarProps,
    },
};

export const withModernizedBlueprint = {
    args: {
        enableModernizedComponents: true,
        defaultView: 'docgen',
        docGenSidebarProps,
    },
};

const meta: Meta<typeof ContentSidebar> & { parameters: { msw: { handlers: HttpHandler[] } } } = {
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

export default meta;

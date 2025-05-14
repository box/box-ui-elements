// @flow
import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';
import type { Meta } from '@storybook/react';
import ContentSidebar from '../../ContentSidebar';
import { mockFileRequest } from '../__mocks__/ContentSidebarMocks';
import { testFileIds } from '../../../../../test/support/constants';

const defaultArgs = {
    detailsSidebarProps: {
        hasAccessStats: true,
        hasClassification: true,
        hasNotices: true,
        hasProperties: true,
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

export const basic = {
    args: {
        fileId: testFileIds.FILE_ID_SKILLS,
    },
};

export const fileVersion = {
    args: {
        fileId: testFileIds.FILE_ID_DOC_VERSIONED,
    },
};

const meta: Meta<typeof ContentSidebar> & { parameters: { msw: { handlers: HttpHandler[] } } } = {
    title: 'Elements/ContentSidebar/tests/e2e',
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

// @flow
import { http, HttpResponse } from 'msw';
import ContentUploader from '../ContentUploader';
import mockTheme from '../../common/__mocks__/mockTheme';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../../../constants';

export const basic = {};

export const withTheming = {
    args: {
        theme: mockTheme,
    },
};

export const withModernizedUploads = {
    args: {
        enableModernizedUploads: true,
        useUploadsManager: true,
        files: [
            new File(['contents'], 'upload_file_1.txt', { type: 'text/plain' }),
            new File(['contents'], 'upload_file_2.txt', { type: 'text/plain' }),
            new File(['contents'], 'upload_file_3.txt', { type: 'text/plain' }),
        ],
    },
    parameters: {
        msw: {
            handlers: [
                http.options(`${DEFAULT_HOSTNAME_API}/2.0/files/content`, () => {
                    return HttpResponse.json({});
                }),
                http.post(`${DEFAULT_HOSTNAME_UPLOAD}/api/2.0/files/content`, () => {
                    return HttpResponse.json({});
                }),
            ],
        },
    },
};

export default {
    title: 'Elements/ContentUploader',
    component: ContentUploader,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
};

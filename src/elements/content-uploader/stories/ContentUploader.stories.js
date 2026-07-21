// @flow
import * as React from 'react';
import { http, HttpResponse } from 'msw';
import { UploadsManager as UploadsManagerBP } from '@box/uploads-manager';
import ContentUploader from '../ContentUploader';
import mockTheme from '../../common/__mocks__/mockTheme';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../../../constants';

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

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

// The modernized uploads manager renders the `X / TOTAL · <time> left` status
// only when items carry byte-level progress and an ETA. A real upload through
// MSW can't produce a paused mid-transfer state (upload progress isn't streamed
// and the response resolves immediately), so this story renders the modernized
// manager directly with fixed in-progress items to make the size + ETA line
// observable. It also exercises the linked @box/uploads-manager build.
const modernizedInProgressItems = [
    {
        id: '1',
        name: 'annual-report',
        extension: 'pdf',
        status: 'uploading',
        progress: 45,
        bytesUploaded: 2.4 * MB,
        totalBytes: 5.3 * MB,
        remainingSeconds: 5, // "5 sec left"
    },
    {
        id: '2',
        name: 'quarterly-presentation',
        extension: 'pptx',
        status: 'uploading',
        progress: 20,
        bytesUploaded: 50 * MB,
        totalBytes: 250 * MB,
        remainingSeconds: 183, // "3 min left"
    },
    {
        id: '3',
        name: 'full-backup',
        extension: 'zip',
        status: 'uploading',
        progress: 10,
        bytesUploaded: 0.4 * GB,
        totalBytes: 4 * GB,
        remainingSeconds: 4200, // "1 hr left"
    },
    {
        id: '4',
        name: 'logo',
        extension: 'png',
        status: 'uploading',
        progress: 60,
        bytesUploaded: 150 * KB,
        totalBytes: 253 * KB,
        remainingSeconds: 12, // "12 sec left"
    },
];

export const withModernizedUploadsInProgress = {
    name: 'With Modernized Uploads (in progress · size + ETA)',
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <UploadsManagerBP
                items={modernizedInProgressItems}
                isExpanded
                onToggle={() => {}}
                onItemCancel={() => {}}
                onItemRetry={() => {}}
                onItemRemove={() => {}}
                onItemShare={() => {}}
                onItemOpen={() => {}}
                onCancelAll={() => {}}
                onRetryAll={() => {}}
            />
        </div>
    ),
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

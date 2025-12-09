import { expect, userEvent, waitFor, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';

import ContentUploader from '../../ContentUploader';
import { SLEEP_TIMEOUT } from '../../../../utils/storybook';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../../../../constants';

const singleFile = new File(['contents'], 'upload_file.txt', { type: 'text/plain' });
const multipleFiles = [
    new File(['contents'], 'upload_file_1.txt', { type: 'text/plain' }),
    new File(['contents'], 'upload_file_2.txt', { type: 'text/plain' }),
    new File(['contents'], 'upload_file_3.txt', { type: 'text/plain' }),
];

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('Drag and drop files')).toBeInTheDocument();
        expect(canvas.getByText('Browse your device')).toBeInTheDocument();
        expect(canvas.getByText('Close')).toBeInTheDocument();
        expect(canvas.getByText('Cancel')).toBeInTheDocument();
        expect(canvas.getByText('Upload')).toBeInTheDocument();
    },
};

export const withModernization = {
    args: {
        enableModernizedComponents: true,
    },
};

export const singleUpload = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dropzone = canvas.getByTestId('upload-input');
        await userEvent.upload(dropzone, singleFile);

        expect(canvas.getByText('upload_file.txt')).toBeInTheDocument();
    },
};

export const singleUploadCancel = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dropzone = canvas.getByTestId('upload-input');
        await userEvent.upload(dropzone, singleFile);

        const cancelButton = canvas.getByText('Cancel');
        await userEvent.click(cancelButton);

        expect(canvas.queryByText('upload_file.txt')).not.toBeInTheDocument();

        expect(canvas.getByText('Drag and drop files')).toBeInTheDocument();
        expect(canvas.getByText('Browse your device')).toBeInTheDocument();
    },
};

export const singleUploadCancelFromRow = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dropzone = canvas.getByTestId('upload-input');
        await userEvent.upload(dropzone, singleFile);

        const cancelButton = canvas.getByLabelText('Cancel this upload');
        await userEvent.click(cancelButton);

        expect(canvas.queryByText('upload_file.txt')).not.toBeInTheDocument();

        expect(canvas.getByText('Drag and drop files')).toBeInTheDocument();
        expect(canvas.getByText('Browse your device')).toBeInTheDocument();
    },
};

export const successfulSingleUpload = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dropzone = canvas.getByTestId('upload-input');
        await userEvent.upload(dropzone, singleFile);

        const uploadButton = canvas.getByText('Upload');
        await userEvent.click(uploadButton);

        await waitFor(
            () => {
                expect(canvas.getByText('Success! Your files have been uploaded.')).toBeInTheDocument();
                expect(canvas.getByText('Select More Files')).toBeInTheDocument();
            },
            {
                timeout: SLEEP_TIMEOUT,
            },
        );
    },
};

export const multipleUpload = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dropzone = canvas.getByTestId('upload-input');
        await userEvent.upload(dropzone, multipleFiles);

        expect(canvas.getByText('upload_file_1.txt')).toBeInTheDocument();
        expect(canvas.getByText('upload_file_2.txt')).toBeInTheDocument();
        expect(canvas.getByText('upload_file_3.txt')).toBeInTheDocument();
    },
};

export const multipleUploadCancel = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dropzone = canvas.getByTestId('upload-input');
        await userEvent.upload(dropzone, multipleFiles);

        const cancelButton = canvas.getByText('Cancel');
        await userEvent.click(cancelButton);

        expect(canvas.queryByText('upload_file_1.txt')).not.toBeInTheDocument();
        expect(canvas.queryByText('upload_file_2.txt')).not.toBeInTheDocument();
        expect(canvas.queryByText('upload_file_3.txt')).not.toBeInTheDocument();

        expect(canvas.getByText('Drag and drop files')).toBeInTheDocument();
        expect(canvas.getByText('Browse your device')).toBeInTheDocument();
    },
};

export const multipleUploadCancelFromRow = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dropzone = canvas.getByTestId('upload-input');
        await userEvent.upload(dropzone, multipleFiles);

        const cancelButtons = canvas.getAllByLabelText('Cancel this upload');
        await userEvent.click(cancelButtons[1]); // Cancel middle one

        expect(canvas.queryByText('upload_file_1.txt')).toBeInTheDocument();
        expect(canvas.queryByText('upload_file_2.txt')).not.toBeInTheDocument();
        expect(canvas.queryByText('upload_file_3.txt')).toBeInTheDocument();
    },
};

export const successfulMultipleUpload = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dropzone = canvas.getByTestId('upload-input');
        await userEvent.upload(dropzone, multipleFiles);

        const uploadButton = canvas.getByText('Upload');
        await userEvent.click(uploadButton);

        await waitFor(
            () => {
                expect(canvas.getByText('Success! Your files have been uploaded.')).toBeInTheDocument();
                expect(canvas.getByText('Select More Files')).toBeInTheDocument();
            },
            {
                timeout: SLEEP_TIMEOUT,
            },
        );
    },
};

export default {
    title: 'Elements/ContentUploader/tests/visual',
    component: ContentUploader,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
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

import React from 'react';
import { render, RenderResult, screen, waitFor } from '@testing-library/react';

import {
    DEFAULT_ITEM_API_RESPONSE,
    DEFAULT_USER_API_RESPONSE,
    MOCK_ITEM,
    MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
    MOCK_ITEM_API_RESPONSE_WITH_CLASSIFICATION,
} from '../utils/__mocks__/ContentSharingV2Mocks';
import { CONTENT_SHARING_ITEM_FIELDS } from '../constants';

import ContentSharingV2 from '../ContentSharingV2';

const createAPIMock = (fileAPI, folderAPI, usersAPI) => ({
    getFileAPI: jest.fn().mockReturnValue(fileAPI),
    getFolderAPI: jest.fn().mockReturnValue(folderAPI),
    getUsersAPI: jest.fn().mockReturnValue(usersAPI),
});

const createSuccessMock = responseFromAPI => (id, successFn) => {
    return Promise.resolve(responseFromAPI).then(response => {
        successFn(response);
    });
};

const getDefaultUserMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_USER_API_RESPONSE));
const getDefaultFileMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_ITEM_API_RESPONSE));
const getFileMockWithSharedLink = jest
    .fn()
    .mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK));
const getFileMockWithClassification = jest
    .fn()
    .mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE_WITH_CLASSIFICATION));
const getDefaultFolderMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_ITEM_API_RESPONSE));
const defaultAPIMock = createAPIMock(
    { getFile: getDefaultFileMock },
    { getFolderFields: getDefaultFolderMock },
    { getUser: getDefaultUserMock },
);

const getWrapper = (props): RenderResult =>
    render(
        <ContentSharingV2
            api={defaultAPIMock}
            itemID={MOCK_ITEM.id}
            itemType={MOCK_ITEM.type}
            hasProviders={true}
            {...props}
        ></ContentSharingV2>,
    );

describe('elements/content-sharing/ContentSharingV2', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should see the correct elements for files', async () => {
        getWrapper({});
        await waitFor(() => {
            expect(getDefaultFileMock).toHaveBeenCalledWith(
                MOCK_ITEM.id,
                expect.any(Function),
                {},
                {
                    fields: CONTENT_SHARING_ITEM_FIELDS,
                },
            );
        });

        expect(screen.getByRole('heading', { name: 'Share ‘Box Development Guide.pdf’' })).toBeVisible();
        expect(screen.getByRole('combobox', { name: 'Invite People' })).toBeVisible();
        expect(screen.getByRole('switch', { name: 'Shared link' })).toBeVisible();
    });

    test('should see the correct elements for folders', async () => {
        getWrapper({ itemType: 'folder' });
        await waitFor(() => {
            expect(getDefaultFolderMock).toHaveBeenCalledWith(
                MOCK_ITEM.id,
                expect.any(Function),
                {},
                {
                    fields: CONTENT_SHARING_ITEM_FIELDS,
                },
            );
        });

        expect(screen.getByRole('heading', { name: 'Share ‘Box Development Guide.pdf’' })).toBeVisible();
        expect(screen.getByRole('combobox', { name: 'Invite People' })).toBeVisible();
        expect(screen.getByRole('switch', { name: 'Shared link' })).toBeVisible();
    });

    test('should see the shared link elements if shared link is present', async () => {
        getWrapper({
            api: createAPIMock({ getFile: getFileMockWithSharedLink }, null, { getUser: getDefaultUserMock }),
        });
        await waitFor(() => {
            expect(getFileMockWithSharedLink).toHaveBeenCalledWith(
                MOCK_ITEM.id,
                expect.any(Function),
                {},
                {
                    fields: CONTENT_SHARING_ITEM_FIELDS,
                },
            );
        });

        expect(await screen.findByLabelText('Shared link URL')).toBeVisible();
        expect(await screen.findByRole('button', { name: 'People with the link' })).toBeVisible();
        expect(await screen.findByRole('button', { name: 'Can view and download' })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Link Settings' })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Copy' })).toBeVisible();
    });

    test('should see the classification elements if classification is present', async () => {
        getWrapper({
            api: createAPIMock({ getFile: getFileMockWithClassification }, null, { getUser: getDefaultUserMock }),
        });
        await waitFor(() => {
            expect(getFileMockWithClassification).toHaveBeenCalledWith(
                MOCK_ITEM.id,
                expect.any(Function),
                {},
                {
                    fields: CONTENT_SHARING_ITEM_FIELDS,
                },
            );
        });

        // TODO: Figure out why classification is not being rendered in the DOM
        expect(await screen.findByText('BLUE')).toBeVisible();
    });
});

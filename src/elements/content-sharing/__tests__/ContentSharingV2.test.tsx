import React from 'react';
import { render, type RenderResult, screen, waitFor } from '@testing-library/react';

import { useSharingService } from '../hooks/useSharingService';
import {
    DEFAULT_ITEM_API_RESPONSE,
    DEFAULT_USER_API_RESPONSE,
    MOCK_ITEM,
    MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
    MOCK_ITEM_API_RESPONSE_WITH_CLASSIFICATION,
    MOCK_COLLABORATIONS_RESPONSE,
    mockAvatarURLMap,
} from '../utils/__mocks__/ContentSharingV2Mocks';
import { CONTENT_SHARING_ITEM_FIELDS } from '../constants';

import ContentSharingV2 from '../ContentSharingV2';

const createAPIMock = (fileAPI, folderAPI, usersAPI, collaborationsAPI) => ({
    getFileAPI: jest.fn().mockReturnValue(fileAPI),
    getFolderAPI: jest.fn().mockReturnValue(folderAPI),
    getUsersAPI: jest.fn().mockReturnValue(usersAPI),
    getFileCollaborationsAPI: jest.fn().mockReturnValue(collaborationsAPI),
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
const getCollaborationsMock = jest.fn().mockImplementation(createSuccessMock(MOCK_COLLABORATIONS_RESPONSE));
const getAvatarUrlMock = jest.fn().mockImplementation(userID => mockAvatarURLMap[userID] ?? null);

const defaultAPIMock = createAPIMock(
    { getFile: getDefaultFileMock },
    { getFolderFields: getDefaultFolderMock },
    { getUser: getDefaultUserMock, getAvatarUrlWithAccessToken: getAvatarUrlMock },
    { getCollaborations: getCollaborationsMock },
);

jest.mock('../hooks/useSharingService', () => ({
    useSharingService: jest.fn().mockReturnValue({ sharingService: null }),
}));

const renderComponent = (props = {}): RenderResult =>
    render(
        <ContentSharingV2
            api={defaultAPIMock}
            itemID={MOCK_ITEM.id}
            itemType={MOCK_ITEM.type}
            hasProviders={true}
            {...props}
        />,
    );

describe('elements/content-sharing/ContentSharingV2', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should see the correct elements for files', async () => {
        renderComponent();
        await waitFor(() => {
            expect(getDefaultFileMock).toHaveBeenCalledWith(MOCK_ITEM.id, expect.any(Function), expect.any(Function), {
                fields: CONTENT_SHARING_ITEM_FIELDS,
            });
            expect(screen.getByRole('heading', { name: /Box Development Guide.pdf/i })).toBeVisible();
            expect(screen.getByRole('combobox', { name: 'Invite People' })).toBeVisible();
            expect(screen.getByRole('switch', { name: 'Shared link' })).toBeVisible();
        });
    });

    test('should see the correct elements for folders', async () => {
        renderComponent({ itemType: 'folder' });
        await waitFor(() => {
            expect(getDefaultFolderMock).toHaveBeenCalledWith(
                MOCK_ITEM.id,
                expect.any(Function),
                expect.any(Function),
                {
                    fields: CONTENT_SHARING_ITEM_FIELDS,
                },
            );
            expect(screen.getByRole('heading', { name: 'Share ‘Box Development Guide.pdf’' })).toBeVisible();
            expect(screen.getByRole('combobox', { name: 'Invite People' })).toBeVisible();
            expect(screen.getByRole('switch', { name: 'Shared link' })).toBeVisible();
        });
    });

    test('should see the shared link elements if shared link is present', async () => {
        const apiWithSharedLink = {
            ...defaultAPIMock,
            getFileAPI: jest.fn().mockReturnValue({ getFile: getFileMockWithSharedLink }),
        };
        renderComponent({ api: apiWithSharedLink });
        await waitFor(() => {
            expect(getFileMockWithSharedLink).toHaveBeenCalledWith(
                MOCK_ITEM.id,
                expect.any(Function),
                expect.any(Function),
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
        const apiWithClassification = {
            ...defaultAPIMock,
            getFileAPI: jest.fn().mockReturnValue({ getFile: getFileMockWithClassification }),
        };

        renderComponent({ api: apiWithClassification });
        await waitFor(() => {
            expect(getFileMockWithClassification).toHaveBeenCalledWith(
                MOCK_ITEM.id,
                expect.any(Function),
                expect.any(Function),
                {
                    fields: CONTENT_SHARING_ITEM_FIELDS,
                },
            );
            expect(screen.getByText('BLUE')).toBeVisible();
        });
    });

    test('should process collaborators with avatars correctly', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getCollaborationsMock).toHaveBeenCalledWith(
                MOCK_ITEM.id,
                expect.any(Function),
                expect.any(Function),
            );
            expect(getAvatarUrlMock).toHaveBeenCalledWith('456', MOCK_ITEM.id);
            expect(getAvatarUrlMock).toHaveBeenCalledWith('457', MOCK_ITEM.id);
            expect(getAvatarUrlMock).toHaveBeenCalledWith('458', MOCK_ITEM.id);
        });
    });

    test('should render UnifiedShareModal when sharingService is available', async () => {
        const mockSharingService = {
            changeSharedLinkPermission: jest.fn(),
        };

        (useSharingService as jest.Mock).mockReturnValue({
            sharingService: mockSharingService,
        });

        renderComponent();
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Box Development Guide.pdf/i })).toBeVisible();
        });
    });
});

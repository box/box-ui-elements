import { MOCK_COLLABORATIONS_RESPONSE, MOCK_ITEM } from '../../utils/__mocks__/ContentSharingV2Mocks';
import { TYPE_FILE, TYPE_FOLDER } from '../../../../constants';
import { fetchCollaborators } from '..';
import { createSuccessMock, createCollabAPIMock } from './testUtils';

const getDefaultFileCollabMock = jest.fn().mockImplementation(createSuccessMock(MOCK_COLLABORATIONS_RESPONSE));
const getDefaultFolderCollabMock = jest.fn().mockImplementation(createSuccessMock(MOCK_COLLABORATIONS_RESPONSE));
const defaultAPIMock = createCollabAPIMock(
    { getCollaborations: getDefaultFileCollabMock },
    { getCollaborations: getDefaultFolderCollabMock },
);

describe('content-sharing/apis/fetchCollaborators', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch file collaborators successfully', async () => {
        const result = await fetchCollaborators({ api: defaultAPIMock, itemID: MOCK_ITEM.id, itemType: TYPE_FILE });

        expect(defaultAPIMock.getFileCollaborationsAPI).toHaveBeenCalledWith(false);
        expect(getDefaultFileCollabMock).toHaveBeenCalledWith(MOCK_ITEM.id, expect.any(Function), expect.any(Function));
        expect(result).toEqual(MOCK_COLLABORATIONS_RESPONSE);
    });

    test('should fetch folder collaborators successfully', async () => {
        await fetchCollaborators({ api: defaultAPIMock, itemID: MOCK_ITEM.id, itemType: TYPE_FOLDER });

        expect(defaultAPIMock.getFolderCollaborationsAPI).toHaveBeenCalledWith(false);
        expect(getDefaultFolderCollabMock).toHaveBeenCalledWith(
            MOCK_ITEM.id,
            expect.any(Function),
            expect.any(Function),
        );
    });

    test('should return null for non file or folder type', async () => {
        const result = await fetchCollaborators({ api: defaultAPIMock, itemID: MOCK_ITEM.id, itemType: 'hubs' });

        expect(result).toBeNull();
        expect(defaultAPIMock.getFileCollaborationsAPI).not.toHaveBeenCalled();
        expect(defaultAPIMock.getFolderCollaborationsAPI).not.toHaveBeenCalled();
    });
});

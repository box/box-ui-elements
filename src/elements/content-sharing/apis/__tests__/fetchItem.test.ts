import { TYPE_FILE, TYPE_FOLDER } from '../../../../constants';
import { CONTENT_SHARING_ITEM_FIELDS } from '../../constants';
import { DEFAULT_ITEM_API_RESPONSE, MOCK_ITEM } from '../../utils/__mocks__/ContentSharingV2Mocks';
import { fetchItem } from '..';
import { createSuccessMock, createItemAPIMock } from './testUtils';

const getDefaultFileMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_ITEM_API_RESPONSE));
const getDefaultFolderMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_ITEM_API_RESPONSE));
const defaultAPIMock = createItemAPIMock({ getFile: getDefaultFileMock }, { getFolderFields: getDefaultFolderMock });

describe('content-sharing/apis/fetchItem.ts', () => {
    test('should fetch file item successfully', async () => {
        const result = await fetchItem({ api: defaultAPIMock, itemID: MOCK_ITEM.id, itemType: TYPE_FILE });

        expect(defaultAPIMock.getFileAPI).toHaveBeenCalled();
        expect(getDefaultFileMock).toHaveBeenCalledWith(MOCK_ITEM.id, expect.any(Function), expect.any(Function), {
            fields: CONTENT_SHARING_ITEM_FIELDS,
        });
        expect(result).toEqual(DEFAULT_ITEM_API_RESPONSE);
    });

    test('should fetch folder item successfully', async () => {
        const result = await fetchItem({ api: defaultAPIMock, itemID: MOCK_ITEM.id, itemType: TYPE_FOLDER });

        expect(defaultAPIMock.getFolderAPI).toHaveBeenCalled();
        expect(getDefaultFolderMock).toHaveBeenCalledWith(MOCK_ITEM.id, expect.any(Function), expect.any(Function), {
            fields: CONTENT_SHARING_ITEM_FIELDS,
        });
        expect(result).toEqual(DEFAULT_ITEM_API_RESPONSE);
    });

    test('should return null for non file or folder type', async () => {
        const result = await fetchItem({ api: defaultAPIMock, itemID: MOCK_ITEM.id, itemType: 'hubs' });

        expect(result).toBeNull();
        expect(defaultAPIMock.getFileAPI).not.toHaveBeenCalled();
        expect(defaultAPIMock.getFolderAPI).not.toHaveBeenCalled();
    });

    test('should handle API errors', async () => {
        const errorMock = jest.fn().mockImplementation((itemID, successCallback, errorCallback) => {
            errorCallback(new Error('File API Error'));
        });
        const errorAPIMock = createItemAPIMock({ getFile: errorMock }, { getFolderFields: getDefaultFolderMock });

        await expect(fetchItem({ api: errorAPIMock, itemID: MOCK_ITEM.id, itemType: TYPE_FILE })).rejects.toThrow(
            'File API Error',
        );
    });
});

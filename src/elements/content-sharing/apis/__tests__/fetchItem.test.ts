import { TYPE_FILE, TYPE_FOLDER } from '../../../../constants';
import { CONTENT_SHARING_ITEM_FIELDS } from '../../constants';
import { DEFAULT_ITEM_API_RESPONSE, MOCK_ITEM } from '../../utils/__mocks__/ContentSharingV2Mocks';
import { fetchItem } from '..';
import { createSuccessMock, createItemApiMock } from './testUtils';

const getDefaultFileMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_ITEM_API_RESPONSE));
const getDefaultFolderMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_ITEM_API_RESPONSE));
const defaultApiMock = createItemApiMock({ getFile: getDefaultFileMock }, { getFolderFields: getDefaultFolderMock });

describe('content-sharing/apis/fetchItem.ts', () => {
    test('should fetch file item successfully', async () => {
        const result = await fetchItem({ api: defaultApiMock, itemId: MOCK_ITEM.id, itemType: TYPE_FILE });

        expect(defaultApiMock.getFileAPI).toHaveBeenCalled();
        expect(getDefaultFileMock).toHaveBeenCalledWith(MOCK_ITEM.id, expect.any(Function), expect.any(Function), {
            fields: CONTENT_SHARING_ITEM_FIELDS,
        });
        expect(result).toEqual(DEFAULT_ITEM_API_RESPONSE);
    });

    test('should fetch folder item successfully', async () => {
        const result = await fetchItem({ api: defaultApiMock, itemId: MOCK_ITEM.id, itemType: TYPE_FOLDER });

        expect(defaultApiMock.getFolderAPI).toHaveBeenCalled();
        expect(getDefaultFolderMock).toHaveBeenCalledWith(MOCK_ITEM.id, expect.any(Function), expect.any(Function), {
            fields: CONTENT_SHARING_ITEM_FIELDS,
        });
        expect(result).toEqual(DEFAULT_ITEM_API_RESPONSE);
    });

    test('should return null for non file or folder type', async () => {
        const result = await fetchItem({ api: defaultApiMock, itemId: MOCK_ITEM.id, itemType: 'hubs' });

        expect(result).toBeNull();
        expect(defaultApiMock.getFileAPI).not.toHaveBeenCalled();
        expect(defaultApiMock.getFolderAPI).not.toHaveBeenCalled();
    });

    test('should handle API errors', async () => {
        const errorMock = jest.fn().mockImplementation((itemId, successCallback, errorCallback) => {
            errorCallback(new Error('File API Error'));
        });
        const errorApiMock = createItemApiMock({ getFile: errorMock }, { getFolderFields: getDefaultFolderMock });

        await expect(fetchItem({ api: errorApiMock, itemId: MOCK_ITEM.id, itemType: TYPE_FILE })).rejects.toThrow(
            'File API Error',
        );
    });
});

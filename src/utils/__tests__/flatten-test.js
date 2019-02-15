import FolderAPI from '../../api/Folder';
import FileAPI from '../../api/File';
import WebLinkAPI from '../../api/WebLink';
import Cache from '../Cache';
import flatten from '../flatten';

const list = [
    { id: '1', type: 'folder', name: 'folderName' },
    { id: '2', type: 'file', name: 'fileName' },
    { id: '3', type: 'web_link', name: 'weblinkName' },
];

const newList = [
    { id: '1', type: 'folder', name: 'folderNameNew' },
    { id: '2', type: 'file', name: 'fileNameNew' },
    { id: '3', type: 'web_link', name: 'weblinkNameNew' },
];

const cache = new Cache();
const file = new FileAPI({ cache });
const folder = new FolderAPI({ cache });
const weblink = new WebLinkAPI({ cache });

describe('util/flatten', () => {
    test('should flatten the list and create new cache entries', () => {
        const items = flatten(list, folder, file, weblink);
        expect(items).toEqual(['folder_1', 'file_2', 'web_link_3']);
        expect(folder.getCache().get('folder_1')).toEqual(list[0]);
        expect(file.getCache().get('file_2')).toEqual(list[1]);
        expect(weblink.getCache().get('web_link_3')).toEqual(list[2]);
    });

    test('should flatten the list and merge into existing cache entries', () => {
        expect(folder.getCache().get('folder_1')).toEqual(list[0]);
        expect(file.getCache().get('file_2')).toEqual(list[1]);
        expect(weblink.getCache().get('web_link_3')).toEqual(list[2]);

        const items = flatten(newList, folder, file, weblink);
        expect(items).toEqual(['folder_1', 'file_2', 'web_link_3']);

        expect(folder.getCache().get('folder_1')).toEqual(newList[0]);
        expect(file.getCache().get('file_2')).toEqual(newList[1]);
        expect(weblink.getCache().get('web_link_3')).toEqual(newList[2]);
    });

    test('should throw with a bad type', () => {
        const badList = [{ id: '1', type: 'foo' }];
        expect(flatten.bind(flatten, badList, folder, file, weblink)).toThrow(Error, /Unknown Type/);
    });

    test('should throw with a bad item when no id', () => {
        const badList = [{ type: 'foo' }];
        expect(flatten.bind(flatten, badList, folder, file, weblink)).toThrow(Error, /Bad box item/);
    });

    test('should throw with a bad item when no type', () => {
        const badList = [{ id: 'foo' }];
        expect(flatten.bind(flatten, badList, folder, file, weblink)).toThrow(Error, /Bad box item/);
    });
});

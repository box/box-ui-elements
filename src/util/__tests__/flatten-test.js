import Cache from '../Cache';
import FolderAPI from '../../api/Folder';
import FileAPI from '../../api/File';
import WebLinkAPI from '../../api/WebLink';
import flatten from '../flatten';

const list = [
    { id: '1', type: 'folder', name: 'folderName' },
    { id: '2', type: 'file', name: 'fileName' },
    { id: '3', type: 'web_link', name: 'weblinkName' }
];

const newList = [
    { id: '1', type: 'folder', name: 'folderNameNew' },
    { id: '2', type: 'file', name: 'fileNameNew' },
    { id: '3', type: 'web_link', name: 'weblinkNameNew' }
];

const cache = new Cache();
const file = new FileAPI({ cache });
const folder = new FolderAPI({ cache });
const weblink = new WebLinkAPI({ cache });

describe('flatten', () => {
    it('should flatten the list and create new cache entries', () => {
        const items = flatten(list, folder, file, weblink);
        expect(items).to.deep.equal(['folder_1', 'file_2', 'web_link_3']);
        expect(folder.getCache().get('folder_1')).to.deep.equal(list[0]);
        expect(file.getCache().get('file_2')).to.deep.equal(list[1]);
        expect(weblink.getCache().get('web_link_3')).to.deep.equal(list[2]);
    });

    it('should flatten the list and merge into existing cache entries', () => {
        expect(folder.getCache().get('folder_1')).to.deep.equal(list[0]);
        expect(file.getCache().get('file_2')).to.deep.equal(list[1]);
        expect(weblink.getCache().get('web_link_3')).to.deep.equal(list[2]);

        const items = flatten(newList, folder, file, weblink);
        expect(items).to.deep.equal(['folder_1', 'file_2', 'web_link_3']);

        expect(folder.getCache().get('folder_1')).to.deep.equal(newList[0]);
        expect(file.getCache().get('file_2')).to.deep.equal(newList[1]);
        expect(weblink.getCache().get('web_link_3')).to.deep.equal(newList[2]);
    });

    it('should throw with a bad type', () => {
        const badList = [{ id: '1', type: 'foo' }];
        expect(flatten.bind(flatten, badList, folder, file, weblink)).to.throw(Error, /Unknown Type/);
    });
});

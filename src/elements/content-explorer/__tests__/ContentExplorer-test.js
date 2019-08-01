import React from 'react';
import { mount } from 'enzyme';
import noop from 'lodash/noop';
import { ContentExplorerComponent as ContentExplorer } from '../ContentExplorer';
import { FOLDER_FIELDS_TO_FETCH } from '../../../utils/fields';
import { FIELD_REPRESENTATIONS, VIEW_MODE_GRID } from '../../../constants';

jest.mock('../../common/header/Header', () => 'mock-header');
jest.mock('../../common/sub-header/SubHeader', () => 'mock-subheader');
jest.mock('../Content', () => 'mock-content');
jest.mock('../../common/upload-dialog/UploadDialog', () => 'mock-uploaddialog');
jest.mock('../../common/create-folder-dialog/CreateFolderDialog', () => 'mock-createfolderdialog');
jest.mock('../DeleteConfirmationDialog', () => 'mock-deletedialog');
jest.mock('../RenameDialog', () => 'mock-renamedialog');
jest.mock('../ShareDialog', () => 'mock-sharedialog');
jest.mock('../PreviewDialog', () => 'mock-previewdialog');

describe('elements/content-explorer/ContentExplorer', () => {
    let rootElement;
    const getWrapper = (props = {}) => mount(<ContentExplorer {...props} />, { attachTo: rootElement });

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('uploadSuccessHandler()', () => {
        test('should force reload the files list', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState({
                currentCollection: {
                    id: '123',
                },
            });
            instance.fetchFolder = jest.fn();
            instance.uploadSuccessHandler();
            expect(instance.fetchFolder).toHaveBeenCalledWith('123', false);
        });
    });

    describe('changeViewMode()', () => {
        const localStoreViewMode = 'bce.defaultViewMode';

        test('should change to grid view', () => {
            const wrapper = getWrapper({ features: { contentExplorer: { gridView: { enabled: true } } } });
            const instance = wrapper.instance();
            instance.store.setItem = jest.fn();
            instance.changeViewMode(VIEW_MODE_GRID);
            expect(instance.store.setItem).toHaveBeenCalledWith(localStoreViewMode, VIEW_MODE_GRID);
        });
    });

    describe('fetchFolder()', () => {
        const getFolder = jest.fn();
        const getFolderAPI = jest.fn().mockReturnValue({
            getFolder,
        });

        let wrapper;
        let instance;

        test('should fetch folder without representations field if grid view is not enabled', () => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = { getFolderAPI };
            instance.setState = jest.fn();
            instance.fetchFolder();
            expect(instance.setState).toHaveBeenCalled();
            expect(getFolder).toHaveBeenCalledWith(
                '0',
                50,
                0,
                'name',
                'ASC',
                expect.any(Function),
                expect.any(Function),
                { forceFetch: true, fields: FOLDER_FIELDS_TO_FETCH },
            );
        });

        test('should fetch folder with representations field if grid view is enabled', () => {
            wrapper = getWrapper({ features: { contentExplorer: { gridView: { enabled: true } } } });
            instance = wrapper.instance();
            instance.api = { getFolderAPI };
            instance.setState = jest.fn();
            instance.fetchFolder();
            expect(instance.setState).toHaveBeenCalled();
            expect(getFolder).toHaveBeenCalledWith(
                '0',
                50,
                0,
                'name',
                'ASC',
                expect.any(Function),
                expect.any(Function),
                { forceFetch: true, fields: [...FOLDER_FIELDS_TO_FETCH, FIELD_REPRESENTATIONS] },
            );
        });
    });

    describe('fetchFolderSuccessCallback()', () => {
        const item = { id: 1 };
        const collection = { boxItem: {}, id: '0', items: [item], name: 'name' };
        const thumbnailUrl = 'thumbnailUrl';
        const getThumbnailUrl = jest.fn().mockReturnValue(thumbnailUrl);
        const getFileAPI = jest.fn().mockReturnValue({
            getThumbnailUrl,
        });

        let wrapper;
        let instance;

        test('thumbnail url should not be assigned to item if grid view is not enabled', () => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = { getFileAPI };
            instance.setState = jest.fn();
            instance.closeModals = jest.fn();
            instance.updateCollection = jest.fn();

            return instance.fetchFolderSuccessCallback(collection, false).then(() => {
                expect(instance.setState).toHaveBeenCalled();
                expect(instance.closeModals).toHaveBeenCalled();
                expect(instance.updateCollection).toHaveBeenCalledWith(collection, undefined);
            });
        });

        test('thumbnail url should be assigned to item if grid view is enabled', () => {
            wrapper = getWrapper({ features: { contentExplorer: { gridView: { enabled: true } } } });
            instance = wrapper.instance();
            instance.api = { getFileAPI };
            instance.setState = jest.fn();
            instance.closeModals = jest.fn();
            instance.updateCollection = jest.fn();

            return instance.fetchFolderSuccessCallback(collection, false).then(() => {
                expect(instance.setState).toHaveBeenCalled();
                expect(instance.closeModals).toHaveBeenCalled();
                expect(instance.updateCollection).toHaveBeenCalledWith(
                    { ...collection, items: [{ ...item, thumbnailUrl }] },
                    undefined,
                );
            });
        });
    });

    describe('updateCollection()', () => {
        const item1 = { id: 1 };
        const item2 = { id: 2 };
        const collection = { boxItem: {}, id: '0', items: [item1, item2], name: 'name' };

        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState({ currentCollection: collection, selected: undefined });
            instance.setState = jest.fn();
        });

        test('should set same collection and no selected item to state if no items present in collection', () => {
            const noItemsCollection = { ...collection, items: null };

            instance.updateCollection(noItemsCollection, { id: 3 });

            expect(instance.setState).toHaveBeenCalledWith(
                { currentCollection: noItemsCollection, selected: undefined },
                noop,
            );
        });

        test('should update the collection items selected to false even if selected item is not in the collection', () => {
            const expectedItem1 = { id: 1, selected: false };
            const expectedItem2 = { id: 2, selected: false };
            const expectedCollection = { boxItem: {}, id: '0', items: [expectedItem1, expectedItem2], name: 'name' };

            instance.updateCollection(collection, { id: 3 });

            expect(instance.setState).toHaveBeenCalledWith(
                { currentCollection: expectedCollection, selected: undefined },
                noop,
            );
        });

        test('should update the collection items selected to false except for the selected item in the collection', () => {
            const expectedItem1 = { id: 1, selected: false };
            const expectedItem2 = { id: 2, selected: true };
            const expectedCollection = { boxItem: {}, id: '0', items: [expectedItem1, expectedItem2], name: 'name' };

            instance.updateCollection(collection, { id: 2 });

            expect(instance.setState).toHaveBeenCalledWith(
                { currentCollection: expectedCollection, selected: expectedItem2 },
                noop,
            );
        });

        test('should update the selected item in the collection', () => {
            const expectedItem1 = { id: 1, selected: false };
            const expectedItem2 = { id: 2, selected: true, newProperty: 'newProperty' };
            const expectedCollection = { boxItem: {}, id: '0', items: [expectedItem1, expectedItem2], name: 'name' };

            instance.updateCollection(collection, { id: 2, newProperty: 'newProperty' });

            expect(instance.setState).toHaveBeenCalledWith(
                { currentCollection: expectedCollection, selected: { ...expectedItem2, newProperty: 'newProperty' } },
                noop,
            );
        });
    });
});

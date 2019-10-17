import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { mount } from 'enzyme';
import noop from 'lodash/noop';
import { ContentExplorerComponent as ContentExplorer } from '../ContentExplorer';
import { FOLDER_FIELDS_TO_FETCH } from '../../../utils/fields';
import { VIEW_MODE_GRID } from '../../../constants';

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
            const wrapper = getWrapper();
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
    });

    describe('fetchFolderSuccessCallback()', () => {
        const collection = { name: 'collection ' };

        test('updateCollection should be called with a callback', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.closeModals = jest.fn();
            instance.updateCollection = jest.fn();

            instance.fetchFolderSuccessCallback(collection, false);
            expect(instance.closeModals).toHaveBeenCalled();
            expect(instance.updateCollection).toHaveBeenCalledWith(collection, undefined, expect.any(Function));
        });
    });

    describe('recentsSuccessCallback()', () => {
        const collection = { name: 'collection ' };

        test('navigation event should not be triggered if argument set to false', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.updateCollection = jest.fn();

            instance.recentsSuccessCallback(collection, false);
            expect(instance.updateCollection).toHaveBeenCalledWith(collection);
        });

        test('navigation event should be triggered if argument set to true ', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.updateCollection = jest.fn();

            instance.recentsSuccessCallback(collection, true);
            expect(instance.updateCollection).toHaveBeenCalledWith(collection, undefined, instance.finishNavigation);
        });
    });

    describe('updateCollection()', () => {
        describe('selection', () => {
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
                const noItemsCollection = { ...collection, items: undefined };
                const expectedCollection = { ...collection, items: [] };

                instance.updateCollection(noItemsCollection, { id: 3 }).then(() => {
                    expect(instance.setState).toHaveBeenCalledWith(
                        { currentCollection: expectedCollection, selected: undefined },
                        noop,
                    );
                });
            });

            test('should update the collection items selected to false even if selected item is not in the collection', () => {
                const expectedItem1 = { id: 1, selected: false, thumbnailUrl: null };
                const expectedItem2 = { id: 2, selected: false, thumbnailUrl: null };
                const expectedCollection = {
                    boxItem: {},
                    id: '0',
                    items: [expectedItem1, expectedItem2],
                    name: 'name',
                };

                instance.updateCollection(collection, { id: 3 }).then(() => {
                    expect(instance.setState).toHaveBeenCalledWith(
                        { currentCollection: expectedCollection, selected: undefined },
                        noop,
                    );
                });
            });

            test('should update the collection items selected to false except for the selected item in the collection', () => {
                const expectedItem1 = { id: 1, selected: false, thumbnailUrl: null };
                const expectedItem2 = { id: 2, selected: true, thumbnailUrl: null };
                const expectedCollection = {
                    boxItem: {},
                    id: '0',
                    items: [expectedItem1, expectedItem2],
                    name: 'name',
                };

                instance.updateCollection(collection, { id: 2 }).then(() => {
                    expect(instance.setState).toHaveBeenCalledWith(
                        { currentCollection: expectedCollection, selected: expectedItem2 },
                        noop,
                    );
                });
            });

            test('should update the selected item in the collection', () => {
                const expectedItem1 = { id: 1, selected: false, thumbnailUrl: null };
                const expectedItem2 = { id: 2, selected: true, newProperty: 'newProperty', thumbnailUrl: null };
                const expectedCollection = {
                    boxItem: {},
                    id: '0',
                    items: [expectedItem1, expectedItem2],
                    name: 'name',
                };

                instance.updateCollection(collection, { id: 2, newProperty: 'newProperty' }).then(() => {
                    expect(instance.setState).toHaveBeenCalledWith(
                        {
                            currentCollection: expectedCollection,
                            selected: { ...expectedItem2, newProperty: 'newProperty' },
                        },
                        noop,
                    );
                });
            });
        });

        describe('thumbnails', () => {
            const baseItem = { id: '1', selected: true };
            const baseCollection = {
                boxItem: {},
                id: '0',
                items: [baseItem],
                name: 'collectionName',
                selected: baseItem,
            };
            const thumbnailUrl = 'thumbnailUrl';
            const getThumbnailUrl = jest.fn().mockReturnValue(thumbnailUrl);
            const getFileAPI = jest.fn().mockReturnValue({
                getThumbnailUrl,
            });
            const callback = jest.fn();

            let wrapper;
            let instance;
            let collection;
            let item;

            beforeEach(() => {
                collection = cloneDeep(baseCollection);
                item = cloneDeep(baseItem);
            });

            test('should add thumbnailUrl', () => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = { getFileAPI };
                instance.setState = jest.fn();

                return instance.updateCollection(collection, item, callback).then(() => {
                    const newSelected = { ...item, thumbnailUrl };
                    const newCollection = { ...collection, items: [newSelected] };

                    expect(instance.setState).toHaveBeenCalledWith(
                        { currentCollection: newCollection, selected: newSelected },
                        callback,
                    );
                });
            });
        });
    });

    describe('lifecycle methods', () => {
        test('componentDidUpdate', () => {
            const props = {
                currentFolderId: '123',
            };

            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            instance.fetchFolder = jest.fn();

            wrapper.setProps({ currentFolderId: '345' });

            expect(instance.fetchFolder).toBeCalledWith('345');
        });
    });

    describe('getMaxNumberOfGridViewColumnsForWidth()', () => {
        test('should be able to display 7 columns if isVeryLarge', () => {
            const wrapper = getWrapper({ isVeryLarge: true });
            const instance = wrapper.instance();
            expect(instance.getMaxNumberOfGridViewColumnsForWidth()).toBe(7);
        });

        test('should only be able to display 5 columns if isLarge', () => {
            const wrapper = getWrapper({ isLarge: true });
            const instance = wrapper.instance();
            expect(instance.getMaxNumberOfGridViewColumnsForWidth()).toBe(5);
        });

        test('should only be able to display 3 columns if isMedium', () => {
            const wrapper = getWrapper({ isMedium: true });
            const instance = wrapper.instance();
            expect(instance.getMaxNumberOfGridViewColumnsForWidth()).toBe(3);
        });

        test('should only be able to display 1 column if isSmall', () => {
            const wrapper = getWrapper({ isSmall: true });
            const instance = wrapper.instance();
            expect(instance.getMaxNumberOfGridViewColumnsForWidth()).toBe(1);
        });
    });
});

import React, { act } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { mount } from 'enzyme';
import noop from 'lodash/noop';
import { ContentExplorerComponent as ContentExplorer } from '../ContentExplorer';
import UploadDialog from '../../common/upload-dialog';
import { isThumbnailAvailable } from '../../common/utils';
import CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH from '../constants';
import { VIEW_MODE_GRID } from '../../../constants';

jest.mock('../../common/utils');
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
        rootElement.appendChild(document.createElement('div'));
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('uploadSuccessHandler()', () => {
        test('should force reload the files list', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            act(() => {
                instance.setState({
                    currentCollection: {
                        id: '123',
                    },
                });
            });

            instance.fetchFolder = jest.fn();

            act(() => {
                instance.uploadSuccessHandler();
            });

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
                { forceFetch: true, fields: CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH },
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
            const baseItem = { id: '1', selected: true, type: 'file' };
            const baseCollection = {
                boxItem: {},
                id: '0',
                items: [baseItem],
                name: 'collectionName',
                selected: baseItem,
            };
            const thumbnailUrl = 'thumbnailUrl';
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
                const getThumbnailUrl = jest.fn().mockReturnValue(thumbnailUrl);
                const getFileAPI = jest.fn().mockReturnValue({
                    getThumbnailUrl,
                });
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
            test('should not call attemptThumbnailGeneration if thumbnail is null', () => {
                const getThumbnailUrl = jest.fn().mockReturnValue(null);
                const getFileAPI = jest.fn().mockReturnValue({
                    getThumbnailUrl,
                });

                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = { getFileAPI };
                instance.setState = jest.fn();
                instance.attemptThumbnailGeneration = jest.fn();

                return instance.updateCollection(collection, item, callback).then(() => {
                    expect(instance.attemptThumbnailGeneration).not.toHaveBeenCalled();
                });
            });

            test('should not call attemptThumbnailGeneration if isThumbnailAvailable is true', () => {
                const getThumbnailUrl = jest.fn().mockReturnValue(null);
                const getFileAPI = jest.fn().mockReturnValue({
                    getThumbnailUrl,
                });

                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = { getFileAPI };
                instance.setState = jest.fn();
                instance.attemptThumbnailGeneration = jest.fn();
                isThumbnailAvailable.mockReturnValue(true);

                return instance.updateCollection(collection, item, callback).then(() => {
                    expect(instance.attemptThumbnailGeneration).not.toHaveBeenCalled();
                });
            });

            test('should call attemptThumbnailGeneration if isThumbnailAvailable is false', () => {
                const getThumbnailUrl = jest.fn().mockReturnValue(thumbnailUrl);
                const getFileAPI = jest.fn().mockReturnValue({
                    getThumbnailUrl,
                });

                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = { getFileAPI };
                instance.setState = jest.fn();
                instance.attemptThumbnailGeneration = jest.fn();
                isThumbnailAvailable.mockReturnValue(false);

                return instance.updateCollection(collection, item, callback).then(() => {
                    expect(instance.attemptThumbnailGeneration).toHaveBeenCalled();
                });
            });

            test('should not call attemptThumbnailGeneration or getThumbnailUrl if item is not file', () => {
                const getThumbnailUrl = jest.fn().mockReturnValue(thumbnailUrl);
                const getFileAPI = jest.fn().mockReturnValue({
                    getThumbnailUrl,
                });

                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = { getFileAPI };
                instance.setState = jest.fn();
                instance.attemptThumbnailGeneration = jest.fn();
                isThumbnailAvailable.mockReturnValue(false);

                collection.items[0].type = 'folder';
                return instance.updateCollection(collection, item, callback).then(() => {
                    expect(instance.attemptThumbnailGeneration).not.toHaveBeenCalled();
                    expect(getThumbnailUrl).not.toHaveBeenCalled();
                });
            });
        });

        describe('attemptThumbnailGeneration()', () => {
            const entry1 = { name: 'entry1', updated: false };
            const entry2 = { name: 'entry2', updated: false };
            const itemWithRepresentation = { representations: { entries: [entry1, entry2] } };
            const itemWithoutRepresentation = { name: 'item' };

            let wrapper;
            let instance;

            test('should not update item in collection if grid view is not enabled', () => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.updateItemInCollection = jest.fn();
                return instance.attemptThumbnailGeneration(itemWithRepresentation).then(() => {
                    expect(instance.updateItemInCollection).not.toHaveBeenCalled();
                });
            });

            test('should not update item in collection if item does not have representation', () => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.updateItemInCollection = jest.fn();
                return instance.attemptThumbnailGeneration(itemWithoutRepresentation).then(() => {
                    expect(instance.updateItemInCollection).not.toHaveBeenCalled();
                });
            });

            test('should not update item in collection if updated representation matches given representation', () => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.updateItemInCollection = jest.fn();
                instance.api = {
                    getFileAPI: jest
                        .fn()
                        .mockReturnValue({ generateRepresentation: jest.fn().mockReturnValue(entry1) }),
                };
                return instance.attemptThumbnailGeneration(itemWithRepresentation).then(() => {
                    expect(instance.updateItemInCollection).not.toHaveBeenCalled();
                });
            });

            test('should update item in collection if representation is updated', () => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.updateItemInCollection = jest.fn();
                instance.api = {
                    getFileAPI: jest.fn().mockReturnValue({
                        generateRepresentation: jest.fn().mockReturnValue({ ...entry1, updated: true }),
                    }),
                };
                return instance.attemptThumbnailGeneration(itemWithRepresentation).then(() => {
                    expect(instance.updateItemInCollection).toHaveBeenCalledWith({
                        ...itemWithRepresentation,
                        representations: { entries: [{ ...entry1, updated: true }, entry2] },
                    });
                });
            });
        });

        describe('updateItemInCollection()', () => {
            const item1 = { id: '1', updated: false };
            const item2 = { id: '2', updated: false };
            const baseCollection = { items: [item1, item2] };

            let wrapper;
            let instance;

            beforeEach(() => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                act(() => {
                    instance.setState({ currentCollection: baseCollection });
                });
                instance.setState = jest.fn();
            });

            test('should not update collection if matching id is not present in collection', () => {
                const item3 = { id: '3', updated: true };
                act(() => {
                    instance.updateItemInCollection(item3);
                });
                expect(instance.setState).toHaveBeenCalledWith({ currentCollection: baseCollection });
            });

            test('should update collection if matching id is present in collection', () => {
                const newItem2 = { id: '2', updated: true };
                act(() => {
                    instance.updateItemInCollection(newItem2);
                });
                expect(instance.setState).toHaveBeenCalledWith({
                    currentCollection: { ...baseCollection, items: [item1, newItem2] },
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

    describe('updateMetadata()', () => {
        test('should update metadata for given Box item, field, old and new values', () => {
            const item = {};
            const field = 'amount';
            const oldValue = 'abc';
            const newValue = 'pqr';

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.metadataQueryAPIHelper = {
                updateMetadata: jest.fn(),
            };

            instance.updateMetadata(item, field, oldValue, newValue);
            expect(instance.metadataQueryAPIHelper.updateMetadata).toHaveBeenCalledWith(
                item,
                field,
                oldValue,
                newValue,
                expect.any(Function),
                instance.errorCallback,
            );
        });
    });

    describe('updateMetadataSuccessCallback()', () => {
        test('should correctly update the current collection and set the state', () => {
            const boxItem = { id: 2 };
            const field = 'amount';
            const newValue = 111.22;
            const collectionItem1 = {
                id: 1,
                metadata: {
                    enterprise: {
                        fields: [
                            {
                                name: 'name',
                                key: 'name',
                                value: 'abc',
                                type: 'string',
                            },
                            {
                                name: 'amount',
                                key: 'amount',
                                value: 100.34,
                                type: 'float',
                            },
                        ],
                    },
                },
            };
            const collectionItem2 = {
                id: 2,
                metadata: {
                    enterprise: {
                        fields: [
                            {
                                name: 'name',
                                key: 'name',
                                value: 'pqr',
                                type: 'string',
                            },
                            {
                                name: 'amount',
                                key: 'amount',
                                value: 354.23,
                                type: 'float',
                            },
                        ],
                    },
                },
            };
            const clonedCollectionItem2 = cloneDeep(collectionItem2);
            const nextMarker = 'markermarkermarkermarkermarkermarker';
            const currentCollection = {
                items: [collectionItem1, collectionItem2],
                nextMarker,
            };
            const wrapper = getWrapper();

            // update the metadata
            clonedCollectionItem2.metadata.enterprise.fields.find(item => item.key === field).value = newValue;

            const updatedItems = [collectionItem1, clonedCollectionItem2];

            act(() => {
                wrapper.setState({ currentCollection });
            });

            const instance = wrapper.instance();
            instance.setState = jest.fn();
            act(() => {
                instance.updateMetadataSuccessCallback(boxItem, field, newValue);
            });
            expect(instance.setState).toHaveBeenCalledWith({
                currentCollection: {
                    items: updatedItems,
                    nextMarker,
                    percentLoaded: 100,
                },
            });
        });
    });

    describe('handleSharedLinkSuccess()', () => {
        const getApiShareMock = jest.fn().mockImplementation((item, access, callback) => callback());
        const getApiMock = jest.fn().mockReturnValue({ share: getApiShareMock });
        const updateCollectionMock = jest.fn();

        const boxItem = {
            shared_link: 'not null',
            permissions: {
                can_share: true,
                can_set_share_access: false,
            },
            type: 'file',
        };

        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = { getAPI: getApiMock };
            instance.updateCollection = updateCollectionMock;
        });

        afterEach(() => {
            getApiMock.mockClear();
            getApiShareMock.mockClear();
            updateCollectionMock.mockClear();
        });

        test('should create shared link if it does not exist', async () => {
            await instance.handleSharedLinkSuccess({ ...boxItem, shared_link: null });

            expect(getApiMock).toBeCalledTimes(1);
            expect(getApiShareMock).toBeCalledTimes(1);
            expect(updateCollectionMock).toBeCalledTimes(1);
        });

        test('should not create shared link if it already exists', async () => {
            await instance.handleSharedLinkSuccess(boxItem);

            expect(getApiMock).not.toBeCalled();
            expect(getApiShareMock).not.toBeCalled();
            expect(updateCollectionMock).toBeCalledTimes(1);
        });
    });

    describe('render()', () => {
        test('should render UploadDialog with contentUploaderProps', () => {
            const contentUploaderProps = {
                apiHost: 'https://api.box.com',
                chunked: false,
            };
            const wrapper = getWrapper({ canUpload: true, contentUploaderProps });
            act(() => {
                wrapper.setState({
                    currentCollection: {
                        permissions: {
                            can_upload: true,
                        },
                    },
                });
            });
            const uploadDialogElement = wrapper.find(UploadDialog);
            expect(uploadDialogElement.length).toBe(1);
            expect(uploadDialogElement.prop('contentUploaderProps')).toEqual(contentUploaderProps);
        });

        test('should render test id for e2e testing', () => {
            const wrapper = getWrapper();
            expect(wrapper.find('[data-testid="content-explorer"]')).toHaveLength(1);
        });
    });

    describe('deleteCallback', () => {
        const getApiDeleteMock = jest.fn();
        const getApiMock = jest.fn().mockReturnValue({ deleteItem: getApiDeleteMock });
        const refreshCollectionMock = jest.fn();
        const onDeleteMock = jest.fn();
        const boxItem = {
            id: '123',
            parent: {
                id: '122',
            },
            permissions: {
                can_delete: true,
            },
            type: 'file',
        };

        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper({
                canDelete: true,
                onDelete: onDeleteMock,
            });
            instance = wrapper.instance();
            instance.api = { getAPI: getApiMock, getCache: jest.fn() };
            instance.refreshCollection = refreshCollectionMock;
            act(() => {
                instance.setState({
                    selected: boxItem,
                    isDeleteModalOpen: true,
                });
            });
        });

        afterEach(() => {
            getApiMock.mockClear();
            getApiDeleteMock.mockClear();
            refreshCollectionMock.mockClear();
        });

        test('should call refreshCollection and onDelete callback on success', async () => {
            getApiDeleteMock.mockImplementation((item, successCallback) => successCallback());
            act(() => {
                instance.deleteCallback();
            });
            expect(getApiMock).toBeCalledTimes(1);
            expect(getApiDeleteMock).toBeCalledTimes(1);
            expect(onDeleteMock).toBeCalledTimes(1);
            expect(refreshCollectionMock).toBeCalledTimes(1);
        });

        test('should call refreshCollection on error', async () => {
            getApiDeleteMock.mockImplementation((item, successCallback, errorCallback) => errorCallback());
            act(() => {
                instance.deleteCallback();
            });

            expect(getApiMock).toBeCalledTimes(1);
            expect(getApiDeleteMock).toBeCalledTimes(1);
            expect(onDeleteMock).not.toBeCalled();
            expect(refreshCollectionMock).toBeCalledTimes(1);
        });
    });
});

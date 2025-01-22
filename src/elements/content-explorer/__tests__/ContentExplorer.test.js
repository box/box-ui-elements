import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import * as utils from '../utils';
import { ContentExplorerComponent as ContentExplorer } from '../ContentExplorer';
import CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH, { GRID_VIEW_MIN_COLUMNS } from '../constants';
import { VIEW_MODE_GRID, VIEW_MODE_LIST } from '../../../constants';
import { render, screen, act } from '../../../test-utils/testing-library.tsx';
import APIFactory from './__mocks__/APIFactory';

jest.mock('../../common/header/Header', () => {
    const MockHeader = ({ className }) => (
        <div data-testid="mock-header" className={className}>
            mock-header
        </div>
    );
    return MockHeader;
});
jest.mock('../../common/sub-header/SubHeader', () => {
    const MockSubHeader = ({
        className,
        onItemClick,
        onUpload,
        onCreate,
        onGridViewSliderChange,
        onSortChange,
        onViewModeChange,
    }) => {
        const handleClick = e => {
            if (onItemClick) onItemClick(e);
            if (onUpload) onUpload(e);
            if (onCreate) onCreate(e);
            if (onGridViewSliderChange) onGridViewSliderChange(e);
            if (onSortChange) onSortChange(e);
            if (onViewModeChange) onViewModeChange(e);
        };

        const handleKeyPress = e => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleClick(e);
            }
        };

        return (
            <div
                data-testid="mock-subheader"
                className={className}
                onClick={handleClick}
                onKeyPress={handleKeyPress}
                role="button"
                tabIndex={0}
            >
                mock-subheader
            </div>
        );
    };
    return MockSubHeader;
});
jest.mock('../Content', () => {
    const MockContent = ({
        className,
        onItemClick,
        onItemSelect,
        onItemDelete,
        onItemDownload,
        onItemPreview,
        onItemRename,
        onItemShare,
        onMetadataUpdate,
    }) => {
        const handleClick = e => {
            if (onItemClick) onItemClick(e);
            if (onItemSelect) onItemSelect(e);
            if (onItemDelete) onItemDelete(e);
            if (onItemDownload) onItemDownload(e);
            if (onItemPreview) onItemPreview(e);
            if (onItemRename) onItemRename(e);
            if (onItemShare) onItemShare(e);
            if (onMetadataUpdate) onMetadataUpdate(e);
        };

        const handleKeyPress = e => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleClick(e);
            }
        };

        return (
            <div
                data-testid="mock-content"
                className={className}
                onClick={handleClick}
                onKeyPress={handleKeyPress}
                role="button"
                tabIndex={0}
            >
                mock-content
            </div>
        );
    };
    return MockContent;
});
jest.mock('../../common/upload-dialog/UploadDialog', () => {
    const MockUploadDialog = () => (
        <div data-testid="mock-uploaddialog" className="mock-uploaddialog">
            mock-uploaddialog
        </div>
    );
    return MockUploadDialog;
});
jest.mock('../../common/create-folder-dialog/CreateFolderDialog', () => {
    const MockCreateFolderDialog = ({ className }) => (
        <div data-testid="mock-createfolderdialog" className={className}>
            mock-createfolderdialog
        </div>
    );
    return MockCreateFolderDialog;
});

// Mock API class
// Mock the API module
jest.mock('../../../api/index', () => {
    const MockAPIFactory = require('./__mocks__/APIFactory').default;
    return MockAPIFactory;
});
jest.mock('../DeleteConfirmationDialog', () => {
    const MockDeleteDialog = ({ className }) => (
        <div data-testid="mock-deletedialog" className={className}>
            mock-deletedialog
        </div>
    );
    return MockDeleteDialog;
});
jest.mock('../RenameDialog', () => {
    const MockRenameDialog = ({ className }) => (
        <div data-testid="mock-renamedialog" className={className}>
            mock-renamedialog
        </div>
    );
    return MockRenameDialog;
});
jest.mock('../ShareDialog', () => {
    const MockShareDialog = ({ className }) => (
        <div data-testid="mock-sharedialog" className={className}>
            mock-sharedialog
        </div>
    );
    return MockShareDialog;
});
jest.mock('../PreviewDialog', () => {
    const MockPreviewDialog = ({ className }) => (
        <div data-testid="mock-previewdialog" className={className}>
            mock-previewdialog
        </div>
    );
    return MockPreviewDialog;
});

describe('elements/content-explorer/ContentExplorer', () => {
    beforeEach(() => {
        jest.resetModules();
        APIFactory.resetMocks();
        // Reset all individual mock functions
        jest.clearAllMocks();
    });
    const getWrapper = (props = {}) => {
        const ref = React.createRef();
        render(<ContentExplorer ref={ref} {...props} />);

        // Initialize API in a single act to ensure synchronous setup
        const mockAPI = APIFactory.createMockAPI();
        act(() => {
            if (ref.current) {
                ref.current.api = mockAPI;
            }
        });

        const wrapper = {
            instance: () => {
                const instance = ref.current;
                if (!instance.api) {
                    instance.api = mockAPI;
                }
                return instance;
            },
            setState: state => {
                act(() => {
                    ref.current.setState(state);
                });
            },
            setProps: newProps => {
                act(() => {
                    render(<ContentExplorer ref={ref} {...props} {...newProps} />);
                    if (ref.current) {
                        ref.current.api = mockAPI;
                    }
                });
            },
        };
        return wrapper;
    };

    // Removed unused renderComponent function - using getWrapper instead

    describe('uploadSuccessHandler()', () => {
        test('should force reload the files list', async () => {
            // Create a ref to access component methods
            const ref = React.createRef();
            const mockAPI = APIFactory.createMockAPI();
            render(<ContentExplorer ref={ref} />);

            // Initialize API and set initial state
            await act(async () => {
                ref.current.api = mockAPI;
                ref.current.setState({
                    currentCollection: {
                        id: '123',
                    },
                });
            });

            // Mock fetchFolder method
            ref.current.fetchFolder = jest.fn();

            // Trigger upload success
            await act(async () => {
                ref.current.uploadSuccessHandler();
            });

            // Verify fetchFolder was called with correct arguments
            expect(ref.current.fetchFolder).toHaveBeenCalledWith('123', false);
        });
    });

    describe('changeViewMode()', () => {
        const localStoreViewMode = 'bce.defaultViewMode';

        test('should change to grid view', async () => {
            const ref = React.createRef();
            render(<ContentExplorer ref={ref} />);

            // Mock store.setItem
            ref.current.store.setItem = jest.fn();

            // Change view mode
            await act(async () => {
                ref.current.changeViewMode(VIEW_MODE_GRID);
            });

            // Verify store was updated
            expect(ref.current.store.setItem).toHaveBeenCalledWith(localStoreViewMode, VIEW_MODE_GRID);
        });
    });

    describe('fetchFolder()', () => {
        let wrapper;
        let instance;

        test('should fetch folder without representations field if grid view is not enabled', () => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = APIFactory.createMockAPI();
            instance.setState = jest.fn();
            instance.fetchFolder();
            expect(instance.setState).toHaveBeenCalled();
            expect(APIFactory.mockGetFolder).toHaveBeenCalledWith(
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
                act(() => {
                    instance.setState({ currentCollection: collection, selected: undefined });
                });
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
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = APIFactory.createMockAPI();
                APIFactory.mockGetThumbnailUrl.mockReturnValue(thumbnailUrl);
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
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = APIFactory.createMockAPI();
                APIFactory.mockGetThumbnailUrl.mockReturnValue(null);
                instance.setState = jest.fn();
                instance.attemptThumbnailGeneration = jest.fn();

                return instance.updateCollection(collection, item, callback).then(() => {
                    expect(instance.attemptThumbnailGeneration).not.toHaveBeenCalled();
                });
            });

            test('should not call attemptThumbnailGeneration if isThumbnailReady is true', () => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = APIFactory.createMockAPI();
                APIFactory.mockGetThumbnailUrl.mockReturnValue(null);
                instance.setState = jest.fn();
                instance.attemptThumbnailGeneration = jest.fn();
                utils.isThumbnailReady = jest.fn().mockReturnValue(true);

                return instance.updateCollection(collection, item, callback).then(() => {
                    expect(instance.attemptThumbnailGeneration).not.toHaveBeenCalled();
                });
            });

            test('should call attemptThumbnailGeneration if isThumbnailReady is false and in grid view', async () => {
                const ref = React.createRef();

                // Set up mock API with thumbnail generation capabilities
                const mockGenerateRepresentation = jest.fn().mockResolvedValue({ representation: 'updated_rep' });
                const mockGetThumbnailUrl = jest.fn().mockResolvedValue(thumbnailUrl);
                const mockAPI = APIFactory.createMockAPI();
                mockAPI.getFileAPI = jest.fn().mockReturnValue({
                    getThumbnailUrl: mockGetThumbnailUrl,
                    generateRepresentation: mockGenerateRepresentation,
                });

                // Create store mock that returns GRID view
                const store = {
                    getItem: jest.fn(key => {
                        if (key === 'bce.defaultViewMode') {
                            return VIEW_MODE_GRID;
                        }
                        return null;
                    }),
                    setItem: jest.fn(),
                };

                // Mock isThumbnailReady to consistently return false
                utils.isThumbnailReady = jest.fn().mockReturnValue(false);

                // Create test item with proper representation structure
                const testItem = {
                    ...item,
                    type: 'file',
                    representations: {
                        entries: [{ representation: 'pending' }],
                    },
                };

                // Create test collection with the test item
                const testCollection = {
                    ...collection,
                    items: [testItem],
                };

                render(<ContentExplorer ref={ref} />);

                // Set up component with grid view mode and mocks
                await act(async () => {
                    ref.current.api = mockAPI;
                    ref.current.store = store;

                    // Set initial state with GRID view
                    ref.current.setState({
                        view: VIEW_MODE_GRID,
                        currentCollection: testCollection,
                        gridColumnCount: GRID_VIEW_MIN_COLUMNS,
                        selected: testItem,
                    });
                });

                // Wait for state updates
                await act(async () => {
                    await new Promise(resolve => setTimeout(resolve, 0));
                });

                // Verify view mode is GRID before proceeding
                expect(ref.current.getViewMode()).toBe(VIEW_MODE_GRID);
                expect(store.getItem).toHaveBeenCalledWith('bce.defaultViewMode');

                // Attempt collection update
                await act(async () => {
                    await ref.current.updateCollection(testCollection, testItem, callback);
                });

                // Verify thumbnail generation occurred
                expect(mockGetThumbnailUrl).toHaveBeenCalled();
                expect(mockGenerateRepresentation).toHaveBeenCalled();
            });

            test('should not call attemptThumbnailGeneration or getThumbnailUrl if item is not file', () => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.api = APIFactory.createMockAPI();
                instance.setState = jest.fn();
                instance.attemptThumbnailGeneration = jest.fn();
                utils.isThumbnailReady = jest.fn().mockReturnValue(false);

                collection.items[0].type = 'folder';
                return instance.updateCollection(collection, item, callback).then(() => {
                    expect(instance.attemptThumbnailGeneration).not.toHaveBeenCalled();
                    expect(APIFactory.mockGetThumbnailUrl).not.toHaveBeenCalled();
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

            test('should not update item in collection if grid view is not enabled', async () => {
                const ref = React.createRef();
                const mockAPI = APIFactory.createMockAPI();
                const mockUpdateItemInCollection = jest.fn();

                // Create store mock that consistently returns LIST view
                const store = {
                    getItem: jest.fn(key => {
                        if (key === 'bce.defaultViewMode') {
                            return VIEW_MODE_LIST;
                        }
                        return null;
                    }),
                    setItem: jest.fn(),
                };

                // Reset all mocks before test
                jest.clearAllMocks();
                APIFactory.mockGenerateRepresentation.mockReset();
                mockUpdateItemInCollection.mockReset();
                store.getItem.mockClear();
                store.setItem.mockClear();

                render(<ContentExplorer ref={ref} />);

                // Set up component with consistent view mode and mocks
                await act(async () => {
                    ref.current.api = mockAPI;
                    ref.current.store = store;
                    ref.current.updateItemInCollection = mockUpdateItemInCollection;

                    // Set initial state
                    ref.current.setState({
                        view: VIEW_MODE_LIST,
                        currentCollection: {
                            items: [itemWithRepresentation],
                            percentLoaded: 100,
                        },
                        gridColumnCount: 0,
                        selected: itemWithRepresentation,
                    });
                });

                // Wait for state updates
                await act(async () => {
                    await new Promise(resolve => setTimeout(resolve, 0));
                });

                // Verify view mode is LIST before proceeding
                expect(ref.current.getViewMode()).toBe(VIEW_MODE_LIST);
                expect(store.getItem).toHaveBeenCalledWith('bce.defaultViewMode');

                // Attempt thumbnail generation
                await act(async () => {
                    await ref.current.updateCollection(
                        {
                            items: [itemWithRepresentation],
                            percentLoaded: 100,
                        },
                        itemWithRepresentation,
                    );
                });

                // Verify no thumbnail generation occurred
                expect(mockUpdateItemInCollection).not.toHaveBeenCalled();
                expect(APIFactory.mockGenerateRepresentation).not.toHaveBeenCalled();
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
                instance.api = APIFactory.createMockAPI();
                APIFactory.mockGenerateRepresentation.mockReturnValue(entry1);
                return instance.attemptThumbnailGeneration(itemWithRepresentation).then(() => {
                    expect(instance.updateItemInCollection).not.toHaveBeenCalled();
                });
            });

            test('should update item in collection if representation is updated', () => {
                wrapper = getWrapper();
                instance = wrapper.instance();
                instance.updateItemInCollection = jest.fn();
                instance.api = APIFactory.createMockAPI();
                APIFactory.mockGenerateRepresentation.mockReturnValue({ ...entry1, updated: true });
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
        test('componentDidUpdate', async () => {
            const ref = React.createRef();
            const props = {
                currentFolderId: '123',
            };

            const { rerender } = render(<ContentExplorer ref={ref} {...props} />);
            ref.current.api = APIFactory.createMockAPI();

            await act(async () => {
                rerender(<ContentExplorer ref={ref} currentFolderId="345" />);
            });

            expect(ref.current.api.getFolderAPI().getFolder).toHaveBeenCalledWith(
                '345',
                expect.any(Number),
                expect.any(Number),
                expect.any(String),
                expect.any(String),
                expect.any(Function),
                expect.any(Function),
                expect.any(Object),
            );
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
        test('should correctly update the current collection and set the state', async () => {
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

            // Create ref and render component
            const ref = React.createRef();
            render(<ContentExplorer ref={ref} />);

            // Update the metadata
            clonedCollectionItem2.metadata.enterprise.fields.find(item => item.key === field).value = newValue;
            const updatedItems = [collectionItem1, clonedCollectionItem2];

            // Set initial state
            await act(async () => {
                ref.current.setState({ currentCollection });
            });

            // Mock setState
            ref.current.setState = jest.fn();

            // Call updateMetadataSuccessCallback
            await act(async () => {
                ref.current.updateMetadataSuccessCallback(boxItem, field, newValue);
            });

            // Verify state update
            expect(ref.current.setState).toHaveBeenCalledWith({
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

        let ref;

        beforeEach(() => {
            ref = React.createRef();
            render(<ContentExplorer ref={ref} />);
            ref.current.api = APIFactory.createMockAPI();
            ref.current.updateCollection = updateCollectionMock;
        });

        afterEach(() => {
            getApiMock.mockClear();
            getApiShareMock.mockClear();
            updateCollectionMock.mockClear();
        });

        test('should create shared link if it does not exist', async () => {
            await act(async () => {
                await ref.current.handleSharedLinkSuccess({ ...boxItem, shared_link: null });
            });

            expect(APIFactory.mockGetAPI).toBeCalledTimes(1);
            expect(APIFactory.mockShare).toBeCalledTimes(1);
            expect(updateCollectionMock).toBeCalledTimes(1);
        });

        test('should not create shared link if it already exists', async () => {
            await act(async () => {
                await ref.current.handleSharedLinkSuccess(boxItem);
            });

            expect(getApiMock).not.toBeCalled();
            expect(getApiShareMock).not.toBeCalled();
            expect(updateCollectionMock).toBeCalledTimes(1);
        });
    });

    describe('render()', () => {
        test('should render UploadDialog with contentUploaderProps', async () => {
            const contentUploaderProps = {
                apiHost: 'https://api.box.com',
                chunked: false,
            };

            render(<ContentExplorer canUpload={true} contentUploaderProps={contentUploaderProps} />);

            // Set initial state using ref
            const ref = React.createRef();
            render(<ContentExplorer ref={ref} canUpload={true} contentUploaderProps={contentUploaderProps} />);

            await act(async () => {
                ref.current.setState({
                    isUploadModalOpen: true,
                    currentCollection: {
                        permissions: {
                            can_upload: true,
                        },
                    },
                });
            });

            // Use data-testid to find UploadDialog
            const uploadDialog = screen.getByTestId('mock-uploaddialog');
            expect(uploadDialog).toBeInTheDocument();

            // Verify component renders with correct class
            expect(uploadDialog).toBeInTheDocument();
            expect(uploadDialog).toHaveClass('mock-uploaddialog');
        });

        test('should render test id for e2e testing', () => {
            render(<ContentExplorer />);
            expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
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

        let ref;

        beforeEach(() => {
            ref = React.createRef();
            render(<ContentExplorer ref={ref} canDelete={true} onDelete={onDeleteMock} />);
            ref.current.api = APIFactory.createMockAPI();
            ref.current.refreshCollection = refreshCollectionMock;
        });

        beforeEach(async () => {
            await act(async () => {
                ref.current.setState({
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
            // Set up API chain for successful delete
            const mockDeleteAPI = {
                deleteItem: jest.fn((item, successCallback) => {
                    if (successCallback) {
                        successCallback();
                    }
                    return Promise.resolve();
                }),
            };

            // Mock the API chain
            ref.current.api.getAPI = jest.fn().mockReturnValue(mockDeleteAPI);

            await act(async () => {
                await ref.current.deleteCallback();
            });

            expect(ref.current.api.getAPI).toBeCalledTimes(1);
            expect(mockDeleteAPI.deleteItem).toBeCalledTimes(1);
            expect(onDeleteMock).toBeCalledTimes(1);
            expect(refreshCollectionMock).toBeCalledTimes(1);

            // Verify delete modal is rendered
            const deleteModal = screen.getByTestId('mock-deletedialog');
            expect(deleteModal).toBeInTheDocument();
        });

        test('should call refreshCollection on error', async () => {
            // Reset mocks
            const mockDeleteAPI = {
                deleteItem: jest.fn((item, successCallback, errorCallback) => {
                    if (errorCallback) {
                        errorCallback();
                    }
                    return Promise.resolve();
                }),
            };

            // Mock the API chain
            const mockAPI = APIFactory.createMockAPI();
            mockAPI.getAPI = jest.fn().mockReturnValue(mockDeleteAPI);
            ref.current.api = mockAPI;

            await act(async () => {
                await ref.current.deleteCallback();
            });

            // Wait for state to settle
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(mockAPI.getAPI).toBeCalledTimes(1);
            expect(mockDeleteAPI.deleteItem).toBeCalledTimes(1);
            expect(onDeleteMock).not.toBeCalled();
            expect(refreshCollectionMock).toBeCalledTimes(1);

            // Verify delete modal is rendered
            const deleteModal = screen.getByTestId('mock-deletedialog');
            expect(deleteModal).toBeInTheDocument();
        });
    });
});

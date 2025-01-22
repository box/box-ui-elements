import * as React from 'react';
import type { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../test-utils/testing-library';
import ContentExplorer from '../ContentExplorer';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DEFAULT_ROOT,
    DEFAULT_VIEW_FILES,
    FIELD_NAME,
    FOLDER_ID,
    SORT_ASC,
    VIEW_FOLDER,
    VIEW_MODE_GRID,
    VIEW_MODE_LIST,
    VIEW_RECENTS,
} from '../../../constants';
import CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH from '../constants';
import type { BoxItem, DefaultView, SortBy, SortDirection } from '../../../common/types/core';
import type { Props, State } from '../ContentExplorer';
import API from '../../../api';
// MetadataQueryAPIHelper import removed - unused
import LocalStore, { type LocalStoreAPI } from '../../../utils/LocalStore';

interface Bounds {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface ContentRect {
    bounds: Bounds;
}

interface MeasureProps {
    children: (args: { measureRef: (node: HTMLElement | null) => void; contentRect: ContentRect }) => ReactElement;
    onResize?: (contentRect: { bounds: Bounds; contentRect: ContentRect }) => void;
}

interface TestAPI extends Partial<API> {
    getFolderAPI?: () => {
        getFolder?: jest.Mock;
        getFolderFields?: jest.Mock;
    };
    getRecentsAPI?: () => {
        getRecents?: jest.Mock;
        recents?: jest.Mock;
    };
    getFileAPI?: () => {
        getFile?: jest.Mock;
        getThumbnailUrl?: jest.Mock;
        generateRepresentation?: jest.Mock;
    };
    getMetadataAPI?: () => {
        updateMetadata?: jest.Mock;
        getMetadata?: jest.Mock;
    };
    getSearchAPI?: () => {
        search?: jest.Mock;
    };
    getAPI?: () => {
        share?: jest.Mock;
        deleteItem?: jest.Mock;
    };
    getCache?: jest.Mock;
    destroy?: jest.Mock;
}

interface RenderComponentProps extends Partial<Props> {
    api?: TestAPI;
    initialState?: Partial<State>;
    store?:
        | LocalStore
        | {
              setItem: jest.Mock;
              getItem?: jest.Mock;
          };
    features?: Record<string, unknown>;
    viewMode?: typeof VIEW_MODE_GRID | typeof VIEW_MODE_LIST;
}

describe('elements/content-explorer/ContentExplorer', () => {
    // Mock react-measure
    jest.mock('react-measure', () => {
        const ReactMod = jest.requireActual('react');
        function MockMeasure({ children, onResize }: MeasureProps): ReactElement {
            const defaultBounds = ReactMod.useMemo(
                () => ({
                    width: 800,
                    height: 600,
                    top: 0,
                    right: 800,
                    bottom: 600,
                    left: 0,
                }),
                [],
            );

            const measureRef = ReactMod.useCallback(
                (ref: HTMLElement | null) => {
                    if (ref && onResize) {
                        onResize({
                            bounds: defaultBounds,
                            contentRect: { bounds: defaultBounds },
                        });
                    }
                },
                [onResize, defaultBounds],
            );

            // Simplified mock that doesn't use state or timers
            ReactMod.useEffect(() => {
                if (onResize) {
                    onResize({
                        bounds: defaultBounds,
                        contentRect: { bounds: defaultBounds },
                    });
                }
            }, [onResize, defaultBounds]);

            return children({
                measureRef,
                contentRect: { bounds: defaultBounds },
            });
        }

        return {
            __esModule: true,
            default: MockMeasure,
        };
    });

    type ResizeObserverEntry = {
        target: Element;
        contentRect: { width: number; height: number };
        borderBoxSize: { blockSize: number; inlineSize: number }[];
        contentBoxSize: { blockSize: number; inlineSize: number }[];
        devicePixelContentBoxSize: { blockSize: number; inlineSize: number }[];
    };

    type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.resetModules();

        // Mock ResizeObserver
        class MockResizeObserver {
            observe = jest.fn();

            unobserve = jest.fn();

            disconnect = jest.fn();

            constructor(callback: ResizeObserverCallback) {
                // Simulate initial callback
                setTimeout(() => {
                    callback([
                        {
                            target: document.createElement('div'),
                            contentRect: { width: 800, height: 600 },
                            borderBoxSize: [{ blockSize: 600, inlineSize: 800 }],
                            contentBoxSize: [{ blockSize: 600, inlineSize: 800 }],
                            devicePixelContentBoxSize: [{ blockSize: 600, inlineSize: 800 }],
                        } as ResizeObserverEntry,
                    ]);
                }, 0);
            }
        }

        (global as unknown as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver = MockResizeObserver;
        (global as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame = (
            cb: FrameRequestCallback,
        ) => setTimeout(cb, 0) as unknown as number;
    });

    afterEach(() => {
        // Clean up timers and restore mocks
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    // Types already defined at the top of the file

    const defaultProps = {
        autoFocus: false,
        canCreateNewFolder: true,
        canSetShareAccess: true,
        defaultView: DEFAULT_VIEW_FILES as DefaultView,
        isLarge: false,
        isMedium: false,
        isSmall: false,
        isTouch: false,
        isVeryLarge: false,
        measureRef: jest.fn(),
        onCreate: jest.fn(),
        onNavigate: jest.fn(),
        previewLibraryVersion: '2.0.0',
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: '/static/current',
        uploadHost: DEFAULT_HOSTNAME_UPLOAD,
        apiHost: DEFAULT_HOSTNAME_API,
        appHost: DEFAULT_HOSTNAME_APP,
        canDelete: true,
        canDownload: true,
        canPreview: true,
        canRename: true,
        canShare: true,
        canUpload: true,
        className: '',
        contentPreviewProps: { contentSidebarProps: {} },
        contentUploaderProps: {},
        features: {},
        initialPage: DEFAULT_PAGE_NUMBER,
        initialPageSize: DEFAULT_PAGE_SIZE,
        language: 'en-US',
        messages: {},
        onDelete: jest.fn(),
        onDownload: jest.fn(),
        onPreview: jest.fn(),
        onRename: jest.fn(),
        onSelect: jest.fn(),
        onUpload: jest.fn(),
        rootFolderId: DEFAULT_ROOT,
        token: 'token',
        sortBy: FIELD_NAME as SortBy,
        sortDirection: SORT_ASC as SortDirection,
    } satisfies Partial<Props>;

    // Mock API classes
    const mockAPI = {
        getFileAPI: jest.fn().mockReturnValue({
            getFile: jest.fn(),
            getThumbnailUrl: jest.fn(),
            generateRepresentation: jest.fn(),
        }),
        getFolderAPI: jest.fn().mockReturnValue({
            getFolder: jest.fn(),
            getFolderFields: jest.fn(),
        }),
        getMetadataAPI: jest.fn().mockReturnValue({
            updateMetadata: jest.fn(),
            getMetadata: jest.fn(),
        }),
        getRecentsAPI: jest.fn().mockReturnValue({
            getRecents: jest.fn(),
            recents: jest.fn(),
        }),
        getSearchAPI: jest.fn().mockReturnValue({
            search: jest.fn(),
        }),
        getAPI: jest.fn().mockReturnValue({
            share: jest.fn(),
            deleteItem: jest.fn(),
        }),
        getCache: jest.fn(),
        destroy: jest.fn(),
    };

    const renderComponent = (props: RenderComponentProps = {}): ReturnType<typeof render> => {
        const { api, initialState, store, features, ...restProps } = props;

        // Setup API mocks
        if (api) {
            // Override mock implementations with provided API methods
            if (api.getFolderAPI) {
                mockAPI.getFolderAPI.mockReturnValue({
                    getFolder: jest.fn(),
                    getFolderFields: jest.fn(),
                    ...api.getFolderAPI(),
                });
            }

            if (api.getRecentsAPI) {
                mockAPI.getRecentsAPI.mockReturnValue({
                    getRecents: jest.fn(),
                    recents: jest.fn(),
                    ...api.getRecentsAPI(),
                });
            }

            if (api.getFileAPI) {
                mockAPI.getFileAPI.mockReturnValue({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                    ...api.getFileAPI(),
                });
            }

            if (api.getMetadataAPI) {
                mockAPI.getMetadataAPI.mockReturnValue({
                    updateMetadata: jest.fn(),
                    getMetadata: jest.fn(),
                    ...api.getMetadataAPI(),
                });
            }

            if (api.getSearchAPI) {
                mockAPI.getSearchAPI.mockReturnValue({
                    search: jest.fn(),
                    ...api.getSearchAPI(),
                });
            }

            if (api.getAPI) {
                mockAPI.getAPI.mockReturnValue({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                    ...api.getAPI(),
                });
            }

            if (api.getCache) {
                mockAPI.getCache = api.getCache;
            }

            if (api.destroy) {
                mockAPI.destroy = api.destroy;
            }
        }

        // Setup LocalStore mocks
        if (store) {
            Object.entries(store).forEach(([key, value]) => {
                jest.spyOn(LocalStore.prototype, key as keyof LocalStoreAPI).mockImplementation((...args: unknown[]) =>
                    typeof value === 'function' ? (value as (...args: unknown[]) => unknown)(...args) : value,
                );
            });
        }

        return render(<ContentExplorer {...defaultProps} {...restProps} {...(initialState || {})} />, {
            wrapperProps: {
                features: features || {},
            },
        });
    };

    jest.mock('@box/blueprint-web', () => ({
        TooltipProvider: jest.requireActual('./mocks').MockTooltipProvider,
    }));

    // react-intl is unmocked via testing-library

    jest.mock('../../common/feature-checking', () => ({
        FeatureProvider: jest.requireActual('./mocks').MockFeatureProvider,
    }));

    jest.mock('../../common/header/Header', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockHeader,
    }));
    jest.mock('../../common/sub-header/SubHeader', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockSubHeader,
    }));

    jest.mock('../../../api', () => ({
        __esModule: true,
        default: jest.fn().mockImplementation(() => mockAPI),
    }));

    jest.mock('../Content', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockContent,
    }));
    jest.mock('../../common/upload-dialog/UploadDialog', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockUploadDialog,
    }));
    jest.mock('../../common/create-folder-dialog/CreateFolderDialog', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockCreateFolderDialog,
    }));
    jest.mock('../DeleteConfirmationDialog', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockDeleteConfirmationDialog,
    }));
    jest.mock('../RenameDialog', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockRenameDialog,
    }));
    jest.mock('../ShareDialog', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockShareDialog,
    }));
    jest.mock('../PreviewDialog', () => ({
        __esModule: true,
        default: jest.requireActual('./mocks').MockPreviewDialog,
    }));

    describe('elements/content-explorer/ContentExplorer', () => {
        beforeEach(() => {
            // Reset all mocks
            jest.resetAllMocks();

            // Clear ResizeObserver mocks
            jest.clearAllMocks();

            // Setup LocalStore mocks
            jest.spyOn(LocalStore.prototype, 'getItem').mockImplementation(() => VIEW_MODE_LIST);
            jest.spyOn(LocalStore.prototype, 'setItem').mockImplementation(() => undefined);
        });

        afterEach(() => {
            // Clear and restore all mocks
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test('renders without error', () => {
            renderComponent();
            expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
        });

        test('renders upload dialog when upload button is clicked', async () => {
            const contentUploaderProps = {
                apiHost: 'https://api.box.com',
                chunked: false,
            };

            const mockApi: TestAPI = {
                getFolderAPI: () => ({
                    getFolder: jest
                        .fn()
                        .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                            setTimeout(() => {
                                successCallback({
                                    items: [],
                                    percentLoaded: 100,
                                } as BoxItem);
                            }, 0);
                        }),
                    getFolderFields: jest.fn(),
                }),
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
            };

            renderComponent({
                api: mockApi,
                canUpload: true,
                contentUploaderProps,
                initialState: {
                    currentCollection: {
                        items: [],
                        percentLoaded: 100,
                        permissions: {
                            can_upload: true,
                        },
                    },
                    view: VIEW_FOLDER,
                },
            });

            // Click the upload button to open the dialog
            await userEvent.click(screen.getByRole('button', { name: /Upload files/i }));

            // Verify upload dialog is rendered
            const uploadDialog = screen.getByRole('dialog');
            expect(uploadDialog).toBeInTheDocument();
            expect(uploadDialog).toHaveAttribute('data-testid', 'upload-dialog');
        });

        test('changes view mode and saves to local storage', async () => {
            const localStore = LocalStore.prototype;
            renderComponent();

            const viewModeButton = await screen.findByRole('button', { name: /grid view/i }, { timeout: 10000 });
            await userEvent.click(viewModeButton);

            await waitFor(
                () => {
                    expect(localStore.setItem).toHaveBeenCalledWith('bce.defaultViewMode', VIEW_MODE_GRID);
                },
                { timeout: 10000 },
            );
        }, 15000);

        test('handles file upload', async () => {
            const mockGetFolder = jest
                .fn()
                .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                    setTimeout(() => {
                        successCallback({
                            items: [],
                            percentLoaded: 100,
                        } as BoxItem);
                    }, 0);
                });

            const mockApi: TestAPI = {
                getFolderAPI: () => ({
                    getFolder: mockGetFolder,
                    getFolderFields: jest.fn(),
                }),
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
                initialState: {
                    currentCollection: {
                        items: [],
                        percentLoaded: 100,
                    },
                    view: VIEW_FOLDER,
                },
            });

            // Click upload button and simulate successful upload
            await userEvent.click(screen.getByRole('button', { name: /upload/i }));

            // Verify folder contents are reloaded
            expect(mockGetFolder).toHaveBeenCalledWith(
                FOLDER_ID,
                expect.any(Number),
                0,
                'name',
                'ASC',
                expect.any(Function),
                expect.any(Function),
                expect.any(Object),
            );
        });

        describe('changeViewMode()', () => {
            const localStoreViewMode = 'bce.defaultViewMode';

            test('should change to grid view', async () => {
                const mockLocalStore = {
                    setItem: jest.fn(),
                };

                const mockGetFolder = jest
                    .fn()
                    .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                        setTimeout(() => {
                            successCallback({
                                items: [],
                                percentLoaded: 100,
                            } as BoxItem);
                        }, 0);
                    });

                const mockApi: TestAPI = {
                    getFolderAPI: () => ({
                        getFolder: mockGetFolder,
                        getFolderFields: jest.fn(),
                    }),
                    getAPI: () => ({
                        share: jest.fn(),
                        deleteItem: jest.fn(),
                    }),
                    getCache: jest.fn(),
                };

                renderComponent({
                    api: mockApi,
                    initialState: {
                        currentCollection: {
                            items: [],
                            percentLoaded: 100,
                        },
                        view: VIEW_FOLDER,
                    },
                    store: mockLocalStore,
                });

                const viewModeButton = await screen.findByRole('button', { name: /grid view/i }, { timeout: 10000 });
                await userEvent.click(viewModeButton);

                await waitFor(
                    () => {
                        expect(mockLocalStore.setItem).toHaveBeenCalledWith(localStoreViewMode, VIEW_MODE_GRID);
                        expect(mockGetFolder).toHaveBeenCalled();
                    },
                    { timeout: 10000 },
                );
            }, 15000);
        });
    });

    describe('fetchFolder()', () => {
        test('should fetch folder without representations field if grid view is not enabled', async () => {
            const getFolder = jest.fn();
            const testApi: TestAPI = {
                getFolderAPI: () => ({
                    getFolder,
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
                getRecentsAPI: () => ({
                    recents: jest.fn(),
                    getRecents: jest.fn(),
                }),
                getMetadataAPI: () => ({
                    updateMetadata: jest.fn(),
                    getMetadata: jest.fn(),
                }),
                getSearchAPI: () => ({
                    search: jest.fn(),
                }),
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
                getCache: jest.fn(),
                destroy: jest.fn(),
            };

            renderComponent({
                api: testApi,
                initialState: {
                    currentCollection: {
                        items: [],
                    },
                },
            });

            // Wait for initial fetch to complete
            await screen.findByRole('grid');

            expect(getFolder).toHaveBeenCalledWith(
                FOLDER_ID,
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

    describe('folder navigation', () => {
        const testCollection = {
            name: 'collection',
            items: [
                { id: '1', name: 'item1', type: 'folder' },
                { id: '2', name: 'item2', type: 'file' },
            ],
        };

        test('should trigger navigation when clicking a folder', async () => {
            const onNavigate = jest.fn();
            const mockGetFolder = jest
                .fn()
                .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                    successCallback(testCollection);
                });

            const mockApi: TestAPI = {
                getFolderAPI: () => ({
                    getFolder: mockGetFolder,
                    getFolderFields: jest.fn(),
                }),
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
                onNavigate,
                initialState: {
                    view: VIEW_FOLDER,
                },
            });

            // Wait for items to render and verify they're displayed
            const folderItem = await screen.findByRole('button', { name: /open folder item1/i });
            const fileItem = await screen.findByRole('button', { name: /select file item2/i });

            expect(folderItem).toBeInTheDocument();
            expect(fileItem).toBeInTheDocument();

            // Click folder to navigate
            await userEvent.click(screen.getByTestId('item-1'));

            // Verify navigation callback
            expect(onNavigate).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: '1',
                    name: 'item1',
                    type: 'folder',
                }),
            );
        });

        test('should display items in recents view', async () => {
            const mockRecents = jest.fn().mockImplementation(successCallback => {
                successCallback(testCollection as BoxItem);
            });

            const mockApi: TestAPI = {
                getRecentsAPI: () => ({
                    recents: mockRecents,
                    getRecents: mockRecents,
                }),
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
                defaultView: 'recents',
                initialState: {
                    view: VIEW_RECENTS,
                },
            });

            // Wait for items to appear and verify they're displayed
            const folderItem = await screen.findByRole('button', { name: /open folder item1/i });
            const fileItem = await screen.findByRole('button', { name: /select file item2/i });

            expect(folderItem).toBeInTheDocument();
            expect(fileItem).toBeInTheDocument();
            expect(screen.getByRole('grid')).toBeInTheDocument();
        });
    });

    describe('collection updates', () => {
        const item1 = { id: '1', name: 'item1', type: 'folder' };
        const item2 = { id: '2', name: 'item2', type: 'file' };
        const baseCollection: BoxItem = {
            id: '0',
            type: 'folder',
            name: 'Collection',
            items: [item1, item2] as BoxItem[],
        };

        test('should render empty state when collection has no items', async () => {
            const mockApi: TestAPI = {
                getFolderAPI: () => ({
                    getFolder: jest
                        .fn()
                        .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                            successCallback({ ...baseCollection, items: undefined } as BoxItem);
                        }),
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
            });

            // Verify empty state is rendered
            const grid = await screen.findByRole('grid');
            expect(grid).toBeInTheDocument();
            expect(screen.queryByRole('row')).not.toBeInTheDocument();
        });

        test('should handle grid container clicks correctly', async () => {
            const mockApi: TestAPI = {
                getFolderAPI: () => ({
                    getFolder: jest
                        .fn()
                        .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                            successCallback(baseCollection);
                        }),
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
            });

            // Wait for items to render
            await waitFor(() => {
                expect(screen.getByText('item1')).toBeInTheDocument();
                expect(screen.getByText('item2')).toBeInTheDocument();
            });

            // Click grid container (should not select anything)
            const grid = screen.getByTestId('content-grid');
            await userEvent.click(grid);
            expect(screen.queryByRole('row', { selected: true })).not.toBeInTheDocument();

            // Click item (should select it)
            await userEvent.click(screen.getByTestId('item-2'));
            const selectedRow = screen.getByRole('row', { selected: true });
            expect(selectedRow).toHaveTextContent('item2');

            // Click grid again (should maintain selection)
            await userEvent.click(screen.getByTestId('content-grid'));
            expect(screen.getByRole('row', { selected: true })).toHaveTextContent('item2');
        });

        test('should handle item selection correctly', async () => {
            const onSelect = jest.fn();
            const mockApi: TestAPI = {
                getFolderAPI: () => ({
                    getFolder: jest
                        .fn()
                        .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                            successCallback(baseCollection as BoxItem);
                        }),
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
                onSelect,
            });

            // Wait for items to render
            await screen.findByText('item1');
            await screen.findByText('item2');

            // Click on an item
            await userEvent.click(screen.getByTestId('item-2'));

            // Verify item is selected
            const selectedRow = screen.getByRole('row', { selected: true });
            expect(selectedRow).toHaveTextContent('item2');
            expect(onSelect).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: '2',
                    name: 'item2',
                    type: 'file',
                }),
            );
        });

        describe('thumbnail handling', () => {
            const fileItem = { id: '1', name: 'file1.jpg', type: 'file', selected: true };
            const thumbnailUrl = 'thumbnailUrl';

            test('should display thumbnails for files when available', async () => {
                const mockApi: TestAPI = {
                    getFolderAPI: () => ({
                        getFolder: jest
                            .fn()
                            .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                                successCallback(baseCollection as BoxItem);
                            }),
                        getFolderFields: jest.fn(),
                    }),
                    getFileAPI: () => ({
                        getFile: jest.fn(),
                        getThumbnailUrl: jest.fn().mockReturnValue(thumbnailUrl),
                        generateRepresentation: jest.fn(),
                    }),
                    getRecentsAPI: () => ({
                        recents: jest.fn(),
                        getRecents: jest.fn(),
                    }),
                    getSearchAPI: () => ({
                        search: jest.fn(),
                    }),
                    getAPI: () => ({
                        share: jest.fn(),
                        deleteItem: jest.fn(),
                    }),
                    getCache: jest.fn(),
                };

                renderComponent({
                    api: mockApi,
                });

                // Wait for item to render
                const fileElement = await screen.findByText('file1.jpg');
                expect(fileElement).toBeInTheDocument();

                // Verify thumbnail is displayed
                const thumbnail = screen.getByRole('img', { name: /thumbnail/i });
                expect(thumbnail).toHaveAttribute('src', thumbnailUrl);
            });

            test('should handle missing thumbnails gracefully', async () => {
                const mockApi: TestAPI = {
                    getFolderAPI: () => ({
                        getFolder: jest
                            .fn()
                            .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                                successCallback(baseCollection as BoxItem);
                            }),
                        getFolderFields: jest.fn(),
                    }),
                    getFileAPI: () => ({
                        getFile: jest.fn(),
                        getThumbnailUrl: jest.fn().mockReturnValue(null),
                        generateRepresentation: jest.fn(),
                    }),
                    getRecentsAPI: () => ({
                        recents: jest.fn(),
                        getRecents: jest.fn(),
                    }),
                    getAPI: () => ({
                        share: jest.fn(),
                        deleteItem: jest.fn(),
                    }),
                };

                const utils = jest.requireActual('../utils');
                jest.spyOn(utils, 'isThumbnailReady').mockReturnValue(true);

                renderComponent({
                    api: mockApi,
                });

                // Wait for item to render
                const fileElement = await screen.findByText('file1.jpg');
                expect(fileElement).toBeInTheDocument();

                // Verify default icon is shown instead of thumbnail
                const defaultIcon = screen.getByTestId('file-icon');
                expect(defaultIcon).toBeInTheDocument();
            });

            test('should not show thumbnails for folders', async () => {
                const folderCollection = {
                    ...baseCollection,
                    items: [{ ...fileItem, type: 'folder', name: 'folder1' }],
                };

                const mockApi: TestAPI = {
                    getFolderAPI: () => ({
                        getFolder: jest
                            .fn()
                            .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                                successCallback(folderCollection as BoxItem);
                            }),
                        getFolderFields: jest.fn(),
                    }),
                    getFileAPI: () => ({
                        getFile: jest.fn(),
                        getThumbnailUrl: jest.fn(),
                        generateRepresentation: jest.fn(),
                    }),
                    getRecentsAPI: () => ({
                        recents: jest.fn(),
                        getRecents: jest.fn(),
                    }),
                    getAPI: () => ({
                        share: jest.fn(),
                        deleteItem: jest.fn(),
                    }),
                };

                renderComponent({
                    api: mockApi,
                });

                // Wait for folder to render
                const folderElement = await screen.findByText('folder1');
                expect(folderElement).toBeInTheDocument();

                // Verify folder icon is shown
                const folderIcon = screen.getByTestId('folder-icon');
                expect(folderIcon).toBeInTheDocument();

                // Verify no thumbnail was requested
                expect(mockApi.getFileAPI().getThumbnailUrl).not.toHaveBeenCalled();
            });
        });

        describe('thumbnail generation', () => {
            const entry1 = { name: 'entry1', updated: false };
            const entry2 = { name: 'entry2', updated: false };
            const itemWithRepresentation = {
                id: '1',
                name: 'file1.jpg',
                type: 'file',
                representations: {
                    entries: [entry1, entry2],
                },
            };

            test('should not generate thumbnails when grid view is disabled', async () => {
                const mockApi: TestAPI = {
                    getFolderAPI: () => ({
                        getFolder: jest
                            .fn()
                            .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                                successCallback({ items: [itemWithRepresentation] } as BoxItem);
                            }),
                        getFolderFields: jest.fn(),
                    }),
                    getFileAPI: () => ({
                        getFile: jest.fn(),
                        getThumbnailUrl: jest.fn(),
                        generateRepresentation: jest.fn(),
                    }),
                    getRecentsAPI: () => ({
                        recents: jest.fn(),
                        getRecents: jest.fn(),
                    }),
                    getAPI: () => ({
                        share: jest.fn(),
                        deleteItem: jest.fn(),
                    }),
                    getCache: jest.fn(),
                };

                renderComponent({
                    api: mockApi,
                    viewMode: 'list',
                });

                // Wait for item to render
                await screen.findByText('file1.jpg');

                // Verify thumbnail generation was not attempted
                expect(mockApi.getFileAPI().generateRepresentation).not.toHaveBeenCalled();
            });

            test('should update thumbnails when representation changes', async () => {
                const mockApi: TestAPI = {
                    getFolderAPI: () => ({
                        getFolder: jest
                            .fn()
                            .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                                successCallback({ items: [itemWithRepresentation] } as BoxItem);
                            }),
                        getFolderFields: jest.fn(),
                    }),
                    getFileAPI: () => ({
                        getFile: jest.fn(),
                        getThumbnailUrl: jest.fn(),
                        generateRepresentation: jest.fn().mockResolvedValue({ ...entry1, updated: true }),
                    }),
                    getRecentsAPI: () => ({
                        recents: jest.fn(),
                        getRecents: jest.fn(),
                    }),
                    getMetadataAPI: () => ({
                        updateMetadata: jest.fn(),
                        getMetadata: jest.fn(),
                    }),
                    getSearchAPI: () => ({
                        search: jest.fn(),
                    }),
                    getAPI: () => ({
                        share: jest.fn(),
                        deleteItem: jest.fn(),
                    }),
                    getCache: jest.fn(),
                    destroy: jest.fn(),
                };

                renderComponent({
                    api: mockApi,
                    viewMode: 'grid',
                });

                // Wait for item to render
                await screen.findByText('file1.jpg');

                // Verify thumbnail was updated
                const thumbnail = await screen.findByRole('img', { name: /thumbnail/i });
                expect(thumbnail).toBeInTheDocument();
            });
        });

        describe('responsive behavior', () => {
            test('should adjust grid columns based on screen size', async () => {
                const mockApi: TestAPI = {
                    getFolderAPI: () => ({
                        getFolder: jest
                            .fn()
                            .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                                successCallback({
                                    id: '0',
                                    type: 'folder',
                                    items: [{ id: '1', name: 'file1.jpg', type: 'file' }],
                                } as BoxItem);
                            }),
                        getFolderFields: jest.fn(),
                    }),
                    getFileAPI: () => ({
                        getFile: jest.fn(),
                        getThumbnailUrl: jest.fn(),
                        generateRepresentation: jest.fn(),
                    }),
                    getAPI: () => ({
                        share: jest.fn(),
                        deleteItem: jest.fn(),
                    }),
                    getCache: jest.fn(),
                };

                // Test very large screen
                renderComponent({
                    api: mockApi,
                    isVeryLarge: true,
                    viewMode: 'grid',
                });

                const grid = await screen.findByRole('grid');
                expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(7, 1fr)' });

                // Test large screen
                renderComponent({
                    api: mockApi,
                    isLarge: true,
                    viewMode: 'grid',
                });

                expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(5, 1fr)' });

                // Test medium screen
                renderComponent({
                    api: mockApi,
                    isMedium: true,
                    viewMode: 'grid',
                });

                expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });

                // Test small screen
                renderComponent({
                    api: mockApi,
                    isSmall: true,
                    viewMode: 'grid',
                });

                expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(1, 1fr)' });
            });
        });
    });

    describe('metadata operations', () => {
        const metadataCollection = {
            items: [
                {
                    id: '1',
                    name: 'item1',
                    metadata: {
                        enterprise: {
                            fields: [
                                { name: 'name', key: 'name', value: 'abc', type: 'string' },
                                { name: 'amount', key: 'amount', value: 100.34, type: 'float' },
                            ],
                        },
                    },
                },
                {
                    id: '2',
                    name: 'item2',
                    metadata: {
                        enterprise: {
                            fields: [
                                { name: 'name', key: 'name', value: 'pqr', type: 'string' },
                                { name: 'amount', key: 'amount', value: 354.23, type: 'float' },
                            ],
                        },
                    },
                },
            ],
            nextMarker: 'marker123',
        };

        test('should update metadata field values', async () => {
            const mockMetadataAPI = {
                updateMetadata: jest.fn().mockImplementation((item, field, oldValue, newValue, successCallback) => {
                    successCallback();
                }),
                getMetadata: jest.fn(),
            };

            const mockGetFolder = jest
                .fn()
                .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                    successCallback({
                        ...metadataCollection,
                        items: metadataCollection.items.map(item =>
                            item.id === '1'
                                ? {
                                      ...item,
                                      metadata: {
                                          enterprise: {
                                              fields: [
                                                  { name: 'name', key: 'name', value: 'abc', type: 'string' },
                                                  { name: 'amount', key: 'amount', value: '111.22', type: 'float' },
                                              ],
                                          },
                                      },
                                  }
                                : item,
                        ),
                    } as BoxItem);
                });

            const mockApi: TestAPI = {
                getFolderAPI: () => ({
                    getFolder: mockGetFolder,
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
                getMetadataAPI: () => mockMetadataAPI,
                getAPI: () => ({
                    share: jest.fn(),
                    deleteItem: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
                metadataQuery: {
                    templateKey: 'enterprise',
                    scope: 'enterprise',
                    fields: [
                        { key: 'name', type: 'string' },
                        { key: 'amount', type: 'float' },
                    ],
                },
            });

            // Wait for items to render
            await screen.findByText('item1');
            await screen.findByText('item2');

            // Select the item to edit
            await userEvent.click(screen.getByText('item1'));

            // Click edit metadata button
            const editButton = await screen.findByRole('button', { name: /edit metadata/i });
            await userEvent.click(editButton);

            // Update metadata value
            const input = await screen.findByRole('textbox', { name: /amount/i });
            await userEvent.clear(input);
            await userEvent.type(input, '111.22');

            // Click save button
            const saveButton = await screen.findByRole('button', { name: /save/i });
            await userEvent.click(saveButton);

            // Verify metadata update was called with correct parameters
            expect(mockMetadataAPI.updateMetadata).toHaveBeenCalledWith(
                expect.objectContaining({ id: '1' }), // item1
                'amount',
                '100.34', // original value
                '111.22', // new value
                expect.any(Function),
                expect.any(Function),
            );

            // Wait for the updated value to appear
            const updatedValue = await screen.findByText('111.22', {}, { timeout: 10000 });
            expect(updatedValue).toBeInTheDocument();
        }, 15000);
    });

    describe('shared link operations', () => {
        const boxItem: BoxItem = {
            id: '123',
            name: 'test-file',
            shared_link: { url: 'not null', access: 'open' },
            permissions: {
                can_share: true,
                can_set_share_access: false,
            },
            type: 'file',
        };

        test('should create shared link if it does not exist', async () => {
            const getApiShareMock = jest.fn().mockImplementation((item, access, callback) => {
                setTimeout(() => callback(), 0);
            });
            const mockApi: TestAPI = {
                getAPI: () => ({
                    share: getApiShareMock,
                    deleteItem: jest.fn(),
                }),
                getFolderAPI: () => ({
                    getFolder: jest
                        .fn()
                        .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                            successCallback({
                                items: [{ ...boxItem, shared_link: null }],
                                percentLoaded: 100,
                            } as BoxItem);
                        }),
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
                initialState: {
                    currentCollection: {
                        items: [{ ...boxItem, shared_link: null }],
                        percentLoaded: 100,
                    },
                },
            });

            // Wait for item to render
            const fileElement = await screen.findByText('test-file', {}, { timeout: 10000 });
            expect(fileElement).toBeInTheDocument();

            // Click share button
            const shareButton = await screen.findByRole('button', { name: /share/i });
            await userEvent.click(shareButton);

            // Wait for and verify share API was called
            await waitFor(
                () => {
                    expect(getApiShareMock).toHaveBeenCalled();
                },
                { timeout: 10000 },
            );
        });

        test('should not create shared link if it already exists', async () => {
            const getApiShareMock = jest.fn();
            const mockApi: TestAPI = {
                getAPI: () => ({
                    share: getApiShareMock,
                    deleteItem: jest.fn(),
                }),
                getFolderAPI: () => ({
                    getFolder: jest
                        .fn()
                        .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                            successCallback({
                                items: [boxItem],
                                percentLoaded: 100,
                            } as BoxItem);
                        }),
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
                getCache: jest.fn(),
            };

            renderComponent({
                api: mockApi,
                initialState: {
                    currentCollection: {
                        items: [boxItem],
                        percentLoaded: 100,
                    },
                },
            });

            // Wait for item to render
            const fileElement = await screen.findByText('test-file', {}, { timeout: 10000 });
            expect(fileElement).toBeInTheDocument();

            // Click share button
            const shareButton = await screen.findByRole('button', { name: /share/i }, { timeout: 10000 });
            await userEvent.click(shareButton);

            // Wait and verify share API was not called
            await waitFor(
                () => {
                    expect(getApiShareMock).not.toHaveBeenCalled();
                },
                { timeout: 10000 },
            );
        }, 15000);
    });

    describe('render', () => {
        test('should render upload dialog when upload is enabled', async () => {
            const contentUploaderProps = {
                apiHost: 'https://api.box.com',
                chunked: false,
            };

            renderComponent({
                canUpload: true,
                contentUploaderProps,
                initialState: {
                    currentCollection: {
                        permissions: {
                            can_upload: true,
                        },
                    },
                },
            });

            // Verify upload dialog is rendered
            const uploadDialog = await screen.findByRole('dialog', {}, { timeout: 10000 });
            expect(uploadDialog).toBeInTheDocument();
            expect(uploadDialog).toHaveAttribute('data-testid', 'upload-dialog');
        }, 15000);

        test('should render with correct test id for e2e testing', () => {
            renderComponent();
            expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
        });
    });

    describe('delete operations', () => {
        const boxItem: BoxItem = {
            id: '123',
            name: 'test-file.pdf',
            parent: {
                id: '122',
                name: 'parent',
                type: 'folder',
            },
            permissions: {
                can_delete: true,
            },
            type: 'file',
        };

        test('should handle successful file deletion', async () => {
            const onDelete = jest.fn();
            const deleteItem = jest.fn().mockImplementation((item, successCallback) => {
                setTimeout(() => successCallback(), 0);
            });
            const mockApi: TestAPI = {
                getAPI: () => ({
                    deleteItem,
                    share: jest.fn(),
                }),
                getCache: jest.fn(),
                getFolderAPI: () => ({
                    getFolder: jest
                        .fn()
                        .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                            successCallback({
                                items: [boxItem],
                                percentLoaded: 100,
                            } as BoxItem);
                        }),
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
            };

            renderComponent({
                api: mockApi,
                canDelete: true,
                onDelete,
                initialState: {
                    currentCollection: {
                        items: [boxItem],
                        percentLoaded: 100,
                    },
                    selected: boxItem,
                    isDeleteModalOpen: true,
                },
            });

            // Wait for delete modal to appear
            const deleteModal = await screen.findByTestId('delete-confirmation-dialog', {}, { timeout: 10000 });
            expect(deleteModal).toBeInTheDocument();

            // Click delete button
            const deleteButton = await screen.findByRole('button', { name: /delete/i }, { timeout: 10000 });
            await userEvent.click(deleteButton);

            // Wait for and verify API calls and callbacks
            await waitFor(
                () => {
                    expect(deleteItem).toHaveBeenCalledWith(
                        expect.objectContaining({ id: '123' }),
                        expect.any(Function),
                        expect.any(Function),
                    );
                    expect(onDelete).toHaveBeenCalledTimes(1);
                },
                { timeout: 10000 },
            );
        }, 15000);

        test('should handle failed file deletion', async () => {
            const onDelete = jest.fn();
            const deleteItem = jest.fn().mockImplementation((item, successCallback, errorCallback) => {
                setTimeout(() => errorCallback(), 0);
            });
            const mockApi: TestAPI = {
                getAPI: () => ({
                    deleteItem,
                    share: jest.fn(),
                }),
                getCache: jest.fn(),
                getFolderAPI: () => ({
                    getFolder: jest
                        .fn()
                        .mockImplementation((id, limit, offset, sortBy, sortDirection, successCallback) => {
                            successCallback({
                                items: [boxItem],
                                percentLoaded: 100,
                            } as BoxItem);
                        }),
                    getFolderFields: jest.fn(),
                }),
                getFileAPI: () => ({
                    getFile: jest.fn(),
                    getThumbnailUrl: jest.fn(),
                    generateRepresentation: jest.fn(),
                }),
            };

            renderComponent({
                api: mockApi,
                canDelete: true,
                onDelete,
                initialState: {
                    currentCollection: {
                        items: [boxItem],
                        percentLoaded: 100,
                    },
                    selected: boxItem,
                    isDeleteModalOpen: true,
                },
            });

            // Wait for delete modal to appear
            const deleteModal = await screen.findByTestId('delete-confirmation-dialog', {}, { timeout: 10000 });
            expect(deleteModal).toBeInTheDocument();

            // Click delete button
            const deleteButton = await screen.findByRole('button', { name: /delete/i }, { timeout: 10000 });
            await userEvent.click(deleteButton);

            // Wait for and verify API calls and callbacks
            await waitFor(
                () => {
                    expect(deleteItem).toHaveBeenCalledWith(
                        expect.objectContaining({ id: '123' }),
                        expect.any(Function),
                        expect.any(Function),
                    );
                    expect(onDelete).not.toHaveBeenCalled();
                },
                { timeout: 10000 },
            );

            // Wait for and verify error message
            const errorMessage = await screen.findByText(/error deleting file/i, {}, { timeout: 10000 });
            expect(errorMessage).toBeInTheDocument();
        }, 15000);
    });
});

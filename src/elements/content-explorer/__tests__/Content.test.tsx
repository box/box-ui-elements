import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import Content, { ContentProps } from '../Content';
import {
    VIEW_ERROR,
    VIEW_METADATA,
    VIEW_MODE_LIST,
    VIEW_MODE_GRID,
    VIEW_FOLDER,
    VIEW_RECENTS,
} from '../../../constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Collection } from '../../common/types/core';

const mockProps: ContentProps = {
    canDelete: true,
    canDownload: true,
    canPreview: true,
    canRename: true,
    canShare: true,
    currentCollection: { items: [], percentLoaded: 100 } as Collection,
    isMedium: false,
    isSmall: false,
    isTouch: false,
    onItemClick: jest.fn(),
    onItemDelete: jest.fn(),
    onItemDownload: jest.fn(),
    onItemPreview: jest.fn(),
    onItemRename: jest.fn(),
    onItemSelect: jest.fn(),
    onItemShare: jest.fn(),
    onMetadataFilter: jest.fn(),
    onMetadataUpdate: jest.fn(),
    onSortChange: jest.fn(),
    portalElement: null,
    view: VIEW_RECENTS,
    viewMode: VIEW_MODE_LIST,
};

jest.mock('../MetadataViewContainer', () => ({
    __esModule: true,
    default: () => <div>MetadataViewContainer</div>,
}));

describe('Content Component', () => {
    const renderComponent = (props: Partial<ContentProps> = {}) => {
        return render(<Content {...mockProps} {...props} />);
    };
    test('renders ProgressBar when view is not VIEW_ERROR or VIEW_SELECTED', () => {
        renderComponent({ view: VIEW_FOLDER });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renders error message in empty view when there is an error', () => {
        renderComponent({ view: VIEW_ERROR });
        expect(screen.getByText('A network error has occurred while trying to load.')).toBeInTheDocument();
    });

    test('renders MetadataBasedItemList when view is VIEW_METADATA', () => {
        const collection = { boxItem: {}, id: '0', items: [{ id: 1 }], name: 'name' };
        renderComponent({ view: VIEW_METADATA, fieldsToShow: ['id'], currentCollection: collection });

        expect(screen.getByTestId('metadata-based-item-list')).toBeInTheDocument();
    });

    test('renders ItemList when viewMode is VIEW_MODE_LIST', () => {
        const collection = {
            boxItem: {},
            id: '0',
            items: [{ id: 1, name: 'Item 1', size: 1000, modified_at: '2023-10-10T10:00:00Z', type: 'file' }],
            name: 'name',
            percentLoaded: 100,
        };
        renderComponent({ viewMode: VIEW_MODE_LIST, currentCollection: collection });

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('1000 Bytes')).toBeInTheDocument();
        expect(screen.getByText('Viewed Oct 10, 2023')).toBeInTheDocument();
        expect(screen.getByLabelText('File')).toBeInTheDocument();
    });

    test('renders ItemGrid when viewMode is VIEW_MODE_GRID', () => {
        const item1 = { id: 1, name: 'Item 1', size: 1000, modified_at: '2023-10-10T10:00:00Z', type: 'file' };
        const collection = { boxItem: {}, id: '0', items: [item1], name: 'name', percentLoaded: 100 };
        render(<Content {...mockProps} viewMode={VIEW_MODE_GRID} currentCollection={collection} />);

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Viewed Oct 10, 2023')).toBeInTheDocument();
        expect(screen.getByLabelText('File')).toBeInTheDocument();
    });

    describe('MetadataView V2 feature', () => {
        const features = {
            contentExplorer: { metadataViewV2: true },
        };
        const collection = {
            percentLoaded: 100,
            boxItem: {},
            id: '0',
            items: [{ id: 1 }],
            name: 'name',
        };

        test('does not render MetadataBasedItemList when contentExplorer.metadataViewV2 is enabled', () => {
            renderComponent({
                currentCollection: collection,
                features,
                fieldsToShow: ['id'],
                view: VIEW_METADATA,
            });

            expect(screen.queryByTestId('metadata-based-item-list')).not.toBeInTheDocument();
        });

        test('renders new metadata view when contentExplorer.metadataViewV2 is enabled', () => {
            renderComponent({
                currentCollection: collection,
                features,
                fieldsToShow: ['id'],
                view: VIEW_METADATA,
            });

            expect(screen.getByText('MetadataViewContainer')).toBeInTheDocument();
        });

        describe('EmptyView rendering for VIEW_ERROR with metadataViewV2 feature', () => {
            test('renders EmptyView with isLoading=false when metadataViewV2 feature is enabled and view is VIEW_ERROR', () => {
                // This test verifies that the EmptyView receives isLoading={false}
                // We can verify this by checking that the loading message is not shown
                renderComponent({
                    features,
                    view: VIEW_ERROR,
                });

                // Should show error message, not loading message
                expect(screen.getByText('A network error has occurred while trying to load.')).toBeInTheDocument();
                expect(screen.queryByText('Please wait while the items load...')).not.toBeInTheDocument();
            });

            test('does not render EmptyView when metadataViewV2 feature is enabled but view is not VIEW_ERROR', () => {
                renderComponent({
                    features,
                    view: VIEW_FOLDER,
                });

                expect(
                    screen.queryByText('A network error has occurred while trying to load.'),
                ).not.toBeInTheDocument();
            });
        });
    });
});

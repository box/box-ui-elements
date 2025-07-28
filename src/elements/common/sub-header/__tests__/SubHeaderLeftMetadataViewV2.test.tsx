import * as React from 'react';
import type { Selection } from 'react-aria-components';
import type API from '../../../../api';
import type { Collection } from '../../../../common/types/core';
import type { MetadataQuery } from '../../../../common/types/metadataQueries';
import { render, screen, waitFor } from '../../../../test-utils/testing-library';
import SubHeaderLeftMetadataViewV2 from '../SubHeaderLeftMetadataViewV2';

interface SubHeaderLeftMetadataViewV2Props {
    api?: API;
    currentCollection: Collection;
    metadataQuery?: MetadataQuery;
    metadataViewTitle?: string;
    onClearSelectedKeys?: () => void;
    selectedKeys: Selection;
}

// Mock the API
const mockAPI = {
    getFolderAPI: jest.fn(() => ({
        getFolderFields: jest.fn(),
    })),
} as unknown as API;

const mockCollection: Collection = {
    items: [
        { id: '1', name: 'file1.txt' },
        { id: '2', name: 'file2.txt' },
        { id: '3', name: 'file3.txt' },
    ],
};

const defaultProps: SubHeaderLeftMetadataViewV2Props = {
    api: mockAPI,
    currentCollection: mockCollection,
    selectedKeys: new Set(),
};

const renderComponent = (props: Partial<SubHeaderLeftMetadataViewV2Props> = {}) =>
    render(<SubHeaderLeftMetadataViewV2 {...defaultProps} {...props} />);

describe('elements/common/sub-header/SubHeaderLeftMetadataViewV2', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('when no items are selected', () => {
        test('should render metadata view title when provided', () => {
            renderComponent({
                metadataViewTitle: 'Custom Metadata View',
                selectedKeys: new Set(),
            });

            expect(screen.getByText('Custom Metadata View')).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        });

        test('should render ancestor folder name when no metadata view title is provided', async () => {
            const mockGetFolderFields = jest.fn((folderId, successCallback) => {
                successCallback({ name: 'Test Folder' });
            });

            (mockAPI.getFolderAPI as jest.Mock).mockReturnValue({
                getFolderFields: mockGetFolderFields,
            });

            renderComponent({
                metadataQuery: { ancestor_folder_id: '123' },
                selectedKeys: new Set(),
            });

            await waitFor(() => {
                expect(screen.getByText('Test Folder')).toBeInTheDocument();
            });

            expect(mockGetFolderFields).toHaveBeenCalledWith('123', expect.any(Function), expect.any(Function), {
                fields: ['name'],
            });
        });

        test('should render "All Files" when ancestor folder id is "0"', () => {
            renderComponent({
                metadataQuery: { ancestor_folder_id: '0' },
                selectedKeys: new Set(),
            });

            expect(screen.getByText('All Files')).toBeInTheDocument();
        });

        test('should handle API error gracefully', async () => {
            const mockGetFolderFields = jest.fn((folderId, successCallback, errorCallback) => {
                errorCallback();
            });

            (mockAPI.getFolderAPI as jest.Mock).mockReturnValue({
                getFolderFields: mockGetFolderFields,
            });

            renderComponent({
                metadataQuery: { ancestor_folder_id: '123' },
                selectedKeys: new Set(),
            });

            await waitFor(() => {
                expect(screen.queryByText('Test Folder')).not.toBeInTheDocument();
            });
        });

        test('should not fetch folder info when no ancestor folder id', () => {
            const mockGetFolderFields = jest.fn();

            (mockAPI.getFolderAPI as jest.Mock).mockReturnValue({
                getFolderFields: mockGetFolderFields,
            });

            renderComponent({
                selectedKeys: new Set(),
            });

            expect(mockGetFolderFields).not.toHaveBeenCalled();
        });
    });

    describe('when items are selected', () => {
        test('should render single selected item name', () => {
            renderComponent({
                selectedKeys: new Set(['1']),
            });

            expect(screen.getByText('file1.txt')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should render multiple selected items count', () => {
            renderComponent({
                selectedKeys: new Set(['1', '2']),
            });

            expect(screen.getByText('2 files selected')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should render all items selected count', () => {
            renderComponent({
                selectedKeys: 'all',
            });

            expect(screen.getByText('3 files selected')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should call onClearSelectedKeys when close button is clicked', () => {
            const mockOnClearSelectedKeys = jest.fn();

            renderComponent({
                selectedKeys: new Set(['1']),
                onClearSelectedKeys: mockOnClearSelectedKeys,
            });

            const closeButton = screen.getByRole('button');
            closeButton.click();

            expect(mockOnClearSelectedKeys).toHaveBeenCalledTimes(1);
        });

        test('should handle selected item not found in collection', () => {
            renderComponent({
                selectedKeys: new Set(['999']), // Non-existent ID
            });

            // Should not crash and should not render any selected item text
            expect(screen.queryByText('file1.txt')).not.toBeInTheDocument();
            expect(screen.queryByText('file2.txt')).not.toBeInTheDocument();
            expect(screen.queryByText('file3.txt')).not.toBeInTheDocument();
        });

        test('should handle empty collection with selected items', () => {
            renderComponent({
                currentCollection: { items: [] },
                selectedKeys: new Set(['1']),
            });

            // Should not crash and should not render any selected item text
            expect(screen.queryByText('file1.txt')).not.toBeInTheDocument();
        });
    });

    describe('component structure', () => {
        test('should render with correct CSS classes when items are selected', () => {
            renderComponent({
                selectedKeys: new Set(['1']),
            });

            const container = screen.getByText('file1.txt').closest('div');
            expect(container).toHaveClass('be-sub-header-left-selected-container');
        });

        test('should render close button with correct CSS class', () => {
            renderComponent({
                selectedKeys: new Set(['1']),
            });

            const closeButton = screen.getByRole('button');
            expect(closeButton).toHaveClass('be-sub-header-left-selected-close-button');
        });

        test('should render title with correct CSS class when no items selected', () => {
            renderComponent({
                metadataViewTitle: 'Test Title',
                selectedKeys: new Set(),
            });

            const title = screen.getByRole('heading', { level: 1 });
            expect(title).toHaveClass('be-sub-header-left-title');
        });
    });

    describe('edge cases', () => {
        test('should handle undefined metadataQuery', () => {
            renderComponent({
                metadataQuery: undefined,
                selectedKeys: new Set(),
            });

            // Should not crash and should not fetch folder info
            expect(mockAPI.getFolderAPI).not.toHaveBeenCalled();
        });

        test('should handle undefined api', () => {
            renderComponent({
                api: undefined,
                metadataQuery: { ancestor_folder_id: '123' },
                selectedKeys: new Set(),
            });

            // Should not crash and should not fetch folder info
            expect(mockAPI.getFolderAPI).not.toHaveBeenCalled();
        });

        test('should handle zero selected items', () => {
            renderComponent({
                selectedKeys: new Set(),
            });

            // Should render title instead of selected items
            expect(screen.queryByRole('button')).not.toBeInTheDocument(); // No close button
        });
    });
});

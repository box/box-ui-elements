import * as React from 'react';
import { fireEvent, render, screen } from '../../../test-utils/testing-library';
import actionCellRenderer from '../actionCellRenderer';
import progressCellRenderer from '../progressCellRenderer';
import removeCellRenderer from '../removeCellRenderer';

import Browser from '../../../utils/Browser';
import {
    STATUS_COMPLETE,
    STATUS_ERROR,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_ITEM_NAME_IN_USE,
    ERROR_CODE_UPLOAD_BAD_DIGEST,
    ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED,
    ERROR_CODE_UPLOAD_FAILED_PACKAGE,
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT,
    ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED,
} from '../../../constants';

import type { UploadItem } from '../../../common/types/upload';

describe('elements/content-uploader/CellRenderer', () => {
    describe('actionCellRenderer', () => {
        const renderComponent = (rowData: UploadItem, onClick: jest.Mock) => {
            const Component = actionCellRenderer(false, onClick);
            return render(<Component rowData={rowData} />);
        };

        test('calls onClick with rowData when ItemAction is clicked', () => {
            const rowData = { id: '3', status: STATUS_ERROR, isFolder: false };
            const onClick = jest.fn();
            renderComponent(rowData, onClick);
            fireEvent.click(screen.getByRole('button'));
            expect(onClick).toHaveBeenCalledWith(rowData);
        });
    });
    describe('progressCellRenderer', () => {
        const renderComponent = (rowData: UploadItem, shouldShowUpgradeCTAMessage?: boolean) => {
            const Component = progressCellRenderer(shouldShowUpgradeCTAMessage);
            return render(<Component rowData={rowData} />);
        };

        test('renders ItemProgress for in-progress status', () => {
            const rowData = { status: STATUS_IN_PROGRESS };
            renderComponent(rowData);
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        test('renders ItemProgress for staged status', () => {
            const rowData = { status: STATUS_STAGED };
            renderComponent(rowData);
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        test('renders error message for failing to upload a child folder', () => {
            const rowData = { status: STATUS_ERROR, error: { code: ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED } };
            renderComponent(rowData);
            expect(screen.getByText('One or more child folders failed to upload.')).toBeInTheDocument();
        });

        test('renders error message for file size limit exceeded', () => {
            const rowData = { status: STATUS_ERROR, error: { code: ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED } };
            renderComponent(rowData);
            expect(screen.getByText('File size exceeds the folder owner’s file size limit')).toBeInTheDocument();
        });

        test('renders upgrade CTA message for file size limit exceeded when shouldShowUpgradeCTAMessage is true', () => {
            const rowData = { status: STATUS_ERROR, error: { code: ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED } };
            renderComponent(rowData, true);
            expect(
                screen.getByText('This file exceeds your plan’s upload limit. Upgrade now to store larger files.'),
            ).toBeInTheDocument();
        });

        test('renders error message for item name in use', () => {
            const rowData = { status: STATUS_ERROR, error: { code: ERROR_CODE_ITEM_NAME_IN_USE } };
            renderComponent(rowData);
            expect(screen.getByText('A file with this name already exists.')).toBeInTheDocument();
        });

        test('renders error message for invalid item name', () => {
            const rowData = {
                status: STATUS_ERROR,
                error: { code: ERROR_CODE_ITEM_NAME_INVALID },
                name: 'invalidName',
            };
            renderComponent(rowData);
            expect(
                screen.getByText('Provided folder name, invalidName, could not be used to create a folder.'),
            ).toBeInTheDocument();
        });

        test('renders error message for storage limit exceeded', () => {
            const rowData = { status: STATUS_ERROR, error: { code: ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED } };
            renderComponent(rowData);
            expect(screen.getByText('Account storage limit reached')).toBeInTheDocument();
        });

        test('renders error message for pending app folder size limit', () => {
            const rowData = { status: STATUS_ERROR, error: { code: ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT } };
            renderComponent(rowData);
            expect(screen.getByText('Pending app folder size limit exceeded')).toBeInTheDocument();
        });

        test('renders error message for failed package upload', () => {
            const rowData = { status: STATUS_ERROR, error: { code: ERROR_CODE_UPLOAD_FAILED_PACKAGE } };
            renderComponent(rowData);
            expect(
                screen.getByText('Failed to upload package file. Please retry by saving as a single file.'),
            ).toBeInTheDocument();
        });

        test('renders error message for bad digest in Safari with zip file', () => {
            Browser.isSafari = jest.fn().mockReturnValue(true);
            const rowData = {
                status: STATUS_ERROR,
                error: { code: ERROR_CODE_UPLOAD_BAD_DIGEST },
                file: { name: 'file.zip' },
            };
            renderComponent(rowData);
            expect(
                screen.getByText('Failed to upload package file. Please retry by saving as a single file.'),
            ).toBeInTheDocument();
        });

        test('renders default error message for unknown error code', () => {
            const rowData = { status: STATUS_ERROR, error: { code: 'UNKNOWN_ERROR_CODE' } };
            renderComponent(rowData);
            expect(screen.getByText('Something went wrong with the upload. Please try again.')).toBeInTheDocument();
        });

        test('returns null for folder with non-error status', () => {
            const rowData = { status: STATUS_IN_PROGRESS, isFolder: true };
            const Component = progressCellRenderer();
            const { container } = render(<Component rowData={rowData} />);
            expect(container.firstChild).toBeNull();
        });
    });
    describe('removeCellRenderer', () => {
        const renderComponent = (rowData: UploadItem, onClick: jest.Mock) => {
            const Component = removeCellRenderer(onClick);
            return render(<Component rowData={rowData} />);
        };

        test('renders ItemRemove for non-folder item', () => {
            const rowData = { isFolder: false };
            const onClick = jest.fn();
            renderComponent(rowData, onClick);
            expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
        });

        test('does not render ItemRemove for folder item', () => {
            const rowData = { id: '2', status: STATUS_COMPLETE, isFolder: true };
            const onClick = jest.fn();
            const { container } = renderComponent(rowData, onClick);
            expect(container.firstChild).toBeNull();
        });

        test('calls onClick with rowData when ItemRemove is clicked', () => {
            const rowData = { id: '3', status: STATUS_ERROR, isFolder: false };
            const onClick = jest.fn();
            renderComponent(rowData, onClick);
            fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
            expect(onClick).toHaveBeenCalledWith(rowData);
        });
    });
});

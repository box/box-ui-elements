import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';
import { screen, render, renderHook, waitFor } from '../../../test-utils/testing-library';
import messages from '../../common/messages';

import {
    MetadataSidebarRedesignComponent as MetadataSidebarRedesign,
    type MetadataSidebarRedesignProps,
} from '../MetadataSidebarRedesign';
import useSidebarMetadataFetcher, { Status } from '../hooks/useSidebarMetadataFetcher';

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesign', () => {
    const mockFile = {
        id: '123',
        permissions: { [FIELD_PERMISSIONS_CAN_UPLOAD]: true },
    };

    const mockTemplates = [
        {
            id: 'metadata_template_custom_1',
            scope: 'global',
            templateKey: 'properties',
            hidden: false,
        },
    ];

    const mockError = {
        status: 500,
        message: 'Internal Server Error',
    };

    const mockAPI = {
        getFile: jest.fn((id, successCallback) => {
            successCallback(mockFile);
        }),
        getMetadata: jest.fn((_file, successCallback) => {
            successCallback({
                editors: [],
                templates: mockTemplates,
            });
        }),
    };
    const api = {
        getFileAPI: jest.fn().mockReturnValue(mockAPI),
        getMetadataAPI: jest.fn().mockReturnValue(mockAPI),
    };

    const defaultProps = {
        api,
        fileId: 'test-file-id-1',
        elementId: 'element-1',
        isFeatureEnabled: true,
        onError: jest.fn(),
    } satisfies MetadataSidebarRedesignProps;

    const renderComponent = (props: Partial<MetadataSidebarRedesignProps> = {}) => {
        const ps = { ...defaultProps, ...props } as MetadataSidebarRedesignProps;
        return render(<MetadataSidebarRedesign {...ps} />);
    };

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
    });

    test('should have accessible "Add template" button', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: /Add template/i })).toBeInTheDocument();
    });

    test('should have selectable "Custom Metadata" template in dropdown', async () => {
        renderComponent();

        const addTemplateButton = screen.getByRole('button', { name: /Add template/i });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = screen.getByRole('option', { name: /Custom Metadata/i });
        expect(customMetadataOption).toBeInTheDocument();
        userEvent.click(customMetadataOption);

        // instead of below assertions check if template was added when MetadataInstanceList will be implemented
        await userEvent.click(addTemplateButton);

        expect(customMetadataOption).toHaveAttribute('aria-disabled', 'true');
    });

    describe('useSidebarMetadataFetcher', () => {
        const onErrorMock = jest.fn();
        const isFeatureEnabledMock = true;

        const setupHook = (fileId = '123') =>
            renderHook(() => useSidebarMetadataFetcher(api, fileId, onErrorMock, isFeatureEnabledMock));

        it('should fetch the file and metadata successfully', async () => {
            const { result } = setupHook();

            await waitFor(() => expect(result.current.status).toBe(Status.SUCCESS));

            expect(result.current.file).toEqual(mockFile);
            expect(result.current.templates).toEqual(mockTemplates);
            expect(result.current.errorMessage).toBeNull();
        });

        it('should handle file fetching error', async () => {
            mockAPI.getFile.mockImplementation((id, successCallback, errorCallback) =>
                errorCallback(mockError, 'file_fetch_error'),
            );

            const { result } = setupHook();

            await waitFor(() => expect(result.current.status).toBe(Status.ERROR));

            expect(result.current.file).toBeUndefined();
            expect(result.current.errorMessage).toBe(messages.sidebarMetadataEditingErrorContent);
            expect(onErrorMock).toHaveBeenCalledWith(
                mockError,
                'file_fetch_error',
                expect.objectContaining({
                    error: mockError,
                    isErrorDisplayed: true,
                }),
            );
        });

        it('should handle metadata fetching error', async () => {
            mockAPI.getFile.mockImplementation((id, successCallback) => {
                successCallback(mockFile);
            });
            mockAPI.getMetadata.mockImplementation((file, successCallback, errorCallback) => {
                errorCallback(mockError, 'metadata_fetch_error');
            });
            const { result } = setupHook();

            await waitFor(() => expect(result.current.status).toBe(Status.ERROR));

            expect(result.current.templates).toBeNull();
            expect(result.current.errorMessage).toBe(messages.sidebarMetadataFetchingErrorContent);
            expect(onErrorMock).toHaveBeenCalledWith(
                mockError,
                'metadata_fetch_error',
                expect.objectContaining({
                    error: mockError,
                    isErrorDisplayed: true,
                }),
            );
        });
    });
});

// @flow
import { act } from 'react';

import API from '../../../api';
import useInvites from '../hooks/useInvites';

describe('useInvites hook', () => {
    let mockApi;
    let mockSetIsLoading;
    let mockHandleSuccess;
    let mockHandleError;
    let mockTransformRequest;
    let mockTransformResponse;

    beforeEach(() => {
        mockApi = new API({});
        mockSetIsLoading = jest.fn();
        mockHandleSuccess = jest.fn();
        mockHandleError = jest.fn();
        mockTransformRequest = jest.fn().mockReturnValue({
            users: [{ email: 'user@example.com', role: 'editor' }],
            groups: [{ id: 'group123', role: 'viewer' }],
        });
        mockTransformResponse = jest.fn().mockReturnValue({ id: '123', type: 'folder' });
        jest.spyOn(mockApi, 'getCollaborationsAPI').mockReturnValue({
            addCollaboration: jest.fn().mockImplementation((itemData, collab, successCallback, errorCallback) => {
                if (collab.email === 'fail@example.com') {
                    errorCallback(new Error('Failed to add collaboration'));
                } else {
                    successCallback({ id: 'collab123', role: collab.role });
                }
            }),
        });
    });

    it('invokes setIsLoading, handleSuccess, and transformResponse on successful collaboration addition', async () => {
        const sendInvites = useInvites(mockApi, '123', 'folder', {
            setIsLoading: mockSetIsLoading,
            handleSuccess: mockHandleSuccess,
            handleError: mockHandleError,
            transformRequest: mockTransformRequest,
            transformResponse: mockTransformResponse,
        });

        await act(async () => {
            await sendInvites()({ users: [{ email: 'user@example.com', role: 'editor' }] });
        });

        expect(mockSetIsLoading).toHaveBeenCalledWith(true);
        expect(mockSetIsLoading).toHaveBeenCalledWith(false);
        expect(mockHandleSuccess).toHaveBeenCalledWith({ id: 'collab123', role: 'editor' });
        expect(mockTransformResponse).toHaveBeenCalledWith({ id: 'collab123', role: 'editor' });
    });

    it('invokes handleError on failed collaboration addition', async () => {
        const sendInvites = useInvites(mockApi, '123', 'folder', {
            setIsLoading: mockSetIsLoading,
            handleSuccess: mockHandleSuccess,
            handleError: mockHandleError,
            transformRequest: mockTransformRequest,
            transformResponse: mockTransformResponse,
        });

        await act(async () => {
            await sendInvites()({ users: [{ email: 'fail@example.com', role: 'editor' }] });
        });

        expect(mockSetIsLoading).toHaveBeenCalledWith(true);
        expect(mockSetIsLoading).toHaveBeenCalledWith(false);
        expect(mockHandleError).toHaveBeenCalled();
    });

    it('returns null if transformRequest is not provided', async () => {
        const sendInvites = useInvites(mockApi, '123', 'folder', {
            setIsLoading: mockSetIsLoading,
            handleSuccess: mockHandleSuccess,
            handleError: mockHandleError,
            transformResponse: mockTransformResponse,
        });

        const result = await sendInvites()({ users: [{ email: 'user@example.com', role: 'editor' }] });

        expect(result).toBeNull();
        expect(mockSetIsLoading).not.toHaveBeenCalled();
        expect(mockHandleSuccess).not.toHaveBeenCalled();
        expect(mockHandleError).not.toHaveBeenCalled();
    });

    it('processes multiple users and groups in a single call', async () => {
        const sendInvites = useInvites(mockApi, '123', 'folder', {
            setIsLoading: mockSetIsLoading,
            handleSuccess: mockHandleSuccess,
            handleError: mockHandleError,
            transformRequest: mockTransformRequest,
            transformResponse: mockTransformResponse,
        });

        await act(async () => {
            await sendInvites()({
                users: [{ email: 'user@example.com', role: 'editor' }],
                groups: [{ id: 'group123', role: 'viewer' }],
            });
        });

        expect(mockSetIsLoading).toHaveBeenCalledTimes(2);
        expect(mockHandleSuccess).toHaveBeenCalledTimes(2);
        expect(mockTransformResponse).toHaveBeenCalledTimes(2);
    });
});

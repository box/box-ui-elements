import { renderHook, act } from '@testing-library/react';
import useInvites from '../hooks/useInvites';
import API from '../../../api';

jest.mock('../../../api');

const mockCollaborators = [{ id: '123', type: 'user', email: 'user@test.com', role: 'editor' }];

describe('useInvites hook', () => {
    let mockApi;
    let mockHandleSuccess;
    let mockHandleError;
    let mockTransformRequest;
    let mockTransformResponse;

    beforeEach(() => {
        mockApi = new API({});
        mockHandleSuccess = jest.fn();
        mockHandleError = jest.fn();
        mockTransformRequest = jest.fn().mockImplementation(collabRequest => {
            if (collabRequest) {
                return {
                    users: collabRequest.users || [{ email: 'user@example.com', role: 'editor' }],
                    groups: collabRequest.groups || [{ id: 'group123', role: 'viewer' }],
                };
            }
            return {
                users: [{ email: 'user@example.com', role: 'editor' }],
                groups: [{ id: 'group123', role: 'viewer' }],
            };
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

    test('invokes setIsLoading, handleSuccess, and transformResponse on successful collaboration addition', async () => {
        const { result } = renderHook(() =>
            useInvites(mockApi, '123', 'folder', {
                collaborators: mockCollaborators,
                handleSuccess: mockHandleSuccess,
                handleError: mockHandleError,
                transformRequest: mockTransformRequest,
                transformResponse: mockTransformResponse,
            }),
        );

        act(() => {
            result.current({ users: [{ email: 'user@example.com', role: 'editor' }] });
        });

        expect(mockHandleSuccess).toHaveBeenCalledWith({ id: 'collab123', role: 'editor' });
        expect(mockTransformResponse).toHaveBeenCalledWith({ id: 'collab123', role: 'editor' });
    });

    test('invokes handleError on failed collaboration addition', async () => {
        const { result } = renderHook(() =>
            useInvites(mockApi, '123', 'folder', {
                collaborators: mockCollaborators,
                handleSuccess: mockHandleSuccess,
                handleError: mockHandleError,
                transformRequest: mockTransformRequest,
                transformResponse: mockTransformResponse,
            }),
        );

        act(() => {
            result.current({ users: [{ email: 'fail@example.com', role: 'editor' }] });
        });

        expect(mockHandleError).toHaveBeenCalled();
    });

    test('returns null if transformRequest is not provided', async () => {
        const { result } = renderHook(() =>
            useInvites(mockApi, '123', 'folder', {
                collaborators: mockCollaborators,
                handleSuccess: mockHandleSuccess,
                handleError: mockHandleError,
                transformResponse: mockTransformResponse,
            }),
        );

        let actionResult;
        act(() => {
            actionResult = result.current({ users: [{ email: 'user@example.com', role: 'editor' }] });
        });

        expect(actionResult).toEqual(Promise.resolve());
        expect(mockHandleSuccess).not.toHaveBeenCalled();
        expect(mockHandleError).not.toHaveBeenCalled();
    });

    test('processes multiple users and groups in a single call', async () => {
        const { result } = renderHook(() =>
            useInvites(mockApi, '123', 'folder', {
                collaborators: mockCollaborators,
                handleSuccess: mockHandleSuccess,
                handleError: mockHandleError,
                transformRequest: mockTransformRequest,
                transformResponse: mockTransformResponse,
            }),
        );

        act(() => {
            result.current({
                users: [{ email: 'user@example.com', role: 'editor' }],
                groups: [{ id: 'group123', role: 'viewer' }],
            });
        });

        expect(mockHandleSuccess).toHaveBeenCalledTimes(2);
        expect(mockTransformResponse).toHaveBeenCalledTimes(2);
    });

    test('Should early return null if collaborators is not provided', async () => {
        const { result } = renderHook(() =>
            useInvites(mockApi, '123', 'folder', {
                handleSuccess: mockHandleSuccess,
                handleError: mockHandleError,
                transformResponse: mockTransformResponse,
            }),
        );

        expect(result.current).toBeNull();
        expect(mockHandleSuccess).not.toHaveBeenCalled();
        expect(mockHandleError).not.toHaveBeenCalled();
    });
});

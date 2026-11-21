import * as React from 'react';
import { renderHook, act } from '@testing-library/react';
import { annotation } from '../../../../../__mocks__/annotations';
import { threadedCommentsFormatted as replies } from '../../../../../api/fixtures';
import FeatureProvider from '../../../../common/feature-checking/FeatureProvider';
import useRepliesAPI from '../useRepliesAPI';

describe('src/elements/content-sidebar/activity-feed/annotation-thread/useRepliesAPI', () => {
    const getApi = ({ createAnnotationReply = jest.fn, deleteComment = jest.fn(), updateComment = jest.fn() }) => {
        const getAnnotationsAPI = () => ({
            createAnnotationReply,
        });

        const getThreadedCommentsAPI = () => ({
            deleteComment,
            updateComment,
        });

        return {
            getAnnotationsAPI,
            getThreadedCommentsAPI,
        };
    };

    const getHook = (props, mockedApiFunctions = {}) =>
        renderHook(() =>
            useRepliesAPI({
                annotationId: annotation.id,
                api: getApi(mockedApiFunctions),
                errorCallback: jest.fn(),
                fileId: 'fileId',
                filePermissions: { can_comment: true },
                ...props,
            }),
        );

    test('should call api function on deleteReply with correct arguments', () => {
        const mockDeleteComment = jest.fn();
        const api = getApi({ deleteComment: mockDeleteComment });

        const { result } = getHook({ api });
        const { id, permissions } = replies[0];
        const successCallback = jest.fn();

        act(() => {
            result.current.deleteReply({ id, permissions, successCallback });
        });

        expect(mockDeleteComment).toBeCalledWith({
            fileId: 'fileId',
            commentId: id,
            permissions,
            successCallback,
            errorCallback: expect.any(Function),
        });
    });

    test('should call api function on editReply with correct arguments', () => {
        const mockUpdateComment = jest.fn();
        const api = getApi({ updateComment: mockUpdateComment });
        const { id, permissions } = replies[0];
        const message = 'Text';
        const successCallback = jest.fn();

        const { result } = getHook({ api });

        act(() => {
            result.current.editReply({ id, message, permissions, successCallback });
        });

        expect(mockUpdateComment).toBeCalledWith({
            fileId: 'fileId',
            commentId: id,
            message,
            permissions,
            shouldEnableRichText: false,
            successCallback,
            errorCallback: expect.any(Function),
        });
    });

    test('should call api function on createReply with correct arguments', () => {
        const mockCreateAnnotationReply = jest.fn();
        const api = getApi({ createAnnotationReply: mockCreateAnnotationReply });
        const message = 'Text';
        const requestId = 'reply_123';
        const successCallback = jest.fn();

        const { result } = getHook({ api });

        act(() => {
            result.current.createReply({ message, requestId, successCallback });
        });

        expect(mockCreateAnnotationReply).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_comment: true },
            message,
            successCallback,
            expect.any(Function),
            false,
        );
    });

    describe('with activityFeed.richText enabled', () => {
        const wrapper = ({ children }) => (
            <FeatureProvider features={{ activityFeed: { richText: { enabled: true } } }}>{children}</FeatureProvider>
        );
        const getRichTextHook = api =>
            renderHook(
                () =>
                    useRepliesAPI({
                        annotationId: annotation.id,
                        api,
                        errorCallback: jest.fn(),
                        fileId: 'fileId',
                        filePermissions: { can_comment: true },
                    }),
                { wrapper },
            );

        test('should pass shouldEnableRichText=true on createReply', () => {
            const mockCreateAnnotationReply = jest.fn();
            const { result } = getRichTextHook(getApi({ createAnnotationReply: mockCreateAnnotationReply }));

            act(() => {
                result.current.createReply({ message: 'Text', requestId: 'reply_123', successCallback: jest.fn() });
            });

            const [call] = mockCreateAnnotationReply.mock.calls;
            expect(call[call.length - 1]).toBe(true);
        });

        test('should pass shouldEnableRichText=true on editReply', () => {
            const mockUpdateComment = jest.fn();
            const { result } = getRichTextHook(getApi({ updateComment: mockUpdateComment }));
            const { id, permissions } = replies[0];

            act(() => {
                result.current.editReply({ id, message: 'Text', permissions, successCallback: jest.fn() });
            });

            expect(mockUpdateComment).toBeCalledWith(expect.objectContaining({ shouldEnableRichText: true }));
        });
    });
});

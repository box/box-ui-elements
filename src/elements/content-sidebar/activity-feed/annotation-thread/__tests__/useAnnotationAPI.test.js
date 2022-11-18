import { renderHook, act } from '@testing-library/react-hooks';
import { annotationsWithFormattedReplies as annotations } from '../../../../../api/fixtures';
import useAnnotationAPI from '../useAnnotationAPI';

describe('src/elements/content-sidebar/activity-feed/useAnnotattionAPI', () => {
    const annotation = annotations[0];

    const getApi = ({
        getAnnotation = jest.fn(),
        updateAnnotation = jest.fn(),
        deleteAnnotation = jest.fn(),
        createAnnotationReply = jest.fn,
    }) => {
        const getAnnotationsAPI = () => ({
            createAnnotationReply,
            getAnnotation,
            updateAnnotation,
            deleteAnnotation,
        });

        return {
            getAnnotationsAPI,
        };
    };

    const filePermissions = { can_annotate: true, can_view_annotations: true };
    const errorCallback = jest.fn();

    const getHook = props =>
        renderHook(() =>
            useAnnotationAPI({
                api: getApi({}),
                fileId: 'fileId',
                filePermissions,
                annotationId: annotation.id,
                errorCallback,
                ...props,
            }),
        );

    test('should call api function on handleFetch with correct arguments', () => {
        const mockSuccessCallback = jest.fn();
        const mockGetAnnotation = jest.fn();
        const api = getApi({ getAnnotation: mockGetAnnotation });

        const { result } = getHook({ api });

        act(() => {
            result.current.handleFetch({ annotationId: annotation.id, successCallback: mockSuccessCallback });
        });

        expect(mockGetAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_annotate: true, can_view_annotations: true },
            mockSuccessCallback,
            errorCallback,
            true,
        );
    });

    test('should call api function on handleEdit with correct arguments', () => {
        const mockSuccessCallback = jest.fn();
        const mockUpdateAnnotation = jest.fn();
        const api = getApi({ updateAnnotation: mockUpdateAnnotation });
        const { result } = getHook({ api });

        act(() => {
            result.current.handleEdit({
                id: annotation.id,
                permissions: { can_edit: true },
                successCallback: mockSuccessCallback,
                text: 'new text',
            });
        });

        expect(mockUpdateAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_edit: true },
            { message: 'new text' },
            mockSuccessCallback,
            errorCallback,
        );
    });

    test('should call api function on handleStatusChange with correct arguments', () => {
        const mockSuccessCallback = jest.fn();
        const mockUpdateAnnotation = jest.fn();
        const api = getApi({ updateAnnotation: mockUpdateAnnotation });
        const { result } = getHook({ api });

        act(() => {
            result.current.handleStatusChange({
                id: annotation.id,
                permissions: { can_resolve: true },
                status: 'resolved',
                successCallback: mockSuccessCallback,
            });
        });

        expect(mockUpdateAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_resolve: true },
            { status: 'resolved' },
            mockSuccessCallback,
            errorCallback,
        );
    });

    test('should call api function on handleDelete with correct arguments', () => {
        const mockSuccessCallback = jest.fn();

        const mockDeleteAnnotation = jest.fn();
        const api = getApi({ deleteAnnotation: mockDeleteAnnotation });
        const { result } = getHook({ api });

        act(() => {
            result.current.handleDelete({
                id: annotation.id,
                permissions: { can_delete: true },
                successCallback: mockSuccessCallback,
            });
        });

        expect(mockDeleteAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_delete: true },
            mockSuccessCallback,
            errorCallback,
        );
    });
});

import { renderHook, act } from '@testing-library/react-hooks';
import { annotation } from '../../../../../__mocks__/annotations';
import useAnnotationAPI from '../useAnnotationAPI';

describe('src/elements/content-sidebar/activity-feed/useAnnotattionAPI', () => {
    let mockGetAnnotation = jest.fn();
    const mockUpdateAnnotation = jest.fn();
    const mockDeleteAnnotation = jest.fn();

    const getAnnotationsAPI = () => ({
        getAnnotation: mockGetAnnotation,
        updateAnnotation: mockUpdateAnnotation,
        deleteAnnotation: mockDeleteAnnotation,
    });

    const getApi = () => ({
        getAnnotationsAPI,
    });

    const getHook = props =>
        renderHook(() =>
            useAnnotationAPI({
                api: getApi(),
                fileId: 'fileId',
                filePermissions: { can_annotate: true, can_view_annotations: true },
                annotationId: annotation.id,
                errorCallback: jest.fn(),
                ...props,
            }),
        );

    beforeEach(() => {
        mockGetAnnotation = jest.fn();
    });

    test('Should return correct default values', () => {
        const { result } = getHook();

        expect(result.current.annotation).toEqual(undefined);
        expect(result.current.isLoading).toEqual(true);
        expect(result.current.isError).toEqual(false);
    });

    test('Should call fetch annotation on mount', async () => {
        mockGetAnnotation = jest.fn((fileId, annotationId, permissions, successCallback) => {
            successCallback(annotation);
        });
        const { result } = getHook();

        expect(mockGetAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_annotate: true, can_view_annotations: true },
            expect.any(Function),
            expect.any(Function),
            true,
        );
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.isError).toEqual(false);
        expect(result.current.annotation).toEqual(annotation);
    });

    test('should call api function on handleEdit with correct arguments and set pending state', () => {
        const { result } = getHook();

        act(() => {
            result.current.handleEdit(annotation.id, 'new text', { can_edit: true });
        });

        expect(mockUpdateAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_edit: true },
            { message: 'new text' },
            expect.any(Function),
            expect.any(Function),
        );
        expect(result.current.annotation.isPending).toEqual(true);
    });

    test('should call api function on handleResolve with correct arguments', () => {
        const { result } = getHook();

        act(() => {
            result.current.handleResolve(annotation.id, 'resolved', { can_resolve: true });
        });

        expect(mockUpdateAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_resolve: true },
            { status: 'resolved' },
            expect.any(Function),
            expect.any(Function),
        );
        expect(result.current.annotation.isPending).toEqual(true);
    });

    test('should call api function on handleDelete with correct arguments', () => {
        const { result } = getHook();

        act(() => {
            result.current.handleDelete({
                id: annotation.id,
                permissions: { can_delete: true },
            });
        });

        expect(mockDeleteAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_delete: true },
            expect.any(Function),
            expect.any(Function),
        );
        expect(result.current.annotation.isPending).toEqual(true);
    });
});

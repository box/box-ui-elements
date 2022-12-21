import { annotation as mockAnnotation } from '../../../../../__mocks__/annotations';

export default () => ({
    annotation: mockAnnotation,
    annotationActions: {
        handleDelete: jest.fn(),
        handleEdit: jest.fn(),
        handleResolve: jest.fn(),
    },
    annotationEvents: {
        handleAnnotationCreateStart: jest.fn(),
        handleAnnotationCreateEnd: jest.fn(),
    },
    error: {},
    isLoading: false,
    replies: [],
    repliesActions: {
        handleCreateReply: jest.fn(),
        handleEditReply: jest.fn(),
        handleDeleteReply: jest.fn(),
    },
});

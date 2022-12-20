// @flow
import { render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import AnnotationThread from '../AnnotationThread';
import { annotation as mockAnnotation } from '../../../../../__mocks__/annotations';

jest.mock('react-intl', () => jest.requireActual('react-intl'));
jest.mock('../AnnotationThreadContent', () => () => <div data-testid="annotation-content" />);
jest.mock('../AnnotationThreadCreate', () => () => <div data-testid="annotation-create" />);

jest.mock('../useAnnotationThread', () => {
    return jest.fn(() => ({
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
    }));
});

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThread', () => {
    const file = {
        id: 'fileId',
        file_version: { id: '123' },
        permissions: {
            can_view_annotations: true,
            can_annotate: true,
        },
    };

    const IntlWrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };
    const getWrapper = props => render(<AnnotationThread file={file} {...props} />, { wrapper: IntlWrapper });

    test('should render AnnotationThreadCreate if annotationId is undefined', async () => {
        const { queryByTestId } = getWrapper();
        expect(queryByTestId('annotation-create')).toBeInTheDocument();
        expect(queryByTestId('annotation-content')).toBeNull();
    });

    test('should render AnnotationThreadContent if annotationId is defined', () => {
        const { queryByTestId } = getWrapper({ annotationId: '1' });
        expect(queryByTestId('annotation-content')).toBeInTheDocument();
        expect(queryByTestId('annotation-create')).toBeNull();
    });
});

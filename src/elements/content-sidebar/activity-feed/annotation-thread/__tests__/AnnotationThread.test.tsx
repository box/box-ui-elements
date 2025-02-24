import { render } from '@testing-library/react';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { EventEmitter } from 'events';
import AnnotationThread from '../AnnotationThread';
import { BoxItem } from '../../../../../common/types/core';

jest.mock('react-intl', () => jest.requireActual('react-intl'));
jest.mock('../AnnotationThreadContent', () => () => <div data-testid="annotation-content" />);
jest.mock('../AnnotationThreadCreate', () => () => <div data-testid="annotation-create" />);

jest.mock('../useAnnotationThread', () => ({
    __esModule: true,
    default: () => ({
        annotation: undefined,
        replies: [],
        isLoading: false,
        error: undefined,
        annotationActions: {
            handleAnnotationCreate: jest.fn(),
            handleAnnotationDelete: jest.fn(),
            handleAnnotationEdit: jest.fn(),
            handleAnnotationStatusChange: jest.fn(),
        },
        repliesActions: {
            handleReplyCreate: jest.fn(),
            handleReplyDelete: jest.fn(),
            handleReplyEdit: jest.fn(),
        },
    }),
}));

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThread', () => {
    const file: BoxItem = {
        id: 'fileId',
        name: 'test.pdf',
        type: 'file',
        size: 1234,
        file_version: { id: '123', type: 'file_version', sha1: 'abc' },
        permissions: {
            can_view_annotations: true,
            can_annotate: true,
            can_comment: true,
            can_delete: false,
            can_download: true,
            can_preview: true,
            can_upload: false,
            can_rename: false,
            can_share: true,
        },
        created_at: '2024-02-24T18:28:59Z',
        modified_at: '2024-02-24T18:28:59Z',
        owned_by: {
            id: '123',
            name: 'Test User',
            login: 'test@box.com',
            type: 'user',
        },
    };

    const IntlWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };
    const defaultProps = {
        clientName: 'test-client',
        currentUser: {
            id: '123',
            name: 'Test User',
            login: 'test@box.com',
            type: 'user',
        },
        eventEmitter: new EventEmitter(),
        file,
        handleCancel: jest.fn(),
        onAnnotationCreate: jest.fn(),
        onError: jest.fn(),
        target: { location: { type: 'page', value: 1 } },
        token: 'test-token',
    };

    const getWrapper = (props: Partial<React.ComponentProps<typeof AnnotationThread>> = {}) =>
        render(<AnnotationThread {...defaultProps} {...props} />, { wrapper: IntlWrapper });

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

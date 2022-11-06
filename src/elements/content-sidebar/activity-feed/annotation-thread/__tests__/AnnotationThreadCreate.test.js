// @flow
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnnotationThreadCreate from '../AnnotationThreadCreate';
import { annotation } from '../../../../../__mocks__/annotations';
import useAnnotatorEvents from '../../../../common/annotator-context/useAnnotatorEvents';

jest.mock('lodash/uniqueId', () => prefix => `${prefix}42`);
jest.mock('react-intl', () => jest.requireActual('react-intl'));
jest.mock('../../comment-form', () => props => {
    return (
        <div>
            {props.isOpen && (
                <div>
                    <button type="button" onClick={props.onCancel}>
                        Cancel
                    </button>
                    <button type="button" onClick={() => props.onSubmit('example message')}>
                        Post
                    </button>
                </div>
            )}
        </div>
    );
});
jest.mock('../../../../common/annotator-context/useAnnotatorEvents', () => {
    const mockedEmitAddAnnotationStartEvent = jest.fn();
    const mockedEmitAddAnnotationEndEvent = jest.fn();

    return jest.fn(() => ({
        emitAddAnnotationStartEvent: mockedEmitAddAnnotationStartEvent,
        emitAddAnnotationEndEvent: mockedEmitAddAnnotationEndEvent,
    }));
});

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThreadCreate', () => {
    const mockHandleCancel = jest.fn();
    const mockOnAnnotationCreate = jest.fn();
    const mockOnError = jest.fn();
    const mockEventEmitter = {};
    let mockCreateAnnotation = jest.fn();

    const getDefaultProps = () => ({
        api: {
            getAnnotationsAPI: () => ({
                createAnnotation: mockCreateAnnotation,
            }),
        },
        currentUser: { id: 'user_id' },
        eventEmitter: mockEventEmitter,
        file: {
            id: 'file_id',
            file_version: { id: 'file_version' },
            permissions: { can_annotate: true },
        },
        handleCancel: mockHandleCancel,
        onAnnotationCreate: mockOnAnnotationCreate,
        onError: mockOnError,
        target: {
            location: { type: 'page', value: 1 },
            type: 'point',
            x: 12,
            y: 10,
        },
    });

    const IntlWrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };
    const getWrapper = (props = getDefaultProps()) =>
        render(<AnnotationThreadCreate {...props} />, { wrapper: IntlWrapper });

    test('Should render correctly', () => {
        const { container, getByText } = getWrapper();

        expect(getByText('Cancel')).toBeInTheDocument();
        expect(container.getElementsByClassName('AnnotationThreadCreate-is-pending')).toHaveLength(0);
    });

    test('Should handle create', () => {
        mockCreateAnnotation = jest.fn((fileId, fileVersionId, payload, filePermissions, successCallback) => {
            successCallback(annotation);
        });
        const { getByText, getByTestId } = getWrapper();

        fireEvent.click(getByText('Post'));

        expect(mockOnAnnotationCreate).toBeCalledWith(annotation);
        expect(mockCreateAnnotation).toBeCalledWith(
            'file_id',
            'file_version',
            {
                description: { message: 'example message' },
                target: {
                    location: { type: 'page', value: 1 },
                    type: 'point',
                    x: 12,
                    y: 10,
                },
            },
            { can_annotate: true },
            expect.any(Function),
            mockOnError,
        );

        expect(getByTestId('annotation-create')).toHaveClass('is-pending');
    });

    test('should use annotatorEvents on annotation add', () => {
        mockCreateAnnotation = jest.fn((fileId, fileVersionId, payload, filePermissions, successCallback) => {
            successCallback(annotation);
        });
        const props = getDefaultProps();
        const { getByText } = getWrapper(props);
        const { eventEmitter } = props;

        fireEvent.click(getByText('Post'));

        expect(useAnnotatorEvents).toBeCalledWith({ eventEmitter });
        expect(useAnnotatorEvents().emitAddAnnotationStartEvent).toBeCalledWith(
            { text: 'example message' },
            'annotation_42',
        );
        expect(useAnnotatorEvents().emitAddAnnotationEndEvent).toBeCalledWith(annotation, 'annotation_42');
    });

    test('Should call handleCancel on cancel', () => {
        const { getByText } = getWrapper();

        fireEvent.click(getByText('Cancel'));

        expect(mockHandleCancel).toBeCalled();
    });
});

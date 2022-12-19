// @flow
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnnotationThreadCreate from '../AnnotationThreadCreate';
import { annotation as mockAnnotation } from '../../../../../__mocks__/annotations';

jest.mock('lodash/uniqueId', () => () => 'uniqueId');
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

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThreadCreate', () => {
    const getApiProp = annotationsAPIProps => ({
        getAnnotationsAPI: () => ({
            createAnnotation: jest.fn(),
            ...annotationsAPIProps,
        }),
    });

    const getDefaultProps = () => ({
        currentUser: { id: 'user_id' },
        file: {
            id: 'file_id',
            file_version: { id: 'file_version' },
            permissions: { can_annotate: true },
        },
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
    const getWrapper = (props, annotationsAPIProps = {}) =>
        render(<AnnotationThreadCreate api={getApiProp(annotationsAPIProps)} {...getDefaultProps()} {...props} />, {
            wrapper: IntlWrapper,
        });

    test('Should render correctly', () => {
        const { container, getByText } = getWrapper();

        expect(getByText('Cancel')).toBeInTheDocument();
        expect(container.getElementsByClassName('AnnotationThreadCreate-is-pending')).toHaveLength(0);
    });

    test('Should handle create', () => {
        const createAnnotation = jest.fn((fileId, fileVersionId, payload, filePermissions, successCallback) => {
            successCallback(mockAnnotation);
        });
        const onAnnotationCreateStart = jest.fn();
        const onAnnotationCreateEnd = jest.fn();
        const onError = jest.fn();
        const target = { x: 1, y: 1 };

        const { getByText, getByTestId } = getWrapper(
            { onAnnotationCreateEnd, onAnnotationCreateStart, onError, target },
            { createAnnotation },
        );

        fireEvent.click(getByText('Post'));

        expect(onAnnotationCreateStart).toBeCalledWith(
            {
                description: { message: 'example message' },
                target,
            },
            'uniqueId',
        );
        expect(createAnnotation).toBeCalledWith(
            'file_id',
            'file_version',
            {
                description: { message: 'example message' },
                target,
            },
            { can_annotate: true },
            expect.any(Function),
            onError,
        );
        expect(onAnnotationCreateEnd).toBeCalledWith(mockAnnotation, 'uniqueId');
        expect(getByTestId('annotation-create')).toHaveClass('is-pending');
    });

    test('Should call handleCancel on cancel', () => {
        const handleCancel = jest.fn();

        const { getByText } = getWrapper({ handleCancel });

        fireEvent.click(getByText('Cancel'));

        expect(handleCancel).toBeCalled();
    });
});
